require('dotenv').config()
const Web3 = require('web3')
const abi = require('../smartcontract/abi')

const getNumberofCompanies = async (req,res) =>{
    const {contract_addr} = req.body
    const web3_instance = new Web3(new Web3.providers.HttpProvider(process.env.ALFAJORES_TESTNET))
    const contract = new web3_instance.eth.Contract(abi,contract_addr)
    const total_companies = await contract.methods.getNumberofCompanies().call();
    res.json({
        no_of_companies:total_companies
    })
}

const getWalletAddresses = async (req,res) =>{
    const {contract_addr} = req.body
    const web3_instance = new Web3(new Web3.providers.HttpProvider(process.env.ALFAJORES_TESTNET))
    const contract = new web3_instance.eth.Contract(abi,contract_addr)
    const companies_wallet = await contract.methods.getAddresses().call()
    console.log(companies_wallet)
    res.json({
        walletAddresses:companies_wallet
    })
}

module.exports = {getNumberofCompanies,getWalletAddresses}