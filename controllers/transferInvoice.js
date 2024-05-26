const contractAddress = process.env.CONTRACT_ADDRESS
const Web3 = require('web3')
const abi = require('../smartcontract/abi')
const companyLister = require('../functions/listCompaniesFromChain')
const findCompany = require('../functions/findCompany')
const connectToMongoDB = require('../functions/connectToMongoDB')
const {MongoClient} = require('mongodb')
const databaseInfo = require('../credentials/db_metadata')
const mongo_client = new MongoClient(databaseInfo.mongo_uri)
const invoices_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.items_collection)

connectToMongoDB()
const transfer = async (req,res) =>{
    const _id = req.params.id
    
    //get the contract
    const web3_instance = new Web3(new Web3.providers.HttpProvider(process.env.ALFAJORES_TESTNET))
    const contract = new web3_instance.eth.Contract(abi,contractAddress)
    let companies = await contract.methods.fetchAllCompanies().call()
    let fields = ['address','name','image_url','desc','list','email','phone','street_address']
    /*console.log(companies)*/
    let company_list = companyLister(companies,fields)
    let company_data = findCompany(company_list,_id)

    const clientInvoices = await invoices_collection.find({invoiceOwnerEmail:req.user.userEmail}).toArray()
    //console.log(clientInvoices)
    //add minipay kit to display balance and address
    res.render('transfer',{companiesList:company_data, invoices: clientInvoices})
}

module.exports = transfer