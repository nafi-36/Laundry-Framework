import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
// import PaketList from '../component/paketList'
import Confirm from '@mui/icons-material/CheckOutlined'
import axios from 'axios'
// import { Modal, Button, Form } from 'react-bootstrap'

export default class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            packages: [],
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("customer_id") !== null) {
                if (localStorage.getItem("role") === "Kasir") {
                    this.state.token = localStorage.getItem("token")
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Pilih customer terlebih dahulu")
                window.location = '/selectCustomer'
            }
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

    getPaket = () => {
        let url = "http://localhost:9000/paket"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    packages: res.data.paket
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/paket/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        packages: res.data.paket
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    addToCart = (selectedItem) => {
        // membuat sebuah variabel untuk menampung cart sementara
        let tempCart = []

        // cek elsistensi dari data cart pada localstorage
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
            // JSON.parse() digunakan untuk mengonversi dari string -> array object
        }

        // cek data yang dipilih user ke keranjang belanja
        let existItem = tempCart.find(item => item.paket_id === selectedItem.paket_id)
        if (existItem) {
            // jika item yang dipilih ada pada keranjang belanja
            window.alert(`Anda telah memilih jenis laundry ${selectedItem.types}`)
        }
        else {
            // user diminta memasukkan jumlah item yang dibeli
            let promptJumlah = window.prompt(`Masukkan jumlah berat (kg) ${selectedItem.types} yang akan di laundry`, "")
            if (promptJumlah === null || promptJumlah === "" || promptJumlah === "0") {
                window.alert("Tidak boleh kosong")
            } else {
                // jika user memasukkan jumlah item yang dibeli
                // menambahkan properti "jumlahBeli" pada item yang dipilih
                selectedItem.qty = promptJumlah
                selectedItem.subtotal = selectedItem.price * promptJumlah
                // masukkan item yang dipilih ke dalam cart
                tempCart.push(selectedItem)
                // simpan array tempCart ke localStorage
                localStorage.setItem("cart", JSON.stringify(tempCart))
            }
            // if (promptJumlah !== null && promptJumlah !== "" && promptJumlah !== "0") {
            //     // jika user memasukkan jumlah item yang dibeli
            //     // menambahkan properti "jumlahBeli" pada item yang dipilih
            //     selectedItem.qty = promptJumlah
            //     // masukkan item yang dipilih ke dalam cart
            //     tempCart.push(selectedItem)
            //     // simpan array tempCart ke localStorage
            //     localStorage.setItem("cart", JSON.stringify(tempCart))
            // }
        }
    }

    componentDidMount = () => {
        this.getPaket()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0">Pilih Paket Laundry</h3>
                            <hr />
                            <p>Cari paket laundry : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter package's id / type"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <div className="row mt-2">
                                {this.state.packages.map((item, index) => {
                                    return (
                                        <div className="col-3 my-2" key={index}>
                                            <div className="card h-100">
                                                <img src={"http://localhost:9000/image/paket/" + item.image} className="card-img-top" alt={item.types} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.types}</h5><hr />
                                                    <p className="card-text">Price: Rp {item.price}</p>
                                                    <div className="row d-flex justify-content-center mt-4">
                                                        <button className="btn btn-sm btn-primary w-100 mx-3" onClick={() => this.addToCart(item)}><span><Confirm /> </span>Confirm</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}