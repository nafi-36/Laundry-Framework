import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Admin extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            outletID: "",
            action: "",
            admins: [],
            admin_id: "",
            name: "",
            username: "",
            password: "",
            role: "",
            outlet_id: "",
            outlet: [],
            outlet_name: "",
            // fillPassword: true,
            isModalOpen: false,
            keyword: ""
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Admin") {
                this.state.token = localStorage.getItem("token")
                this.state.outletID = localStorage.getItem("outlet_id")
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

    getAdmin = () => {
        let url = "http://localhost:9000/admin"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    admins: res.data.admin
                })
            })
            .catch(err => {
                console.log(err.message)
            })
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


    getOutlet = () => {
        let url = "http://localhost:9000/outlet"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    outlet: res.data.outlet
                })
                console.log(this.state.outlet)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/admin/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        admins: res.data.admin
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
            admin_id: 0,
            name: "",
            username: "",
            password: "",
            role: "",
            outlet_id: "",
            // fillPassword: true,
            isModalOpen: true
        })
    }

    Edit = item => {
        this.setState({
            action: "update",
            admin_id: item.admin_id,
            name: item.name,
            username: item.username,
            password: "",
            role: item.role,
            outlet_id: item.outlet_id,
            outlet_name: item.outlet.name,
            // fillPassword: false,
            isModalOpen: true
        })
    }

    editPassword = item => {
        this.setState({
            action: "editPassword",
            admin_id: item.admin_id,
            password: "",
            isModalOpen: true
        })
    }

    saveAdmin = e => {
        e.preventDefault()
        // let form = {
        //     admin_id: this.state.admin_id,
        //     name: this.state.name,
        //     username: this.state.username,
        //     password: this.state.password,
        //     role: this.state.role,
        //     outlet_id: this.state.outlet_id
        // }
        // if (this.state.fillPassword) {
        //     form.password = this.state.password
        // }
        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:9000/admin"
            let form = {
                admin_id: this.state.admin_id,
                name: this.state.name,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
                outlet_id: this.state.outlet_id
            }
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getAdmin()
                    this.handleClose()
                })
                .catch(error => console.log(error))
        }
        else if (this.state.action === "update") {
            let form = {
                admin_id: this.state.admin_id,
                name: this.state.name,
                username: this.state.username,
                // password: this.state.password,
                role: this.state.role,
                outlet_id: this.state.outlet_id
            }
            url = "http://localhost:9000/admin/" + this.state.admin_id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getAdmin()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if  (this.state.action === "editPassword") {
            let form = {
                admin_id: this.state.admin_id,
                password: this.state.password,
            }
            url = "http://localhost:9000/admin/password/" + this.state.admin_id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getAdmin()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }
    // localStorage.setItem("admin_name", this.state.name)

    dropAdmin = id => {
        let url = "http://localhost:9000/admin/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getAdmin()
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
        this.getAdmin()
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
                            <h3 className="mt-0 ">Data Admin</h3>
                            <hr />
                            <p>Cari data admin : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter admin's id / name / role / outlet"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.Add()}>
                                Add Admin
                            </button>
                            <div className="card bg-light p-3">
                                <table className="table table-transparent">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>Outlet</th>
                                            <th>Option</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.admins.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.admin_id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.username}</td>
                                                <td>{item.role}</td>
                                                <td>{item.outlet.name}</td>
                                                <td>{JSON.stringify(item.admin_id) === localStorage.getItem("admin_id") ? (
                                                    <a className="btn btn-sm btn-success m-1" href="/profile">
                                                        <span><Edit /> </span>
                                                    </a>
                                                ) : (
                                                    <button className="btn btn-sm btn-primary m-1"
                                                        onClick={() => this.Edit(item)}>
                                                        <span><Edit /> </span>
                                                    </button>
                                                )}
                                                    <button className="btn btn-sm btn-danger m-1"
                                                        onClick={() => this.dropAdmin(item.admin_id)}>
                                                        <span><Delete /> </span>
                                                    </button>
                                                    <button className="btn btn-secondary m-1"
                                                        onClick={() => this.editPassword(item)}>
                                                        Edit Password
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* {this.state.outlet.map((item, index) => {
                                    <p>{item.name}</p>
                                })} */}
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Admin</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.saveAdmin(e)}>
                                    <Modal.Body>
                                        {this.state.action === "editPassword" ? (
                                            <Form.Group className="mb-2" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                    value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />
                                            </Form.Group>
                                        ) : (<div></div>) && this.state.action !== "editPassword" ? (
                                            <div>
                                                <Form.Group className="mb-2" controlId="name">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="name" placeholder="Masukkan nama"
                                                        value={this.state.name} onChange={e => this.setState({ name: e.target.value })} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="email" name="username" placeholder="Masukkan username"
                                                        value={this.state.username} onChange={e => this.setState({ username: e.target.value })} required />
                                                </Form.Group>
                                                {this.state.action === "insert" ? (
                                                    <Form.Group className="mb-2" controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                            value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />
                                                    </Form.Group>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Form.Group className="mb-2" controlId="role" >
                                                    <label for="exampleSelectGender">Role</label><br />
                                                    <select type="text" name="role" class="form-control" id="exampleSelectGender" placeholder="Pilih role"
                                                        onChange={e => this.setState({ role: e.target.value })} required >
                                                        <option value={this.state.role}>{this.state.role}</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Kasir">Kasir</option>
                                                        <option value="Owner">Owner</option>
                                                    </select>
                                                </Form.Group>
                                                {this.state.action === "insert" ? (
                                                    <Form.Group className="mb-2" controlId="outlet_id">
                                                        <label for="exampleSelectGender">Outlet</label><br />
                                                        <select type="text" name="outlet_id" class="form-control" id="exampleSelectGender" placeholder="Pilih outlet"
                                                            onChange={e => this.setState({ outlet_id: e.target.value })} required >
                                                            <option></option>
                                                            {this.state.outlet.map((item, index) => (
                                                                <option value={item.outlet_id}>{item.name}</option>
                                                            ))} 
                                                        </select>
                                                    </Form.Group>
                                                ) : (
                                                    <Form.Group className="mb-2" controlId="outlet_id">
                                                        <label for="exampleSelectGender">Outlet</label><br />
                                                        <select type="text" name="outlet_id" class="form-control" id="exampleSelectGender" placeholder="Pilih outlet"
                                                            onChange={e => this.setState({ outlet_id: e.target.value })} required >
                                                            <option value={this.state.outlet_id}>{this.state.outlet_name}</option>
                                                            {this.state.outlet.map((item, index) => (
                                                                <option value={item.outlet_id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </Form.Group>
                                                )}
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
            </div >
        )
    }
}