const express = require('express')
const router = express.Router()
const {getNumberofCompanies,getWalletAddresses} =require('../controllers/contract_get_company_details')


router.post('/get-companies', require('../controllers/contract_create_company'))
router.post('/wallet-addresses',getWalletAddresses)
router.post('/companies/number',getNumberofCompanies)

module.exports = router