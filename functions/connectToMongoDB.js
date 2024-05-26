const {MongoClient} = require('mongodb')
require('dotenv').config()

//create client instance
const URI = process.env.MONGODB_URI
const client = new MongoClient(URI,{
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})

async function connectToMongoDB() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();

        }
    } catch (error) {
        console.error('MongoDB connection failed', error)
        //console.log('Retrying connection...')
        //setTimeout(connectToMongoDB, 5000);
        //connectToMongoDB()
    }
}

module.exports = connectToMongoDB