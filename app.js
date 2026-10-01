const express = require('express');
const cors = require('cors');

const pengeluaranRoutes = require('./routes/pengeluaran');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Backend Pengeluaran berhasil berjalan'
    });
});

app.use('/pengeluaran', pengeluaranRoutes);

module.exports = app;