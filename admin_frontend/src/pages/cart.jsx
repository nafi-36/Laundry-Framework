import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import axios from 'axios'

export default class Cart extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            admin_id: "",
            admin_name: "",
            customer_id: "",
            customer: [],
            cart: [],   // untuk menyimpan list cart
            total: 0,   // untuk menyimpan data total belanja
        }
        // if (localStorage.getItem('token')) {
        //     this.state.token = localStorage.getItem('token')
        //     this.state.admin_id = localStorage.getItem('admin_id')
        //     this.state.admin_name = localStorage.getItem('admin_name')
        // }
        // else {
        //     window.location = '/login'
        // }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Kasir") {
                this.state.token = localStorage.getItem("token")
                this.state.admin_id = localStorage.getItem('admin_id')
                this.state.admin_name = localStorage.getItem('admin_name')
                this.state.customer_id = localStorage.getItem('customer_id')
            } else {
                window.alert("Anda bukan Admin / Kasir")
                window.location = "/"
            }
            // this.state.id = localStorage.getItem("admin_id")
        } else {
            window.location = "/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getCustomer = () => {
        let url = "http://localhost:9000/customer/" + this.state.customer_id

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    customer: res.data.customer
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

        // if (localStorage.getItem("customer") !== null) {
        //     let customer = JSON.parse(localStorage.getItem("customer"))
        //     this.setState({
        //         customer_id: customer.customer_id,
        //         customer_name: customer.name
        //     })
        // }

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

    editItem = selectedItem => {
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        let index = tempCart.findIndex(it => it.paket_id === selectedItem.paket_id)
        let promptJumlah = window.prompt(`Masukkan jumlah (kg) ${selectedItem.types} yang akan di laundry`, selectedItem.qty)
        if (promptJumlah === null || promptJumlah === "" || promptJumlah === "0") {
            window.alert("Tidak boleh kosong")
        } else {
            tempCart[index].qty = promptJumlah
            tempCart[index].subtotal = selectedItem.price * promptJumlah
        }
        // tempCart[index].qty = promptJumlah

        // update localStorage
        localStorage.setItem("cart", JSON.stringify(tempCart))

        // refresh cart
        this.initCart()
    }

    dropItem = selectedItem => {
        if (window.confirm(`Apakah anda yakin menghapus ${selectedItem.types} dari cart?`)) {
            let tempCart = []
            if (localStorage.getItem("cart") !== null) {
                tempCart = JSON.parse(localStorage.getItem("cart"))
            }

            let index = tempCart.findIndex(it => it.paket_id === selectedItem.paket_id)
            tempCart.splice(index, 1)

            // update localStorage
            localStorage.setItem("cart", JSON.stringify(tempCart))

            // refresh cart
            this.initCart()
        }
    }

    check = () => {
        window.location = '/formTransaksi'
    }

    // checkOut = () => {
    //     let tempCart = []
    //     if (localStorage.getItem("cart") !== null) {
    //         tempCart = JSON.parse(localStorage.getItem("cart"))
    //     }
    //     let data = {
    //         customer_id: this.state.customer_id,
    //         admin_id: this.state.admin_id,
    //         batas_waktu: req.body.batas_waktu,
    //         // tgl_bayar: req.body.tgl_bayar,
    //         // status: req.body.status,
    //         // dibayar: req.body.dibayar,
    //         // detail_transaksi: tempCart
    //     }
    //     let url = "http://localhost:9000/transaksi"
    //     axios.post(url, data, this.headerConfig())
    //         .then(res => {
    //             // clear cart
    //             window.alert(res.data.message)
    //             localStorage.removeItem("cart")
    //             window.location = "/transactionForm"
    //         })
    //         .catch(error => {
    //             if (error.res) {
    //                 if (error.res.status) {
    //                     window.alert(error.res.data.message)
    //                     // this.props.history.push("/login")
    //                 }
    //             } else {
    //                 console.log(error);
    //             }
    //         })
    // }

    componentDidMount = () => {
        this.initCart()
        this.getCustomer()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Keranjang Transaksi</h3>
                            <hr />
                            <div className="card col-12 mt-4 mb-4">
                                <h3 className="text-center mt-3">Cart List</h3>
                                <hr />
                                {this.state.cart.length === 0 ? (
                                    <div className="mb-3">
                                        <h4 className="mb-4">Cart is empty !</h4>
                                        <a href="/selectCustomer" className="btn btn-primary">Add Cart</a>
                                    </div>
                                ) : (
                                <div className="card-body text-white mt-0">
                                    <div className="text-dark mb-4">
                                        <h6>Admin: {this.state.admin_name}</h6>
                                        <h6>Customer: {this.state.customer.name}</h6>
                                    </div>
                                    <table className="table table-bordered mb-3">
                                        <thead>
                                            <tr>
                                                <th>Paket</th>
                                                <th>Price</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cart.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.types}</td>
                                                    <td>Rp {item.price}</td>
                                                    <td>{item.qty} kg</td>
                                                    <td className="text-right">Rp {item.price * item.qty}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary m-1"
                                                            onClick={() => this.editItem(item)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-danger m-1"
                                                            onClick={() => this.dropItem(item)}>
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3">Total</td>
                                                <td className="text-right">Rp {this.state.total}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning btn-block m-1"
                                                        onClick={this.check}
                                                        disabled={this.state.cart.length === 0}>
                                                        Checkout
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="/selectLaundry" className="btn btn-primary">Add Cart</a>
                                </div>
                                )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}