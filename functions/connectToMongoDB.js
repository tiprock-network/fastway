const {MongoClient} = require('mongodb')
require('dotenv').config()

//create client instance
const URI = process.env.MONGODB_URI
const client = new MongoClient(URI)

async function connectToMongoDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
}

module.exports = connectToMongoDB