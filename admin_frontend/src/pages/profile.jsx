import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            // action: "",
            // outletID: "",
            admin_id: "",
            admin: [],
            name: "",
            username: "",
            password: "",
            role: "",
            outlet_id: "",
            outlet_name: "",
            outlet: [],
            outlet_admin: [],
            // fillPassword: true,
            isModalOpen: false
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
            this.state.admin_id = localStorage.getItem("admin_id")
            // this.state.outletID = localStorage.getItem("outlet_id")
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


    getAdminId = () => {
        let url = "http://localhost:9000/admin/id/" + this.state.admin_id

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    admin: res.data.admin,
                    name: res.data.admin.name,
                    username: res.data.admin.username,
                    password: "",
                    role: res.data.admin.role,
                    outlet_id: res.data.admin.outlet_id,
                    outlet_name: res.data.admin.outlet.name,
                    // outlet_id: res.data.admin.outlet.outlet_id,
                    // outlet_name: res.data.admin.outlet.name
                })
                // console.log(this.state.admin)
                console.log(this.state.outlet_id)
                console.log(this.state.outlet_name)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

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

    // getOutletId = () => {
    //     let url = "http://localhost:9000/outlet/" + this.state.outlet_id

    //     axios.get(url, this.headerConfig())
    //         .then(res => {
    //             this.setState({
    //                 outlet_admin: res.data.outlet
    //             })
    //             console.log(this.state.outlet)
    //         })
    //         .catch(err => {
    //             console.log(err.message)
    //         })
    // }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // Edit = item => {
    //     this.setState({
    //         // action: "update",
    //         admin_id: item.admin_id,
    //         name: item.name,
    //         username: item.username,
    //         password: "",
    //         // fillPassword: false,
    //         isModalOpen: true
    //     })
    // }

    saveAdmin = e => {
        if (localStorage.getItem("role") !== "Admin") {
            e.preventDefault()
            window.alert("Tidak dapat mengubah profile")
        } else {
            e.preventDefault()
            let form = {
                admin_id: this.state.admin_id,
                name: this.state.name,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
                outlet_id: this.state.outlet_id
            }
            let url = "http://localhost:9000/admin/" + this.state.admin_id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    // window.alert(response.data.message)
                    this.getAdminId()
                    // this.handleColse()
                })
                .catch(error => console.log(error))

            this.setState({
                isModalOpen: false
            })
            localStorage.setItem("admin_name", this.state.name)
            localStorage.setItem("role", this.state.role)
            localStorage.setItem("outlet_id", this.state.outlet_id)
        }
    }

    dropAdmin = id => {
        let url = "http://localhost:9000/admin/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus akun ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getAdminId()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        window.location = "/login"
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount() {
        this.getAdminId()
        this.getOutlet()
        // this.getOutletId()
    }

    render() {
        return (
            <div className="container-scroller">
                <Navbar />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Admin Profile</h3>
                            <hr />
                            <div class="container rounded bg-white">
                                <div class="row">
                                    <div class="col-md-4 border-right">
                                        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                                            <img class="rounded-circle mt-5" width="150" height="150" src="https://drh.co.id/images/profile.png" />
                                            <h5 class="mt-4">{this.state.admin.name}</h5>
                                            <span class="text-black-50 mt-1">{this.state.admin.username}</span>
                                            <p class="text-black-50 mt-1">{this.state.admin.role} | {this.state.outlet_name}</p>
                                            {/* <span class="text-black-100">{this.state.customer.address}</span> */}
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="p-3 py-5">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h4 class="text-right">Profile Settings</h4>
                                            </div>
                                            <Form onSubmit={e => this.saveAdmin(e)}>
                                                <Form.Group className="mb-2" controlId="name">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="name" placeholder="Enter your name"
                                                        value={this.state.name} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="email" name="username" placeholder="Enter your username"
                                                        value={this.state.username} onChange={this.handleChange} required />
                                                </Form.Group>
                                                {/* <Form.Group className="mb-2" controlId="password">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type="password" name="password" placeholder="Enter your password"
                                                        value={this.state.password} onChange={this.handleChange} required />
                                                </Form.Group> */}
                                                <Form.Group className="mb-2" controlId="role">
                                                    <label for="exampleSelectGender">Role</label><br />
                                                    <select type="text" name="role" class="form-control" id="exampleSelectGender"
                                                        onChange={this.handleChange} required >
                                                        <option value={this.state.role}>{this.state.role}</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Kasir">Kasir</option>
                                                        <option value="Owner">Owner</option>
                                                    </select>
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="outlet_id">
                                                    <label for="exampleSelectGender">Outlet</label><br />
                                                    <select type="text" name="outlet_id" class="form-control" id="exampleSelectGender"
                                                        onChange={this.handleChange} required >
                                                        <option value={this.state.outlet_id}>{this.state.outlet_name}</option>
                                                        {this.state.outlet.map((item, index) => (
                                                            <option value={item.outlet_id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </Form.Group>
                                                <Button variant="primary mt-2" type="submit">
                                                    Save Profile
                                                </Button>
                                            </Form>
                                        </div>
                                    </div>
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