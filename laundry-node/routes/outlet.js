// import library 
const express = require('express');
const bodyParser = require('body-parser');

// implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import model
const models = require('../models/index');
const outlet = models.outlet;

// import auth 
// const auth = require("../auth")
// const jwt = require("jsonwebtoken")
// const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL ADMIN, METHOD: GET, FUNCTION: findAll
app.get("/", (req, res) => {
    outlet.findAll()
        .then(outlet => {
            res.json({
                count: outlet.length,
                outlet: outlet
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// GET ADMIN by ID, METHOD: GET, FUNCTION: findOne
app.get("/:id", (req, res) => {
    let param = {
        outlet_id: req.params.id
    }
    outlet.findOne({ where: param })
        .then(outlet => {
            res.json({
                outlet: outlet
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    // let result = await admin.findOne({
    //     where: param,
    //     include: [
    //         "outlet",
    //         {
    //             model: models.outlet,
    //             as: "outlet",
    //         }
    //     ]
    // })
    // res.json({
    //     admin: result
    // })
})

// ADD ADMIN, METHOD: POST, FUNCTION: create
app.post("/", (req, res) => {
    let data = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    }
    outlet.create(data)
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
        outlet_id: req.params.id
    }
    let data = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    }
    outlet.update(data, { where: param })
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
        outlet_id: req.params.id
    }
    outlet.destroy({ where: param })
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

// Search outlet
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await outlet.findAll({
        where: {
            [Op.or]: [
                {
                    outlet_id: {
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
        outlet: result
    })
})

module.exports = app;