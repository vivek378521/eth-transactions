const axios = require('axios');
const config = require('../config.js');

exports.getBalance = async (req, res) => {
    const address = req.params.address;
    const balanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${config.MONGODB_URI}`;
    const inrUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr';

    try {
        const [balanceResponse, inrResponse] = await Promise.all([
            axios.get(balanceUrl),
            axios.get(inrUrl)
        ]);

        const balance = balanceResponse.data.result;
        const inr = inrResponse.data.ethereum.inr;
        res.send({ "address": address, "balance": (balance / 1000000000000000000), "inr": inr });
    } catch (error) {
        console.error(error);
        res.send('Error occurred');
    }
};
