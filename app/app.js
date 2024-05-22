const express = require('express')
const axios = require('axios')
const router = express.Router()
const multer = require('multer')
const dotenv = require('dotenv')
dotenv.config()
const {ensureAuthenticated} = require('../credentials/auth')
const upload = multer({dest:'./uploads'})
const {addUser,signInUser,logOutUser} = require('../controllers/user_account_controller')
const {MongoClient,ObjectId} = require('mongodb')
const connectToMongoDB = require('../functions/connectToMongoDB')
const databaseInfo = require('../credentials/db_metadata')
//mongobd client
const mongo_client = new MongoClient(databaseInfo.mongo_uri)
const account_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.user_collection)
const invoices_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.items_collection)
//connect to mongodb
connectToMongoDB()

//format wallet addresses
function formatCryptoAddr(addr){
    let first_part = addr.slice(0,3)
    let last_part = addr.slice(-2)
    return `${first_part}...${last_part}`
}

router.get('/home',ensureAuthenticated, async (req,res) => {
    //get wallet balance
    //TODO: TEST CASE & try catch
    let user_addr = await account_collection.findOne({_id:new ObjectId(req.user._id)})
    
    const URL = process.env.CELO_BALANCE_ENDPOINT
    
    const payload = {
        addr:user_addr.walletAddress
    }
    //consume REST API endpoint
    let walletAddr = formatCryptoAddr(user_addr.walletAddress)
    
    axios.post(URL,payload)
        .then((response)=>{
            //get balance data
            let response_body_bal = response.data?response.data:{}
            //formatted balance
            let formatted_balances={
                CELO_Bal: parseFloat(response_body_bal.CELO_Bal).toFixed(2).toString(),
                cUSD_Bal: parseFloat(response_body_bal.cUSD_Bal).toFixed(2).toString(),
            }
            
            res.render('index',{ 
                walletAddr:walletAddr,
                balances:formatted_balances,
                person:req.user,
                messages: req.flash()})

        })
        .catch(error=>console.log(`Error making POST request: ': ${error}`))
})

router.get('/account/list/invoices', ensureAuthenticated, async (req, res) => {
    try {
        const user_email = req.user.userEmail;
        const invoice_list = await invoices_collection.find({ invoiceOwnerEmail: user_email }).toArray();
        const user_addr = await account_collection.findOne({ _id: new ObjectId(req.user._id) });

        if (!user_addr) {
            throw new Error('User address not found');
        }

        const URL = process.env.CELO_BALANCE_ENDPOINT;
        const payload = {
            addr: user_addr.walletAddress
        };

        const walletAddr = formatCryptoAddr(user_addr.walletAddress);

        const response = await axios.post(URL, payload);
        const response_body_bal = response.data || {};

        const formatted_balances = {
            CELO_Bal: parseFloat(response_body_bal.CELO_Bal).toFixed(2).toString(),
            cUSD_Bal: parseFloat(response_body_bal.cUSD_Bal).toFixed(2).toString(),
        };

        
        res.render('invoice_list', {
            invoices: invoice_list,
            balances: formatted_balances,
            walletAddr: walletAddr,
            person: req.user
        });

    } catch (error) {
        console.error(`Error processing request: ${error}`);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/account/login',(req,res) => {
    res.render('login',{ messages: req.flash()})
})

router.get('/account/signup',(req,res)=>{
    res.render('signup',{ messages: req.flash()})
})

router.post('/account/create', addUser)
    .post('/account/signin', signInUser)
    .post('/account/logout',ensureAuthenticated,logOutUser)

router.post('/invoice-processing', ensureAuthenticated,upload.single('invoice_form'),require('../controllers/invoice_controller'))
router.get('/list/companies', async(req,res)=>{
    
})


module.exports = router