const express = require('express')
const router = express.Router()
const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
const kit = ContractKit.newKitFromWeb3(web3)
const getAccount = require('../controllers/get_test_account')
const convertToFloat = require('../functions/convertToFloat')



router.post('/send', async (req,res) => {
    //get the receiver's address
    const {receiver_addr, amount} = req.body
    //returns an object for account details
    let sender_acc = await getAccount()

    // Add sender private key
    //THIS MUST BE DONE **** MOST IMPORTANT LINE OF ALL*****
    await kit.connection.addAccount(sender_acc.privateKey)

    //get celo token wrappers
    let celoToken = await kit.contracts.getGoldToken()
    let cUSDToken = await kit.contracts.getStableToken()

      
     //send funds
     let cUSDtx = await cUSDToken.transfer(receiver_addr, amount).send({
         from:sender_acc.address,
         feeCurrency:cUSDToken.address
     })
 
     //wait for the funds to be sent
     //TODO: Activate later
     let receipt  = await cUSDtx.waitReceipt()
     
     //get account balance
     let celo_crude_bal = await celoToken.balanceOf(sender_acc.address)
     let cUSD_crude_bal = await cUSDToken.balanceOf(sender_acc.address)
     let celo_sender_acc_bal = convertToFloat(celo_crude_bal).toString()
     let cUSD_sender_acc_bal = convertToFloat(cUSD_crude_bal).toString()
 
     //send transaction status with remaining balances
     res.status(201).json({
         acc_bal:{
             CELO_Bal:celo_sender_acc_bal,
             cUSD_Bal:cUSD_sender_acc_bal,
             CELO_tokens:celo_crude_bal,
             cUSD_tokens:cUSD_crude_bal
         },
         transaction_status:'Successful',
         receiver_address:receiver_addr,
         receipt: receipt
     })
   

})

router.post('/account/balance', async(req,res)=>{
    //the wallet owner address
    const {addr} = req.body
    try {
        if(addr){
                //get celo token wrappers
                let celoToken = await kit.contracts.getGoldToken()
                let cUSDToken = await kit.contracts.getStableToken()

                //get account balance
                let celo_crude_bal = await celoToken.balanceOf(addr)
                let cUSD_crude_bal = await cUSDToken.balanceOf(addr)
                let celo_sender_acc_bal = convertToFloat(celo_crude_bal).toString()
                let cUSD_sender_acc_bal = convertToFloat(cUSD_crude_bal).toString()

                    //send transaction status with remaining balances
                    res.status(201).json({
                        
                            CELO_Bal:celo_sender_acc_bal,
                            cUSD_Bal:cUSD_sender_acc_bal,
                            CELO_tokens:celo_crude_bal,
                            cUSD_tokens:cUSD_crude_bal
                        
                    })
                }else{
                    res.status(400).json({error:'Bad request'})
                }
    } catch (error) {
        res.status(500).json({error:`Internal Server Error`,response:error})
    }
})

module.exports = router
