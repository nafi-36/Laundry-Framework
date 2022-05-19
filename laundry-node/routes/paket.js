const express = require("express");
const app = express();
app.use(express.json())

const multer = require("multer")
const path = require("path")
const fs = require("fs")    // untuk membaca file sistem (dimana file itu)

// import models
const models = require('../models/index')
const paket = models.paket

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
        cb(null, "./image/paket")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
// cb(callback) setiap dijalankan call lagi / berulang

let upload = multer({ storage: storage })   // yang diganti yang ada dalam cb

// GET ALL PAKET, METHOD: GET, FUNCTION: findAll
app.get("/", auth, (req, res) => {
    paket.findAll()
        .then(result => {
            res.json({
                count: result.length,
                paket: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// GET PAKET by ID, METHOD: GET, FUNCTION: findOne
app.get("/:paket_id", (req, res) => {
    paket.findOne({ where: { paket_id: req.params.paket_id } })
        .then(result => {
            res.json({
                paket: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// POST PAKET, METHOD: POST, FUNCTION: create
app.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    }
    else {
        let data = {
            types: req.body.types,
            price: req.body.price,
            image: req.file.filename
        }
        paket.create(data)
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

// PUT PAKET, METHOD: PUT, FUNCTION: update
app.put("/:id", upload.single("image"), (req, res) => {
    let param = {
        paket_id: req.params.id
    }
    let data = {
        types: req.body.types,
        price: req.body.price
    }
    if (req.file) {
        // get data by id
        const row = paket.findOne({ where: param })
            .then(result => {
                let oldFileName = result.image

                // delete old file
                let dir = path.join(__dirname, "../image/paket", oldFileName)
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message)
            })

        // set new filename
        data.image = req.file.filename
    }
    paket.update(data, { where: param })
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

// DELETE PAKET, METHOD: DELETE, FUNCTION: destroy 
// async = asyncronus, untuk menjalankan data secara tdk berurutan (bisa ada yg dilewati) 
// await = untuk menunggu proses, tambahkan await di proses yg tdk boleh dilewati
app.delete("/:id", async (req, res) => {
    try {
        let param = { paket_id: req.params.id }
        let result = await paket.findOne({ where: param })
        let oldFileName = result.image

        // delete old file
        let dir = path.join(__dirname, "../image/paket", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        paket.destroy({ where: param })
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

// Search paket
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await paket.findAll({
        where: {
            [Op.or]: [
                {
                    paket_id: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    types: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        paket: result
    })
})

module.exports = app;