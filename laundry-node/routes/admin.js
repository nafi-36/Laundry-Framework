// import library 
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

// implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import model
const models = require('../models/index');
const admin = models.admin;

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL ADMIN, METHOD: GET, FUNCTION: findAll
app.get("/", auth, async (req, res) => {
    // admin.findAll()
    // .then(admin => {
    //     res.json({
    //         count: admin.length,
    //         admin: admin
    //     })
    // })
    // .catch(error => {
    //     res.json({
    //         message: error.message
    //     })
    // })

    let result = await admin.findAll({
        include: [
            "outlet",
            {
                model: models.outlet,
                as: "outlet",
            }
        ]
    })
    res.json({
        count: result.length,
        admin: result
    })
})

// GET ADMIN by ID, METHOD: GET, FUNCTION: findOne
app.get("/id/:id", async (req, res) => {
    let param = {
        admin_id: req.params.id
    }
    // admin.findOne({ where: param })
    //     .then(admin => {
    //         res.json({
    //             admin: admin
    //         })
    //     })
    //     .catch(error => {
    //         res.json({
    //             message: error.message
    //         })
    //     })
    let result = await admin.findOne({
        where: param,
        include: [
            "outlet",
            {
                model: models.outlet,
                as: "outlet",
            }
        ]
    })
    res.json({
        admin: result
    })
})

app.get("/:outlet_id", async (req, res) => {
    let param = {
        outlet_id: req.params.outlet_id
    }
    admin.findAll({ where: param }) 
        .then(admin => {
            res.json({
                count: admin.length,
                admin: admin
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// ADD ADMIN, METHOD: POST, FUNCTION: create
app.post("/", (req, res) => {
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password),
        role: req.body.role,
        outlet_id: req.body.outlet_id
    }
    admin.create(data)
        .then(result => {
            res.json({
                message: "Data has ben inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// UPDATE ADMIN, METHOD: PUT, FUNCTION: update
app.put("/:id", (req, res) => {
    let param = {
        admin_id: req.params.id
    }
    let data = {
        name: req.body.name,
        username: req.body.username,
        // password: md5(req.body.password),
        role: req.body.role,
        outlet_id: req.body.outlet_id
    }
    admin.update(data, { where: param })
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

// UPDATE PASSWORD ADMIN, METHOD: PUT, FUNCTION: update
app.put("/password/:id", (req, res) => {
    let param = {
        admin_id: req.params.id
    }
    let data = {
        password: md5(req.body.password)
    }
    admin.update(data, { where: param })
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

// DELETE ADMIN, METHOD: DELETE, FUNCTION: destroy
app.delete("/:id", (req, res) => {
    let param = {
        admin_id: req.params.id
    }
    admin.destroy({ where: param })
        .then(result => {
            res.json({
                message: "Data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// LOGIN ADMIN, METHOD: POST, FUNCTION: findOne
app.post("/auth", async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    // mencari data admin yang username dan passwordnya sama dengan inputan
    let result = await admin.findOne({ where: data })
    if (result) {
        // jika ditemukan, set payload data
        let payload = JSON.stringify({
            admin_id: result.admin_id,
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

// Search admin
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await admin.findAll({
        where: {
            [Op.or]: [
                {
                    admin_id: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    role: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$outlet.name$': {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }, 
        include: [
            "outlet",
            {
                model: models.outlet,
                as: "outlet",
            }
        ]
    })
    res.json({
        admin: result
    })
})

module.exports = app;