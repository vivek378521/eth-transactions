const axios = require('axios');
const User = require('../models/transactions');

exports.getUserBalance = async (req, res) => {
    const address = req.params.address;

    try {
        // Fetch the user's transactions from the database
        const user = await User.findOne({ address }).select('transactions');

        if (!user) {
            // User not found in database, return an error message
            return res.status(404).json({ message: 'User not found. Please fetch transactions first.' });
        }

        // Calculate the user's balance
        let balance = 0;
        user.transactions.forEach((tx) => {
            if (tx.to.toLowerCase() === address.toLowerCase()) {
                balance += Number(tx.value);
            } else if (tx.from.toLowerCase() === address.toLowerCase()) {
                balance -= Number(tx.value);
            }
        });

        // Fetch the current price of ether from an API
        const etherPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const etherPrice = etherPriceResponse.data.ethereum.inr;

        return res.json({ balance, etherPrice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};