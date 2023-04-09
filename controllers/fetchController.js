const axios = require('axios');
const User = require('../models/transactions');
const config = require('../config');

async function fetchTransactions(req, res) {
    const address = req.params.address;
    const apikey = config.ETH_API_KEY;
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${apikey}`;
    console.log("WOoooohoohohoh");
    console.log(apikey);
    try {
        const response = await axios.get(url);
        if (response.data.message === 'OK') {
            const transactions = response.data.result.map((tx) => ({
                blockNumber: tx.blockNumber,
                timeStamp: parseInt(tx.timeStamp),
                hash: tx.hash,
                nonce: tx.nonce,
                blockHash: tx.blockHash,
                transactionIndex: tx.transactionIndex,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                gas: tx.gas,
                gasPrice: tx.gasPrice,
                isError: tx.isError,
                txreceipt_status: tx.txreceipt_status,
                input: tx.input,
                contractAddress: tx.contractAddress,
                cumulativeGasUsed: tx.cumulativeGasUsed,
                gasUsed: tx.gasUsed,
                confirmations: tx.confirmations,
            }));

            // Find the latest transaction timestamp in the database
            const latestTransaction = await User.findOne({ address })
                .select('transactions.timeStamp')
                .sort({ 'transactions.timeStamp': -1 })
                .limit(1);
            console.log(latestTransaction)
            const latestTimestamp = latestTransaction ? latestTransaction.transactions[latestTransaction.transactions.length - 1].timeStamp : 0;
            console.log(latestTimestamp)
            // Filter out transactions that have already been inserted
            const newTransactions = transactions.filter((tx) => tx.timeStamp > latestTimestamp);
            console.log(newTransactions.length)
            if (newTransactions.length === 0) {
                return res.json({ message: 'No new transactions to insert' });
            }

            // Add new transactions to the user's transaction array
            const user = await User.findOneAndUpdate(
                { address },
                { $addToSet: { transactions: { $each: newTransactions } } },
                { upsert: true, new: true }
            );

            return res.json(user);
        }

        return res.status(400).json({ message: response.data.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { fetchTransactions };