import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import axios from 'axios'

export default class DetailTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            transaksi_id: "",
            admin_id: "",
            admin_name: "",
            total: 0
            // customer: "",
        }
        if (localStorage.getItem('token') && localStorage.getItem('transaksi_id')) {
            this.state.token = localStorage.getItem('token')
            this.state.transaksi_id = localStorage.getItem('transaksi_id')
            this.state.admin_id = localStorage.getItem('admin_id')
            this.state.admin_name = localStorage.getItem('admin_name')
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

    getTransaksiId = () => {
        let url = "http://localhost:9000/transaksi/id/" + this.state.transaksi_id

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
        console.log(this.state.transaksi_id)
    }

    Cetak = id => {
        localStorage.setItem("transaksi_id", id)
        window.location = '/cetakTransaksi'
    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.price) * Number(it.qty)
        })
        return total
    }

    componentDidMount = () => {
        this.getTransaksiId()
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
                            <div className="card">
                                <div className="card-body p-4">
                                    <h3 className="text-center mb-4">Data Transaksi Laundry</h3><hr />
                                    <form className="forms-sample mt-4">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">ID Transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="transaksi_id" className="form-control" value={this.state.transaksi_id} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Outlet</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="outlet" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.outlet.name
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Admin</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="admin" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.admin.name
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Customer</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="customer" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.customer.name
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal Transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.tgl
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Batas Waktu Laundry</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="batas_waktu" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.batas_waktu
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl_bayar" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.tgl_bayar
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status Order</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="status" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.status
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="dibayar" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.dibayar
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h4 className="text-center">Detail Laundry</h4>
                                    <table className="table table-bordered mb-3 mt-4">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Jenis Laundry</th>
                                                <th>Harga</th>
                                                <th>Jumlah</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.transaksi.map((item, index) => (
                                                item.detail_transaksi.map((it, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{it.paket.types}</td>
                                                            <td>Rp {it.paket.price}</td>
                                                            <td>{it.qty} kg</td>
                                                            <td className="text-right">Rp {it.subtotal}</td>
                                                        </tr>
                                                    )
                                                })
                                            ))}
                                            {this.state.transaksi.map((item, index) => (
                                                <tr>
                                                    <td colSpan="4"><b>Total</b></td>
                                                    <td className="text-right">Rp {this.state.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3 p-3">
                                <div className="d-flex justify-content-center">
                                    <a className="btn btn-dark mr-2" href="/transaksi">Back</a>
                                    <a href="/cetakTransaksi" target="_blank" class='btn btn-primary'>Cetak Transaksi</a>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}