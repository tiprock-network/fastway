const connectToMongoDB = require('../functions/connectToMongoDB')
const databaseInfo = require('../credentials/db_metadata')
const {MongoClient} = require('mongodb')
//mongobd client
const mongo_client = new MongoClient(databaseInfo.mongo_uri)
const company_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.user_collection)

connectToMongoDB()

const companyQueryResult = async (req, res) => {
    const { searchText } = req.body;

    try {
        const indexExists = await checkIndexes('users');

        if (!indexExists) {
            await company_collection.createIndex({ firstName: "text", lastName: "text" });
            console.log(`Index created on collection: ${databaseInfo.user_collection}`);
        }

        //TODO: Remove sensitive info from search results e.g. passwords
        let search_result = await company_collection.find(
            { $text: { $search: searchText } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).toArray();

        res.status(200).json({ results: search_result });
    } catch (err) {
        console.error("Error querying companies", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const checkIndexes = async (collectionName) => {
    try {
        const db = mongo_client.db(databaseInfo.db_name);
        const collection = db.collection(collectionName);
        const indexes = await collection.listIndexes().toArray();
        //console.log('The indexes: ',indexes);

        for (let index of indexes) {
            if (index.name && index.name == 'firstName_text_lastName_text' ) {
                //console.log("Index exists: firstName or lastName");
                return true;
            }
        }
        console.log("No matching index found");
        return false;
    } catch (err) {
        console.error("Error checking indexes", err);
        return false;
    }
};

module.exports = companyQueryResult