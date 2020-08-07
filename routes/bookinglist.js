var express = require('express');
var router = express.Router();
const dataPath = './data/data.json';
const fs   = require('fs');
var data;
var balance;
var result;
/* GET home page. */
router.get('/', function(req, res, next) {
    prepareDispaly().then(
    fs.readFile(dataPath, 'utf-8', function(err, dataContent) {
        if (err) throw err
        console.log("---Data--", dataContent);
        arrayOfObjects = JSON.parse(dataContent);
        
        res.render('bookinglist', {  "contractaddress": OwnerAddress ,"data":arrayOfObjects,"address" :OwnerAddress,"balance" : result ,"ownerbal":balance});
 }));

});
async function prepareDispaly(){

    data = await CompensationContract.methods.getAccountBalance().call({ from: OwnerAddress});
    balance = web3.utils.fromWei(await web3.eth.getBalance(OwnerAddress), "ether") + " ETH";
    result =  web3.utils.fromWei(data, "ether") + " ETH" ;
    
    
}
module.exports = router;
