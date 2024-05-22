const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const session = require('express-session')
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const kit = ContractKit.newKitFromWeb3(web3)
const flash = require('connect-flash')
const passport = require('passport')
require('./credentials/passport')(passport)
const ensureAuth = require('./credentials/auth')
const app = express()

//bring in express middleware
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./app/public'))
app.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:true,
        saveUninitialized:true,
        cookie:{
            maxAge:30*60*1000
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())

//TODO:Fix falsh() message
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.success=req.flash('success')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})

//account credentials
//TODO: Make DB for this, use API Key and token to acquire also
const credentials = {
    address:'0x3EC70BA37129814296f4e8A46b5aD4D1C9971872'
}

async function checkBalance(){
    //get contracts
    let celotoken = await kit.contracts.getGoldToken()
    let cUSDToken = await kit.contracts.getStableToken()

    //your celo account or wallet connected to Alfajores test net
    const walletAddress = credentials.address
    //to correctly represent celo balance from BigInt we have to use
    /*
        1 CELO = 10^18 Wei
    */
    let celoBalance = await celotoken.balanceOf(walletAddress)
    let cUsdBalance = await cUSDToken.balanceOf(walletAddress)
    return {cUSD_bal:cUsdBalance,celo_bal:celoBalance}
}

/*baseURL/ Endpoint
    ------------------------------------
  " http://localhost:5001/api/celo/dapp/v1.0/fastway_token/ " - For Testing
    ------------------------------------
*/
//enpoint
let baseURL_endpoint = '/api/celo/dapp/v1.0/fastway_token'


//(A) ACCOUNTS
//@GET REQUESTS
//Check account balance
app.get(`${baseURL_endpoint}/checkbalance`, async (req,res) => {
    /*get formatted CELO balance */
    let account_bal = await checkBalance()
    let formatted_celo_bal = (parseFloat(account_bal.celo_bal)/Math.pow(10,18)).toString()
    res.status(200).json({response:account_bal,CELO:formatted_celo_bal})
})

//@POST REQUESTS
//Development Endpoints
//Create or use an existing account dummy account
app.use(`${baseURL_endpoint}/accounts`,require('./routes/handle_account_dev'))
app.use(`${baseURL_endpoint}/transactions`,require('./routes/handle_transactions_dev'))
app.use(`${baseURL_endpoint}/contract/details`,require('./routes/contract_route'))
//Production Endpoints
//1. Endpoint for AI and ML services
//post invoice details
app.use(`${baseURL_endpoint}/analysis`, require('./routes/get_invoice_details'))
//UI Endpoints
const ui_baseURL = '/app/fastway'
//home endpoint
app.use(`${ui_baseURL}`, require('./app/app'))


const PORT = process.env.PORT||5000
app.listen(PORT,e=>console.log(`App listening on PORT ${PORT}...`))

