// import library
const express = require('express');
const cors = require('cors');

// implementasi library
const app = express();
app.use(cors());

// import end-point outlet
const outlet = require('./routes/outlet')
app.use("/outlet", outlet)

// import end-point admin
const admin = require('./routes/admin')
app.use("/admin", admin)

// import end-point customer
const customer = require('./routes/customer')
app.use("/customer", customer)

// import end-point paket
const paket = require('./routes/paket')
app.use("/paket", paket)

// import end-point transaksi
const transaksi = require('./routes/transaksi')
app.use("/transaksi", transaksi)

app.use(express.static(__dirname))

app.listen(9000, () => {
    console.log('server run on port 9000')
})