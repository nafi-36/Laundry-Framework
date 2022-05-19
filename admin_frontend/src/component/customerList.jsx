import React from 'react'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'

export default class CustomerList extends React.Component {
    render() {
        return (
            <div className="card col-sm-12 my-1">
                <div className="card-body row d-flex align-items-center">
                    <div className="col-sm-3">
                        <img alt={this.props.nameImage} src={this.props.image}
                            className="img rounded-circle" width="150" height="150" />
                    </div>
                    <div className="col-sm-6 align-items-center">
                        <h5><b>Name : {this.props.name}</b></h5>
                        <p>Address : {this.props.address}</p>
                        <p>Gender : {this.props.gender}</p>
                        <p>Phone : {this.props.phone}</p>
                        <p>Username : {this.props.username}</p>
                    </div>
                    <div className="col-sm-3 d-flex justify-content-center">
                        <button className="btn btn-sm btn-primary m-1" onClick={this.props.onEdit}><span><Edit /> </span></button>
                        <button className="btn btn-sm btn-danger m-1" onClick={this.props.onDrop}><span><Delete /> </span></button>
                        <button className="btn btn-sm btn-secondary m-1"
                            onClick={this.props.onPassword}>
                            Edit Password
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
