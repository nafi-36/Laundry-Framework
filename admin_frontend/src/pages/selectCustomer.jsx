import React from 'react'
import Navbar from '../component/navbar'
import Sidebar from '../component/sidebar'
import Footer from '../component/footer'
import Confirm from '@mui/icons-material/CheckOutlined'
import axios from 'axios'

export default class SelectCustomer extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            customers: []
            // customer_id: "",
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "Kasir") {
                this.state.token = localStorage.getItem("token")
            } else {
                window.alert("Anda bukan Kasir")
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

    confirm = (item) => {
        // localStorage.setItem("customer", JSON.stringify(item))
        localStorage.setItem("customer_id", JSON.stringify(item.customer_id))
        window.location = '/selectLaundry'
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
                            <h3 className="mt-0">Pilih Customer</h3>
                            <hr />
                            <p>Cari customer : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter customer's id / name / address"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            {/* <h6>Pilih Customer</h6> */}
                            <div className="card mt-4">
                                <div className="card-title mb-0 mx-4 mt-4"><h6>Pilih Customer</h6></div><hr />
                                <table className="table table-transparent">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Profile</th>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>Gender</th>
                                            <th>Phone</th>
                                            <th>Username</th>
                                            <th>Transaksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.customers.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><img alt={item.name} src={"http://localhost:9000/image/customer/" + item.image} /></td>
                                                <td>{item.name}</td>
                                                <td>{item.address}</td>
                                                <td>{item.gender}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.username}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary"
                                                        onClick={() => this.confirm(item)}>
                                                        <span><Confirm /> </span>Confirm
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}