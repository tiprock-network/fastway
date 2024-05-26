const dotenv = require('dotenv')
dotenv.config()
const axios = require('axios')
const connectToMongoDB = require('../functions/connectToMongoDB')
const {MongoClient} = require('mongodb')
const databaseInfo = require('../credentials/db_metadata')
const mongo_client = new MongoClient(databaseInfo.mongo_uri)
const payments_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.payments_collection)

connectToMongoDB()
const transferToWallet = async (req,res) =>{
    const {recepient,amount,vendorWallet} = req.body
    const myWalletAddr = req.user.walletAddress
    const myPrivateKey = req.user.privateKey
    //console.log(req.user)

    //execute transfer
    axios.post(process.env.WALLET_TRANSFER_ENDPOINT,{
        receiver_addr:vendorWallet,
        sender_pKey:myPrivateKey,
        sender_addr:myWalletAddr,
        amount:amount
    })
    .then( async (response) => {
        try {
            if(response){
                //save company wallet
                //TODO: Add list of items, or *decide to show the list when one payment is accessed
                let bill = {
                    invoiceId: recepient,
                    sentBy: req.user.userEmail,
                    amount:amount,
                    date: new Date(),
                    status : response.data.transaction_status=='Successful' ? response.data.transaction_status: 'Failed',
                    receiverAddr : response.data.receiver_address? response.data.receiver_address: 'Not sent',
                    transaction_receipt : response.data.receipt
                }
                //TODO: Adjust prices to Wei
                let newPayment = await payments_collection.insertOne(bill)
                res.render('payment_status',{
                    transactionId:newPayment.insertedId,
                    transactionDate:bill.date,
                    receiverAddr:bill.receiverAddr,
                    transactionAmount:amount
                })
            }
        } catch (error) {
            console.log('The following error occurred: ',error)
        }



    })
    .catch(error=>console.log(`Error making POST request: ': ${error}`))
}

module.exports = transferToWallet