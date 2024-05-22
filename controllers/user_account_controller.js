const {MongoClient} = require('mongodb')
require('dotenv').config()
const axios = require('axios')
const bcrypt = require('bcrypt')
const connectToMongoDB = require('../functions/connectToMongoDB')
const databaseInfo = require('../credentials/db_metadata')
//mongobd client
const mongo_client = new MongoClient(databaseInfo.mongo_uri)
const account_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.user_collection)
const passport = require('passport')



const addUser = async (req,res) => {
    //get signup information

    const {username, firstName, lastName, country, phoneNumber, email, walletAddress, privateKey, password, customerType,imageUrl,desc,services,address,type} = req.body
    if(!username||!firstName||!lastName||!country||!phoneNumber||!email||!walletAddress||!privateKey||!password||!customerType){console.log('Some fields might be missing.')} else {
        if(customerType==='buyer'){
            try {
                //encrypt password
                bcrypt.hash(password, 10, async function(err,hash){
                    //connect to database
                    await connectToMongoDB()
                    //check if a user exists (email)
                    let checkedAccount = await account_collection.countDocuments({userEmail:email})
                    //TODO: Check for existing usernames
                    if(checkedAccount>0){
                        console.log('A user with this email already exists.')
                    }else{

                        let newUser = await account_collection.insertOne(
                            {
                                username:username, 
                                firstName:firstName, 
                                lastName:lastName, 
                                phone:phoneNumber, 
                                userEmail:email, 
                                walletAddress:walletAddress, 
                                privateKey:privateKey, 
                                userPassword: hash,
                                customerType:customerType
                            }
                        )
                        //console.log(`Your account has been created with the Id ${newUser.insertedId}`)
                        res.redirect('/app/fastway/account/login')
                    }
                })
            } catch (error) {
                console.log(`This error occurred: ${error}`)
            }
        }else if(customerType==='seller'){
            let service_string = services?services:''
            let services_array = service_string.split(/[ ,]+/) //split by space or comma
            try {
                //encrypt password
                bcrypt.hash(password, 10, async function(err,hash){
                    //connect to database
                    await connectToMongoDB()
                    //check if a user exists (email)
                    let checkedAccount = await account_collection.countDocuments({userEmail:email})
                    //TODO: Check for existing usernames
                    if(checkedAccount>0){
                        console.log('A user with this email already exists.')
                    }else{
                        //get the wallet addresess available

                        axios.post(process.env.WALLET_ADDRESSES_ENDPOINT,{
                            contract_addr:process.env.CONTRACT_ADDRESS
                        })
                        .then(async (response)=>{
                            let wallet_check = response.data.walletAddresses.filter(address=>address==walletAddress)
                            if(wallet_check==walletAddress){
                                console.log('An account with this address has been created.')
                            }else{
                                let newCompany = await account_collection.insertOne(
                                    {
                                       
                                        firstName:firstName, 
                                        lastName:lastName, 
                                        phone:phoneNumber, 
                                        userEmail:email, 
                                        walletAddress:walletAddress, 
                                        privateKey:privateKey, 
                                        userPassword: hash,
                                        customerType:customerType,
                                        service:services_array
                                    }
                                )
                                //console.log(`Your account has been created with the Id ${newUser.insertedId}`)
                                axios.post(process.env.CREATE_COMPANY_ENDPOINT,{
                                    acc_addr:walletAddress,
                                    contract_addr:process.env.CONTRACT_ADDRESS,
                                    privateKey:privateKey,
                                    name:`${firstName} ${lastName}`,
                                    imageUrl:imageUrl,
                                    desc:desc,
                                    services:services_array,
                                    email:email,
                                    phone:phoneNumber,
                                    address:address,
                                    type:type
                                })
                                .then((response)=>{
                                    console.log('Company created successfully.')
                                    res.redirect('/app/fastway/account/login')
                                }).catch(error=>console.log(`Error making POST request: ': ${error}`))
                                
                            }
                        }).catch(error=>console.log(`Error making POST request: ': ${error}`))

                       
                    }
                })
            } catch (error) {
                console.log(`This error occurred: ${error}`)
            }
        }
    }
}

const signInUser = (req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/app/fastway/home',
        failureRedirect:'/app/fastway/account/login',
        failureFlash: true
    })(req,res,next);

    
}

const logOutUser = (req,res) =>{
    if(req.isAuthenticated()){
        req.logOut((err)=>{
            req.flash("error':Error during signing out.")
        })

    }else{
        res.redirect('/app/fastway/account/login')
    }
}

module.exports = {addUser,signInUser,logOutUser}