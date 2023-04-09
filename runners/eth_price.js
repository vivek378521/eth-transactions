require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Ethereum price schema
const EthereumPriceSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Create Ethereum price model
const EthereumPrice = mongoose.model('EthereumPrice', EthereumPriceSchema);

// Fetch Ethereum price every 10 minutes and store it in the database
setInterval(() => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then(response => {
            const price = response.data.ethereum.inr;
            const ethereumPrice = new EthereumPrice({ price });
            ethereumPrice.save();
            console.log(`Saved Ethereum price: ${price}`);
        })
        .catch(error => {
            console.error(`Failed to fetch Ethereum price: ${error}`);
        });
}, 10 * 60 * 1000); // Fetch every 10 minutes (in milliseconds)
