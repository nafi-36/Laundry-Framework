import React from 'react'
import axios from 'axios'

export default class CetakTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            transaksi_id: "",
            admin_id: "",
            admin_name: "",
            // customer: "",
            total: 0
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("transaksi_id") !== null) {
                if (localStorage.getItem("role") === "Kasir" || localStorage.getItem("role") === "Owner") {
                    this.state.token = localStorage.getItem('token')
                    this.state.transaksi_id = localStorage.getItem('transaksi_id')
                    this.state.admin_id = localStorage.getItem('admin_id')
                    this.state.admin_name = localStorage.getItem('admin_name')
                } else {
                    window.alert("Anda bukan Kasir / Owner")
                    window.location = "/"
                }
            } else {
                window.alert("Klik button Detail kemudian Cetak Transaksi untuk mencetak transaksi")
                window.location = '/transaksi'
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
            <div className="container p-5">
                <h2 className="text-center mb-3"> SKYDASH LAUNDRY SERVICE</h2>
                <h3 className="text-center mb-5">Data Transaksi Laundry</h3>
                <hr />
                <form className="forms-sample mt-5 mb-4">
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">ID Transaksi</label>
                        <div className="col-sm-9">
                            <input type="text" name="transaksi_id" className="form-control" value={this.state.transaksi_id} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Outlet</label>
                        <div className="col-sm-9">
                            <input type="text" name="outlet" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.outlet.name
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Admin</label>
                        <div className="col-sm-9">
                            <input type="text" name="admin" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.admin.name
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Customer</label>
                        <div className="col-sm-9">
                            <input type="text" name="customer" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.customer.name
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Tanggal Transaksi</label>
                        <div className="col-sm-9">
                            <input type="text" name="tgl" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.tgl
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Batas Waktu Laundry</label>
                        <div className="col-sm-9">
                            <input type="text" name="batas_waktu" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.batas_waktu
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Tanggal Bayar</label>
                        <div className="col-sm-9">
                            <input type="text" name="tgl_bayar" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.tgl_bayar
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Status Order</label>
                        <div className="col-sm-9">
                            <input type="text" name="status" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.status
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
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
                <hr /><br />
                <h4 className="text-center">Detail Laundry</h4>
                <table className="table table-bordered mb-3 mt-5">
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
                        {/* {this.state.transaksi.map((item, index) => ( */}
                        <tr>
                            <td colSpan="4"><b>Total</b></td>
                            <td className="text-right">Rp {this.state.total}</td>
                        </tr>
                        {/* ))} */}
                    </tbody>
                </table>
                {window.print()}
            </div>
        )
    }
}