import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import CustomerList from '../component/customerList'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Customer extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            customers: [],
            customer_id: "",
            name: "",
            address: "",
            gender: "",
            phone: "",
            image: null,
            username: "",
            password: "",
            action: "",
            isModalOpen: false
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Kasir") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Kasir")
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
        let url = "http://localhost:9000/customer"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    customers: res.data.customer
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/customer/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        customers: res.data.customer
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFile = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    }

    handleAdd = () => {
        this.setState({
            isModalOpen: true,
            // customer_id: "",
            name: "",
            address: "",
            gender: "",
            phone: "",
            username: "",
            password: "",
            image: null,
            action: "insert"
        })
    }

    handleEdit = (item) => {
        this.setState({
            isModalOpen: true,
            customer_id: item.customer_id,
            name: item.name,
            address: item.address,
            gender: item.gender,
            phone: item.phone,
            username: item.username,
            password: "",  // untuk edit password bisa dibuat end-point sendiri 
            image: item.image,
            action: "update"
        })
    }

    editPassword = item => {
        console.log(item.name)
        this.setState({
            action: "editPassword",
            customer_id: item.customer_id,
            password: "",
            isModalOpen: true
        })
    }

    handleSave = (e) => {
        e.preventDefault()
        // let form = new FormData()
        // form.append("name", this.state.name)
        // form.append("address", this.state.address)
        // form.append("gender", this.state.gender)
        // form.append("phone", this.state.phone)
        // form.append("username", this.state.username)
        // form.append("password", this.state.password)
        // form.append("image", this.state.image)

        let url = ""
        if (this.state.action === "insert") {
            let form = new FormData()
            form.append("name", this.state.name)
            form.append("address", this.state.address)
            form.append("gender", this.state.gender)
            form.append("phone", this.state.phone)
            form.append("username", this.state.username)
            form.append("password", this.state.password)
            form.append("image", this.state.image)

            url = "http://localhost:9000/customer"
            axios.post(url, form, this.headerConfig())
                .then(res => {
                    this.getCustomer()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "update") {
            let form = new FormData()
            form.append("name", this.state.name)
            form.append("address", this.state.address)
            form.append("gender", this.state.gender)
            form.append("phone", this.state.phone)
            form.append("username", this.state.username)
            // form.append("password", this.state.password)
            form.append("image", this.state.image)

            url = "http://localhost:9000/customer/" + this.state.customer_id
            axios.put(url, form, this.headerConfig())
                .then(res => {
                    this.getCustomer()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "editPassword") {
            let form = {
                customer_id: this.state.cusstomer_id,
                password: this.state.password,
            }
            url = "http://localhost:9000/customer/password/" + this.state.customer_id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getCustomer()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:9000/customer/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getCustomer()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount = () => {
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
                            <h3 className="mt-0 ">Data Customer</h3>
                            <hr />
                            <p>Cari data customer : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter customer's id / name / address"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.handleAdd()}>
                                Add Customer
                            </button>
                            <div className="row mt-2">
                                {this.state.customers.map((item, index) => {
                                    return (
                                        <CustomerList key={index}
                                            nameImage={item.image}
                                            image={"http://localhost:9000/image/customer/" + item.image}
                                            name={item.name}
                                            address={item.address}
                                            gender={item.gender}
                                            phone={item.phone}
                                            username={item.username}
                                            onEdit={() => this.handleEdit(item)}
                                            onDrop={() => this.handleDrop(item.customer_id)}
                                            onPassword={() => this.editPassword(item)}
                                        />
                                    )
                                })}
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Customer</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.handleSave(e)}>
                                    <Modal.Body>
                                        {this.state.action === "editPassword" ? (
                                            <Form.Group className="mb-2" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                    value={this.state.password} onChange={this.handleChange} required />
                                            </Form.Group>
                                        ) : (<div></div>) && this.state.action !== "editPassword" ? (
                                            <div>
                                                <Form.Group className="mb-2" controlId="name">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="name" placeholder="Masukkan nama"
                                                        value={this.state.name} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="address">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control type="text" name="address" placeholder="Masukkan alamat"
                                                        value={this.state.address} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="gender">
                                                    <Form.Label for="exampleSelectGender">Gender</Form.Label>
                                                    <Form.Select className="form-control" id="exampleSelectGender" type="text" name="gender" placeholder="Pilih gender" value={this.state.gender} onChange={this.handleChange} required>
                                                        <option></option>
                                                        <option value="L">Male</option>
                                                        <option value="P">Female</option>
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="phone">
                                                    <Form.Label>Phone</Form.Label>
                                                    <Form.Control type="text" name="phone" placeholder="Masukkan no. telepon"
                                                        value={this.state.phone} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="text" name="username" placeholder="Masukkan username"
                                                        value={this.state.username} onChange={this.handleChange} required />
                                                </Form.Group>
                                                {this.state.action === "insert" ? (
                                                    <Form.Group className="mb-2" controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                            value={this.state.password} onChange={this.handleChange} required />
                                                    </Form.Group>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Form.Group className="mb-2" controlId="image">
                                                    <Form.Label>Image</Form.Label>
                                                    <Form.Control type="file" name="image" placeholder="Masukkan gambar"
                                                        onChange={this.handleFile} />
                                                </Form.Group>
                                            </div>) : (<div></div>)}
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