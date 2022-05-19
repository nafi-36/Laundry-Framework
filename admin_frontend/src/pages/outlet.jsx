import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Outlet extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            outlets: [],
            outlet_id: "",
            name: "",
            address: "",
            phone: "",
            action: "",
            isModalOpen: false,
            keyword: ""
            // role: "",
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Admin" || localStorage.getItem("role") === "Owner") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Admin / Owner")
                window.location = "/"
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

    // getAdminOutlet = () => {
    //     let url = "http://localhost:9000/admin/" + this.state.outletID

    //     axios.get(url, this.headerConfig())
    //         .then(res => {
    //             this.setState({
    //                 admins: res.data.admin
    //             })
    //         })
    //         .catch(err => {
    //             console.log(err.message)
    //         })
    // }

    // getAdmin = () => {
    //     let url = "http://localhost:9000/admin"

    //     axios.get(url, this.headerConfig())
    //         .then(res => {
    //             this.setState({
    //                 admins: res.data.admin
    //             })
    //         })
    //         .catch(err => {
    //             console.log(err.message)
    //         })
    // }


    getOutlet = () => {
        let url = "http://localhost:9000/outlet"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    outlets: res.data.outlet
                })
                console.log(this.state.outlet)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/outlet/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        outlets: res.data.outlet
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    Add = () => {
        this.setState({
            action: "insert",
            // outlet_id: "",
            name: "",
            address: "",
            phone: "",
            role: "",
            isModalOpen: true
        })
    }

    Edit = item => {
        this.setState({
            action: "update",
            outlet_id: item.outlet_id,
            name: item.name,
            address: item.address,
            phone: item.phone,
            isModalOpen: true
        })
    }


    saveOutlet = e => {
        e.preventDefault()
        let form = {
            // outlet_id: this.state.outlet_id,
            name: this.state.name,
            address: this.state.address,
            phone: this.state.phone
        }
        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:9000/outlet"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getOutlet()
                    this.handleClose()
                })
                .catch(error => console.log(error))
        }
        else if (this.state.action === "update") {
            url = "http://localhost:9000/outlet/" + this.state.outlet_id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getOutlet()
                    this.handleClose()
                })
                .catch(error => console.log(error))
            this.setState({
                isModalOpen: false
            })
        }
    }

    dropOutlet = id => {
        if (localStorage.getItem("role") === "Owner") {
            window.alert("Anda bukan Admin")
        } else {
            let url = "http://localhost:9000/outlet/" + id
            if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
                axios.delete(url)
                    .then(res => {
                        this.getOutlet()
                        this.handleClose()
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
            }
        }
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount = () => {
        this.getOutlet()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Outlet</h3>
                            <hr />
                            <p>Cari data outlet : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter outlet's id / name / address"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.Add()}>
                                Add Outlet
                            </button>
                            <div className="card bg-light p-3">
                                <table className="table table-transparent">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>Phone</th>
                                            <th>Option</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.outlets.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.outlet_id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.address}</td>
                                                <td>{item.phone}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary m-1"
                                                        onClick={() => this.Edit(item)}>
                                                        <span><Edit /> </span>Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-danger m-1"
                                                        onClick={() => this.dropOutlet(item.outlet_id)}>
                                                        <span><Delete /> </span>Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                <Modal.Header>
                                    <Modal.Title>Form Outlet</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.saveOutlet(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" name="name" placeholder="Masukkan nama"
                                                value={this.state.name} onChange={e => this.setState({ name: e.target.value })} required />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="address">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" name="address" placeholder="Masukkan alamat"
                                                value={this.state.address} onChange={e => this.setState({ address: e.target.value })} required />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="phone">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control type="number" name="phone" placeholder="Masukkan no. telepon"
                                                value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} required />
                                        </Form.Group>
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