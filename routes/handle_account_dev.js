const express = require('express')
const router = express.Router()
const getAccount = require('../controllers/get_test_account')

router.get('/test-client', async (req,res)=>{
    res.json({acc_info: await getAccount()})
})

module.exports = router