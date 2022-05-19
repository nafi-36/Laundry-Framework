import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'

export default class Transaksi extends React.Component {
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
            total: 0
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("role") === "Kasir" || localStorage.getItem("role") === "Owner") {
                this.state.token = localStorage.getItem('token')
                this.state.outlet_id = localStorage.getItem('outlet_id')
            } else {
                window.alert("Anda bukan Kasir / Owner")
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
                    total: res.data.sumTotal
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/transaksi/search/" + this.state.outlet_id
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        transaksi: res.data.transaksi
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    Edit = item => {
        if (localStorage.getItem("role") === "Owner") {
            window.alert("Anda bukan Kasir")
        } else {
            let url = "http://localhost:9000/transaksi/id/" + item.transaksi_id

            axios.get(url, this.headerConfig())
                .then(res => {
                    this.setState({
                        transaksi_id: item.transaksi_id,
                        customer: item.customer.name,
                        admin: item.admin.name,
                        outlet: item.outlet.name,
                        tgl: item.tgl,
                        batas_waktu: item.batas_waktu,
                        tgl_bayar: item.tgl_bayar,
                        status: item.status,
                        dibayar: item.dibayar,
                        detail_transaksi: item.detail_transaksi,
                        isModalOpen: true,
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    Detail = item => {
        let id = item.transaksi_id
        localStorage.setItem("transaksi_id", id)
        window.location = '/detailTransaksi'
    }

    // getAmount = detail => {
    //     let total = 0
    //     detail.map(it => {
    //         total += Number(it.paket.price) * Number(it.qty)
    //     })
    //     return total
    // }

    Save = e => {
        e.preventDefault()
        let bayar = ""
        let tanggal = ""
        if (this.state.status === "Diambil") {
            bayar = "Lunas"
            tanggal = new Date().toLocaleDateString('en-CA')
        } else {
            bayar = this.state.dibayar
            tanggal = null
        }

        let form = {
            batas_waktu: this.state.batas_waktu,
            tgl_bayar: tanggal,
            status: this.state.status,
            dibayar: bayar
        }
        // let url = ""
        // if (this.state.action === "insert") {
        let url = "http://localhost:9000/transaksi/" + this.state.transaksi_id
        axios.post(url, form, this.headerConfig())
            .then(response => {
                // window.alert(response.data.message)
                this.getTransaksiOutlet()
                this.handleColse()
            })
            .catch(error => console.log(error))

        this.setState({
            isModalOpen: false,
        })
    }

    getAmount = detail => {
        let total = 0
        detail.map(it => {
            total += Number(it.subtotal)
        })
        return total
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount = () => {
        this.getTransaksiOutlet()
        // this.getTransaksiId()
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
                            <p>Cari data transaksi : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter transaction's id / admin / customer / status"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            {/* <div className="card"> */}
                            {/* <div className="table-responsive"> */}
                            <table className="table table-transparent table-responsive">
                                <thead className="text-center">
                                    <tr>
                                        <th>No.</th>
                                        {/* <th>ID Transaksi</th> */}
                                        <th>Admin</th>
                                        <th>Customer</th>
                                        <th>Tanggal Transaksi</th>
                                        <th>Batas Waktu</th>
                                        <th>Tanggal Bayar</th>
                                        <th>Status Order</th>
                                        <th>Status Bayar</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {this.state.transaksi.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                {/* <td>{item.transaksi_id}</td> */}
                                                <td>{item.admin.name}</td>
                                                <td>{item.customer.name}</td>
                                                <td>{item.tgl}</td>
                                                <td>{item.batas_waktu}</td>
                                                <td>{item.tgl_bayar}</td>
                                                <td>{
                                                    item.status === "Baru" ? (<button className="btn btn-sm btn-danger">{item.status}</button>) : (<button></button>) &&
                                                        item.status === "Proses" ? (<button className="btn btn-sm btn-warning">{item.status}</button>) : (<button></button>) &&
                                                            item.status === "Selesai" ? (<button className="btn btn-sm btn-success">{item.status}</button>) : (<button></button>) &&
                                                                item.status === "Diambil" ? (<button className="btn btn-sm btn-info">{item.status}</button>) : (<button></button>)
                                                }</td>
                                                <td>{
                                                    item.dibayar === "Belum bayar" ? (<button className="btn btn-sm btn-danger">{item.dibayar}</button>) : (<button></button>) &&
                                                        item.dibayar === "Lunas" ? (<button className="btn btn-sm btn-success">{item.dibayar}</button>) : (<button></button>)
                                                }</td>
                                                <td>{item.status === "Diambil" && item.dibayar === "Lunas" ? (
                                                    <div>
                                                        <button className="btn btn-sm btn-primary m-1"
                                                            onClick={() => this.Edit(item)} disabled>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-secondary m-1"
                                                            onClick={() => this.Detail(item)}>
                                                            Detail
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button className="btn btn-sm btn-primary m-1"
                                                            onClick={() => this.Edit(item)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-secondary m-1"
                                                            onClick={() => this.Detail(item)}>
                                                            Detail
                                                        </button>
                                                    </div>
                                                )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {/* </div> */}

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Transaksi</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.Save(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="transaksi_id">
                                            <Form.Label>ID Transaksi</Form.Label>
                                            <Form.Control type="text" name="transaksi_id"
                                                value={this.state.transaksi_id} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="admin_id">
                                            <Form.Label>Outlet</Form.Label>
                                            <Form.Control type="text" name="admin_id"
                                                value={this.state.outlet} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="admin_id">
                                            <Form.Label>Admin</Form.Label>
                                            <Form.Control type="text" name="admin_id"
                                                value={this.state.admin} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="customer_id">
                                            <Form.Label>Customer</Form.Label>
                                            <Form.Control type="text" name="customer_id"
                                                value={this.state.customer} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="tgl">
                                            <Form.Label>Tanggal Transaksi</Form.Label>
                                            <Form.Control type="text" name="tgl"
                                                value={this.state.tgl} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="batas_waktu">
                                            <Form.Label>Batas Waktu Laundry</Form.Label>
                                            <Form.Control type="date" name="batas_waktu"
                                                value={this.state.batas_waktu} onChange={e => this.setState({ batas_waktu: e.target.value })} required />
                                        </Form.Group>
                                        {/* <Form.Group className="mb-2" controlId="tgl_bayar">
                                            <Form.Label>Tanggal Bayar</Form.Label>
                                            <Form.Control type="date" name="tgl_bayar"
                                                value={this.state.tgl_bayar} onChange={e => this.setState({ tgl_bayar: e.target.value })} required />
                                        </Form.Group> */}
                                        <Form.Group className="mb-2" controlId="status">
                                            <label for="exampleSelectGender">Status Order</label><br />
                                            <select type="text" name="status" class="form-control" id="exampleSelectGender"
                                                onChange={e => this.setState({ status: e.target.value })} required >
                                                <option value={this.state.status}>{this.state.status}</option>
                                                <option value="Baru">Baru</option>
                                                <option value="Proses">Proses</option>
                                                <option value="Selesai">Selesai</option>
                                                <option value="Diambil">Diambil</option>
                                            </select>
                                        </Form.Group>
                                        {/* <Form.Group className="mb-2" controlId="dibayar">
                                            <label for="exampleSelectGender">Status Bayar</label><br />
                                            <select type="text" name="status" class="form-control" id="exampleSelectGender"
                                                onChange={e => this.setState({ dibayar: e.target.value })} required >
                                                <option value={this.state.dibayar}>{this.state.dibayar}</option>
                                                <option value="Lunas">Lunas</option>
                                                <option value="Belum bayar">Belum bayar</option>
                                            </select>
                                        </Form.Group> */}
                                        <Form.Group className="mb-2" controlId="dibayar">
                                            <Form.Label>Status Bayar</Form.Label>
                                            <Form.Control type="text" name="dibayar"
                                                value={this.state.dibayar} disabled />
                                        </Form.Group>
                                        <hr />
                                        <h5 className="text-center mt-3">Detail Laundry</h5>
                                        <table className="table table-bordered mb-3 mt-4">
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Paket</th>
                                                    <th>Price</th>
                                                    <th>Qty</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.detail_transaksi.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.paket.types}</td>
                                                        <td>Rp {item.paket.price}</td>
                                                        <td>{item.qty} kg</td>
                                                        <td className="text-right">Rp {item.subtotal}</td>
                                                    </tr>
                                                ))}
                                                {/* {this.state.detail_transaksi.map((item, index) => ( */}
                                                <tr>
                                                    <td colSpan="4" className="text-bold">Total</td>
                                                    <td className="text-right">Rp {this.getAmount(this.state.detail_transaksi)}</td>
                                                </tr>
                                                {/* ))} */}
                                            </tbody>
                                        </table>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="dark" onClick={this.handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Save
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}