const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const balanceController = require('./controllers/balanceController');
const fetchController = require('./controllers/fetchController');
const processTxController = require('./controllers/processTxController');

mongoose.connect(config.DATABASE_URL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());

app.get('/getbalance/:address', balanceController.getBalance);
app.get('/getTx/:address', fetchController.fetchTransactions);
app.get('/processTx/:address', processTxController.getUserBalance);



app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})