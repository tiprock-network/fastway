require('dotenv').config()
module.exports = db_metadata ={
    mongo_uri: process.env.MONGODB_URI,
    db_name:process.env.DB_NAME,
    user_collection:process.env.USER_COLLECTION,
    company_collection:process.env.COMPANY_COLLECTION,
    items_collection:process.env.ITEM_COLLECTION
}