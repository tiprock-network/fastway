const express = require('express')
const router = express.Router()
const getCompanies = require('../controllers/retrieveCompaniesQuery')

router.post('/getcompanies',getCompanies)

module.exports = router