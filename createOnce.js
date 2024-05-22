const Web3 = require('web3')
const web3_object = new Web3()

let new_rand_account = web3_object.eth.accounts.create();
console.log(new_rand_account)