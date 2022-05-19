import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import PaketList from '../component/paketList'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            packages: [],
            isModalOpen: false,
            paket_id: "",
            types: "",
            price: "",
            image: null,
            action: ""
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Admin") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Admin")
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
            // paket_id: "",
            types: "",
            price: "",
            image: null,
            action: "insert"
        })
    }

    handleEdit = (item) => {
        this.setState({
            isModalOpen: true,
            paket_id: item.paket_id,
            types: item.types,
            price: item.price,
            image: item.image,
            action: "update"
        })
    }

    handleSave = (e) => {
        e.preventDefault()
        let form = new FormData()
        form.append("types", this.state.types)
        form.append("price", this.state.price)
        form.append("image", this.state.image)

        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:9000/paket"
            axios.post(url, form)
                .then(res => {
                    this.getPaket()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "update") {
            url = "http://localhost:9000/paket/" + this.state.paket_id
            axios.put(url, form)
                .then(res => {
                    this.getPaket()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:9000/paket/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getPaket()
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
                            <h3 className="mt-0">Data Paket Laundry</h3>
                            <hr />
                            <p>Cari data paket laundry : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter package's id / type"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.handleAdd()}>
                                Add Package
                            </button>
                            <div className="row mt-2">
                                {this.state.packages.map((item, index) => {
                                    return (
                                        <PaketList key={index}
                                            nameImage={item.image}
                                            image={"http://localhost:9000/image/paket/" + item.image}
                                            types={item.types}
                                            price={item.price}
                                            onEdit={() => this.handleEdit(item)}
                                            onDrop={() => this.handleDrop(item.paket_id)}
                                        />
                                    )
                                })}
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Package</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.handleSave(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="name">
                                            <Form.Label>Laundry Type</Form.Label>
                                            <Form.Control type="text" name="types" placeholder="Enter the laundry type"
                                                value={this.state.types} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="price">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="number" name="price" placeholder="Enter the price"
                                                value={this.state.price} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="image">
                                            <Form.Label>Image</Form.Label>
                                            <Form.Control type="file" name="image" placeholder="Enter the image"
                                                onChange={this.handleFile} />
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