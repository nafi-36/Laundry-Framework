const express = require("express")
const app = express()
app.use(express.json())

// import model
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi

// import auth  
// const auth = require("../auth")
// const jwt = require("jsonwebtoken")
// const SECRET_KEY = "BismillahBerkah"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET ALL TRANSAKSI, METHOD: GET, FUNCTION: findAll
app.get("/", async (req, res) => {
    let result = await transaksi.findAll({
        include: [
            "customer",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["paket"]
            }
        ],
        order: [['transaksi_id', 'DESC']]
    })
    res.json({
        count: result.length,
        transaksi: result
    })
})

// GET TRANSAKSI by ID, METHOD: GET, FUNCTION: findOne
app.get("/id/:transaksi_id", async (req, res) => {
    let param = { transaksi_id: req.params.transaksi_id }
    let result = await transaksi.findAll({
        where: param,
        include: [
            "customer",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["paket"]
            }
        ]
    })
    let sumTotal = await transaksi.sum('total', {
        where:
            param
        // dibayar: "Lunas",
    });
    res.json({
        transaksi: result,
        sumTotal: sumTotal
    })
    // res.json(result)
})

// GET TRANSAKSI by ID CUSTOMER, METHOD: GET, FUNCTION: findAll
// app.get("/cust/:customer_id", async (req, res) => {
//     let param = { customer_id: req.params.customer_id }
//     let result = await transaksi.findAll({
//         where: param,
//         include: [
//             "customer",
//             "admin",
//             "outlet",
//             {
//                 model: models.detail_transaksi,
//                 as: "detail_transaksi",
//                 include: ["paket"]
//             }
//         ]
//     })
//     res.json(result)
// })

// GET TRANSAKSI by ID OUTLET, METHOD: GET, FUNCTION: findAll
app.get("/:outlet_id", async (req, res) => {
    let param = { outlet_id: req.params.outlet_id }
    let result = await transaksi.findAll({
        where: param,
        include: [
            "customer",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["paket"],
            },
        ],
        order: [['createdAt', 'DESC']],
    })
    let sumTotal = await transaksi.sum('total', {
        where:
            param
        // dibayar: "Lunas",
    });
    res.json({
        transaksi: result,
        sumTotal: sumTotal
    })
})

// GET TRANSAKSI by ID OUTLET & LUNAS, METHOD: GET, FUNCTION: findAll
// app.get("/lunas/:outlet_id", async (req, res) => {
//     let param = { outlet_id: req.params.outlet_id, dibayar: "Lunas" }
//     let result = await transaksi.findAll({
//         where: param,
//         include: [
//             "customer",
//             "admin",
//             "outlet",
//             {
//                 model: models.detail_transaksi,
//                 as: "detail_transaksi",
//                 include: ["paket"]
//             }
//         ],
//         // order: [['createdAt', 'DESC']]
//     })
//     res.json(result)
// })

// POST TRANSAKSI, METHOD: POST, FUNCTION: create
// POST DETAIL TRANSAKSI, METHOD: POST, FUNCTION: bulkCreate
app.post("/", (req, res) => {
    let current = new Date().toLocaleDateString('en-CA');
    let data = {
        customer_id: req.body.customer_id,
        admin_id: req.body.admin_id,
        outlet_id: req.body.outlet_id,
        tgl: current,
        batas_waktu: req.body.batas_waktu,
        tgl_bayar: req.body.tgl_bayar,
        status: req.body.status,
        dibayar: req.body.dibayar,
        total: req.body.total
    }
    transaksi.create(data)
        .then(result => {
            let lastID = result.transaksi_id
            console.log(lastID)
            detail = req.body.detail_transaksi
            console.log(detail)
            // perulangan untuk data detail_transaksi
            detail.forEach(element => {
                element.transaksi_id = lastID
            });
            detail_transaksi.bulkCreate(detail)
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
        })
})

// UPDATE TRANSAKSI, METHOD: POST, FUNCTION: update
app.post("/:id", (req, res) => {
    let param = {
        transaksi_id: req.params.id
    }
    let data = {
        batas_waktu: req.body.batas_waktu,
        tgl_bayar: req.body.tgl_bayar,
        status: req.body.status,
        dibayar: req.body.dibayar
    }
    transaksi.update(data, { where: param })
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

// DELETE TRANSAKSI, METHOD: DELETE, FUNCTION: destroy 
// async = asyncronus, untuk menjalankan data secara tdk berurutan (bisa ada yg dilewati) 
// await = untuk menunggu proses, tambahkan await di proses yg tdk boleh dilewati
app.delete("/:transaksi_id", async (req, res) => {
    let param = { transaksi_id: req.params.transaksi_id }
    try {
        await detail_transaksi.destroy({ where: param })
        await transaksi.destroy({ where: param })
        res.json({
            message: "Data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

// Search transaksi
app.post("/search/:outlet_id", async (req, res) => {
    let keyword = req.body.keyword
    let result = await transaksi.findAll({
        where: {
            outlet_id: req.params.outlet_id,
            [Op.or]: [
                {
                    transaksi_id: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    status: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    dibayar: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$admin.name$': {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$customer.name$': {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        include: [
            "customer",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["paket"]
            }
        ],
        order: [['transaksi_id', 'DESC']]
    })
    res.json({
        transaksi: result
    })
})

app.post("/date/:outlet_id", async (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)

    let result = await transaksi.findAll({
        where: {
            outlet_id: req.params.outlet_id,
            // dibayar: "Lunas",
            tgl: {
                [Op.between]: [
                    start, end
                ]
            }
        },
        include: [
            "customer",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["paket"]
            }
        ],
        order: [['transaksi_id', 'DESC']],
    })
    let sumTotal = await transaksi.sum('total', {
        where: {
            outlet_id: req.params.outlet_id,
            // dibayar: "Lunas",
            tgl: {
                [Op.between]: [
                    start, end
                ]
            }
        },
    });
    res.json({
        transaksi: result,
        sumTotal: sumTotal
    })
})

module.exports = app