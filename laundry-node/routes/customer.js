const express = require("express");
const app = express();
app.use(express.json())

const md5 = require('md5')  // import md5 (untuk enkripsi password)

// import multer, path, file system
const multer = require("multer")
const path = require("path")
const fs = require("fs")            // file sistem (mengakses file tersebut), membaca file sistem (dimana file itu) 

// import models
const models = require('../models/index')
const customer = models.customer

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// config storage image, membuat konfigurasi untuk menyimpan foto (dimana foto yang diinsert akan disimpan)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/customer")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
// cb(callback) setiap dijalankan call lagi / berulang 

let upload = multer({ storage: storage })    // yang diganti yang ada didalam cb

// GET ALL CUSTOMER, METHOD: GET, FUNCTION: findAll
app.get("/", auth, (req, res) => {
    customer.findAll()
        .then(result => {
            res.json({
                count: result.length,
                customer: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// GET CUSTOMER by ID, METHOD: GET, FUNCTION: findOne
app.get("/:customer_id", (req, res) => {
    customer.findOne({ where: { customer_id: req.params.customer_id } })
        .then(result => {
            res.json({
                customer: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// POST CUSTOMER, METHOD: POST, FUNCTION: create
app.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    }
    else {
        let data = {
            name: req.body.name,
            address: req.body.address,
            gender: req.body.gender,
            phone: req.body.phone,
            image: req.file.filename,
            username: req.body.username,
            password: md5(req.body.password)
        }
        customer.create(data)
            .then(result => {
                res.json({
                    message: "Data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    }
})

// UPDATE CUSTOMER, METHOD: PUT, FUNCTION: update
app.put("/:id", upload.single("image"), (req, res) => {
    let param = {
        customer_id: req.params.id
    }
    let data = {
        name: req.body.name,
        address: req.body.address,
        gender: req.body.gender,
        phone: req.body.phone,
        username: req.body.username
    }
    if (req.file) {
        // get data by id
        const row = customer.findOne({ where: param })
            .then(result => {
                let oldFileName = result.image  // hasil gambar kita dapatkan dari database disimpan

                // delete old file 
                let dir = path.join(__dirname, "../image/customer", oldFileName)    // direktori gambar
                // menghapus sebuah file dari sistem
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message)
            })
        // set new filename (image)
        data.image = req.file.filename
    }

    // if (req.body.password) {
    //     data.password = md5(req.body.password)
    // }

    customer.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// UPDATE PASSWORD CUSTOMER, METHOD: PUT, FUNCTION: update
app.put("/password/:id", (req, res) => {
    let param = {
        customer_id: req.params.id
    }
    let data = {
        password: md5(req.body.password)
    }
    customer.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// DELETE CUSTOMER, METHOD: DELETE, FUNCTION: destroy 
// async = asyncronus, untuk menjalankan data secara tdk berurutan (bisa ada yg dilewati) 
// await = untuk menunggu proses, tambahkan await di proses yg tdk boleh dilewati
app.delete("/:id", async (req, res) => {
    try {
        let param = { customer_id: req.params.id }
        let result = await customer.findOne({ where: param })
        let oldFileName = result.image

        // delete old file
        let dir = path.join(__dirname, "../image/customer", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        customer.destroy({ where: param })
            .then(result => {
                res.json({
                    message: "Data has been deleted",
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

// LOGIN CUSTOMER, METHOD: POST, FUNCTION: findOne
app.post("/auth", async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    // mencari data customer yang username dan passwordnya sama dengan inputan
    let result = await customer.findOne({ where: data })
    if (result) {
        // jika ditemukan, set payload data
        let payload = JSON.stringify({
            customer_id: result.admin_id,
            name: result.name,
            username: result.username
        })
        // generate token based on payload and secret key
        let token = jwt.sign(payload, SECRET_KEY)
        // set output 
        res.json({
            logged: true,
            data: result,
            token: token
        })
    } 
    else {
        // jike tidak ditemukan 
        res.json({
            logged: false,
            message: "invalid username or password"
        })
    }
})

// Search customer
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await customer.findAll({
        where: {
            [Op.or]: [
                {
                    customer_id: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    address: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        customer: result
    })
})

module.exports = app;