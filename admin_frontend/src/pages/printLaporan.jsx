import React from 'react'
import axios from 'axios'

export default class PrintLaporan extends React.Component {
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
                this.state.start = localStorage.getItem('start')
                this.state.end = localStorage.getItem('end')
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

    betweenDate = () => {
        // e.preventDefault()
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
                    window.print()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.subtotal)
        })
        return total
    }

    componentDidMount = () => {
        this.betweenDate()
        // this.getTransaksiOutlet()
    }

    render() {
        return (
            <div className="container p-1 mt-5">
                <h2 className="text-center mb-3"> SKYDASH LAUNDRY SERVICE</h2>
                <h3 className="text-center mb-5">Data Transaksi Laundry</h3>
                <br />
                {/* <div className="table-responsive"> */}
                <table className="table table-bordered mb-5">
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
                        <tr>
                            <td colSpan="10">Total Pendapatan</td>
                            <td>{this.state.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}