import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import axios from 'axios'

export default class FormTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            outlet_id: "",
            outlet_name: "",
            admin_id: "",
            admin_name: "",
            customer_id: "",
            customer_name: "",
            cart: [],   // untuk menyimpan list cart
            total: 0,   // untuk menyimpan data total belanja
            batas_waktu: "",
            tgl_bayar: null,
            status: "Baru",
            dibayar: "Belum Bayar"
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("customer_id") !== null && localStorage.getItem("cart") !== null) {
                if (localStorage.getItem("role") === "Kasir") {
                    this.state.token = localStorage.getItem("token")
                    this.state.admin_id = localStorage.getItem("admin_id")
                    this.state.customer_id = localStorage.getItem("customer_id")
                    // this.state.outlet_id = localStorage.getItem("outlet_id")
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Customer / Cart kosong")
                window.location = '/selectCustomer'
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

    // handleChange = (e) => {
    //     this.setState({
    //         [e.target.name]: e.target.value
    //     })
    // }

    getAdminId = () => {
        let url = "http://localhost:9000/admin/id/" + this.state.admin_id

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    outlet_id: res.data.admin.outlet_id,
                    admin_name: res.data.admin.name,
                    outlet_name: res.data.admin.outlet.name,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getCustomerId = () => {
        let url = "http://localhost:9000/customer/" + this.state.customer_id

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    customer_name: res.data.customer.name
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    initCart = () => {
        // memanggil data cart pada localStorage
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        // kalkulasi total harga
        let totalHarga = 0
        tempCart.map(item => {
            totalHarga += (item.price * item.qty)
        })

        // memasukkan data cart, user, dan total harga pada state
        this.setState({
            cart: tempCart,
            total: totalHarga
        })
    }

    checkOut = (e) => {
        e.preventDefault()
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }
        let data = {
            customer_id: this.state.customer_id,
            admin_id: this.state.admin_id,
            outlet_id: this.state.outlet_id,
            batas_waktu: this.state.batas_waktu,
            tgl_bayar: this.state.tgl_bayar,
            status: this.state.status,
            dibayar: this.state.dibayar,
            total: this.state.total,
            detail_transaksi: tempCart
        }
        let url = "http://localhost:9000/transaksi"
        axios.post(url, data, this.headerConfig())
            .then(res => {
                // clear cart
                window.alert(res.data.message)
                localStorage.removeItem("cart")
                localStorage.removeItem("customer_id")
                // localStorage.removeItem("customer")
                window.location = "/transaksi"
            })
            .catch(error => {
                if (error.res) {
                    if (error.res.status) {
                        window.alert(error.res.data.message)
                        // this.props.history.push("/login")
                    }
                } else {
                    console.log(error);
                }
            })
    }

    componentDidMount = () => {
        this.initCart()
        this.getAdminId()
        this.getCustomerId()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h3 className="text-center mb-4">From Transaksi Laundry</h3><hr />
                                    <form className="forms-sample mt-4" onSubmit={e => this.checkOut(e)}>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Outlet</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="admin_id" className="form-control" value={this.state.outlet_name} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Admin</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="admin_id" className="form-control" value={this.state.admin_name} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Customer</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="customer_id" className="form-control" value={this.state.customer_name} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal Transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl" className="form-control" value={new Date().toLocaleDateString('en-CA')} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Batas Waktu Laundry</label>
                                            <div className="col-sm-9">
                                                <input type="date" name="batas_waktu" className="form-control mb-2" onChange={e => this.setState({ batas_waktu: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl_bayar" className="form-control mb-2" value="-" disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status Order</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="status" className="form-control mb-2" value={this.state.status} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="dibayar" className="form-control mb-2" value={this.state.dibayar} disabled />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <a className="btn btn-dark mr-2" href="/cart">Back</a>
                                            <button className="btn btn-primary" type="submit">Continue</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h4 className="text-center">Detail Transaksi</h4>
                                    <table className="table table-bordered mb-3 mt-4">
                                        <thead>
                                            <tr>
                                                <th>Paket</th>
                                                <th>Price</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cart.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.types}</td>
                                                    <td>Rp {item.price}</td>
                                                    <td>{item.qty} kg</td>
                                                    <td className="text-right">Rp {item.price * item.qty}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3">Total</td>
                                                <td className="text-right">Rp {this.state.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
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