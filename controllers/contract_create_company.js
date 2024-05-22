require('dotenv').config()
const Web3 = require('web3')
const abi = require('../smartcontract/abi')

const getCompanies = async (req,res) =>{
    const {acc_addr,contract_addr,privateKey,name,imageUrl,desc,services,email,phone,address,type} = req.body
    const web3_instance = new Web3(new Web3.providers.HttpProvider(process.env.ALFAJORES_TESTNET))
    const contract = new web3_instance.eth.Contract(abi,contract_addr)
    const createTx = await contract.methods.createCompany(
        name,imageUrl,desc,services,email,phone,address,type
    )

    const gasEstimate = await createTx.estimateGas({ from: acc_addr })

    const tx ={
        from:acc_addr,
        to:contract_addr,
        gas:gasEstimate,
        data:createTx.encodeABI()
    }

    const signedTx = await web3_instance.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3_instance.eth.sendSignedTransaction(signedTx.rawTransaction);

    const result = await contract.methods.fetchAllCompanies().call();
    res.status(201).json({
        result:result,
        receipt:receipt
    })
}

module.exports = getCompanies