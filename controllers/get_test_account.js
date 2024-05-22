const Web3 = require('web3')
const web3_object = new Web3()
//libraries to handle file operations
const fs = require('fs')
const path = require('path')

//create or use secret file
const filepath = path.join(__dirname,'../credentials/.secret')
//function to create account if it does not alread exist
const getAccount = async () =>{
    if (fs.existsSync(filepath)) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, { encoding: 'utf-8' }, async (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(await web3_object.eth.accounts.privateKeyToAccount(data));
                }
            });
        });
    } else {
        let new_rand_account = web3_object.eth.accounts.create();
        fs.writeFile(filepath, new_rand_account.privateKey, (err) => {
            if (err) {
                console.log(err);
            }
        });

        return new_rand_account;
    }
}

module.exports = getAccount