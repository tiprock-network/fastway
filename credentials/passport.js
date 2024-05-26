const LocalStrategy = require('passport-local').Strategy;
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcrypt');
const connectToMongoDB = require('../functions/connectToMongoDB');

// MongoDB client
const mongo_client = new MongoClient(process.env.MONGODB_URI);

async function connectToDb() {
    if (!mongo_client.topology || !mongo_client.topology.isConnected()) {
        await mongo_client.connect();
    }
}

async function getCollection() {
    await connectToDb();
    return mongo_client.db(process.env.DB_NAME).collection(process.env.USER_COLLECTION);
}

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'uemail', passwordField: 'password' }, async (email, password, done) => {
            try {
                if (!email || !password) {
                    return done(null, false, { message: 'Kindly check the email entered or register for a new account.' });
                }

                await connectToMongoDB();
                const account_collection = await getCollection();
                
                // Find the user
                let user = await account_collection.findOne({ userEmail: email });
                
                if (!user) {
                    return done(null, false, { message: 'No user found with this email.' });
                }

                // Check the password
                bcrypt.compare(password, user.userPassword, function (err, result) {
                    if (err) return done(err);
                    if (result) return done(null, user);
                    return done(null, false, { message: 'The password is incorrect.' });
                });
            } catch (error) {
                console.log(`This error occurred while trying to login: ${error}`);
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            await connectToMongoDB();
            const account_collection = await getCollection();
            let user = await account_collection.findOne({ _id: new ObjectId(id) });
            
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (error) {
            done(error, null);
        }
    });
};
