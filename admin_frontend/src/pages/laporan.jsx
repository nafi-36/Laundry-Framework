import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import Print from '@mui/icons-material/Print'
import axios from 'axios'

export default class Laporan extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            outlet_id: "",
            transaksi: [],
            transaksi_id: "",
            // admin_id: "",
            // customer_id: "",
            customer: "",
            admin: "",
            outlet: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: null,
            status: "",
            dibayar: "",
            detail_transaksi: [],
            isModalOpen: false,
            start: "",
            end: "",
            total: 0
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("role") === "Owner") {
                this.state.token = localStorage.getItem('token')
                this.state.outlet_id = localStorage.getItem('outlet_id')
            } else {
                window.alert("Anda bukan Owner")
                window.location = "/"
            }
        }
        else {
            window.location = '/login'
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getTransaksiOutlet = () => {
        let url = "http://localhost:9000/transaksi/" + this.state.outlet_id

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi,
                    total: res.data.sumTotal,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    betweenDate = (e) => {
        e.preventDefault()
        if (this.state.start === "" && this.state.end === "") {
            this.getTransaksiOutlet()
        } else {
            let url = "http://localhost:9000/transaksi/date/" + this.state.outlet_id
            let data = {
                start: this.state.start, 
                end: this.state.end
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        transaksi: res.data.transaksi,
                        total: res.data.sumTotal
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    Print = () => {
        // let id = item.transaksi_id
        localStorage.setItem("start", this.state.start)
        localStorage.setItem("end", this.state.end)
        window.open('/printLaporan', '_blank')
        // window.location = '/printLaporan'
    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.subtotal)
        })
        return total
    }

    componentDidMount = () => {
        this.getTransaksiOutlet()
        // this.betweenDate()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Transaksi</h3>
                            <hr />
                            <h6 className="mb-3">Filter transaksi by date :</h6>
                            <form onSubmit={(e) => this.betweenDate(e)}>
                                <div className="row mb-5">
                                    <div className="col-3">
                                        <div className="d-flex">
                                            <label className="mt-2">Start</label>
                                            <input type="date" name="start" className="form-control mx-3"
                                                value={this.state.start}
                                                onChange={e => this.setState({ start: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex">
                                            <label className="mt-2">End</label>
                                            <input type="date" name="end" className="form-control mx-3"
                                                value={this.state.end}
                                                onChange={e => this.setState({ end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" type="submit">Set</button>
                                            <button className="btn btn-sm btn-primary"
                                                onClick={() => this.Print()}>
                                                <span className="mx-1"><Print /> </span>Cetak Laporan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="table-responsive">


                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Admin</th>
                                            <th>Customer</th>
                                            <th>Tgl Transaksi</th>
                                            {/* <th>Batas Waktu</th> */}
                                            {/* <th>Tgl Bayar</th> */}
                                            <th>Status</th>
                                            {/* <th>Bayar</th> */}
                                            <th>Paket</th>
                                            <th>Harga</th>
                                            <th>Qty</th>
                                            <th>Subtotal</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-left">
                                        {this.state.transaksi.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.transaksi_id}</td>
                                                    <td>{item.admin.name}</td>
                                                    <td>{item.customer.name}</td>
                                                    <td>{item.tgl}</td>
                                                    {/* <td>{item.batas_waktu}</td> */}
                                                    {/* <td>{item.tgl_bayar}</td> */}
                                                    <td>{item.status}</td>
                                                    {/* <td>{item.dibayar}</td> */}
                                                    <td><ol>{item.detail_transaksi.map((item, index) => (
                                                        <li>{item.paket.types}</li>
                                                    ))}</ol>
                                                    </td>
                                                    <td>{item.detail_transaksi.map((item, index) => (
                                                        <p>{item.paket.price}</p>
                                                    ))}
                                                    </td>
                                                    <td>{item.detail_transaksi.map((item, index) => (
                                                        <p>{item.qty}</p>
                                                    ))}
                                                    </td>
                                                    <td>{item.detail_transaksi.map((item, index) => (
                                                        <p>{item.subtotal}</p>
                                                    ))}
                                                    </td>
                                                    <td>{this.getAmount(item.detail_transaksi)}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr  >
                                            <td colSpan="10">Total Pendapatan</td>
                                            <td>{this.state.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* <button className="btn btn-sm btn-primary mt-4"
                                onClick="">
                                <span className="mx-1"><Print /> </span>Cetak Laporan
                            </button> */}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}