# Ethereum Transaction Tracker
This is a Node.js application that tracks Ethereum transactions for a given address and stores them in a MongoDB database. The application uses the Etherscan API to retrieve transaction data and the Mongoose library to interact with the database.

There is a script under runners directory, if you run that script it will fetch inr price of eth from an external API and store it in your db every 10 minutes. 

# Requirements
Before running this application, you'll need:

Node.js (version 12 or higher)
A MongoDB database
An Etherscan API key

# Installation
1. Clone this repository to your local machine:
`git clone https://github.com/vivek378521/eth-transactions.git`
2. Install the required packages using npm:
`cd eth-transations`
`npm install`
3. Set the following environment variables:
`DATABASE_URL: the URL of your MongoDB database`
`ETH_SCAN_API_KEY: your Etherscan API key`
You can set the environment variables in a .env file in the root of the project:

4. Start the application:
`npm start`

The thunderclient json is also included in the repo, you can import it and use the APIs.

# API Info

1. `/getTx/<address>` this api fetches the transactions from etherscan and dumps it into the mongodb.
2. `/processTx/<address>` this api calculates the balance of ether from your transactions available in your db.
3. `/getBalance/<address>` this api fetches the address balance from etherscan and inr value of eth from coingecko api.


PS You will notice that I am only fetching the top 99 transactions, and dumping into the db, why? because fetching all past transactions will take a long time and then it would not be a synchronous process. It has to be done on the side, it will be like customer onboarding. You can tinker with etherscan api to fetch more transactions. 

Customer onboarding => Fetching all customer data from another service/customer and putting it into our systems.