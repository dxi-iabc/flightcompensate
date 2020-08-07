var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

  CompensationContract.methods.getAccountBalance().call({ from: OwnerAddress}).then(async function (data) {
             
             console.log("---inside---",data)
           
            let balance = web3.utils.fromWei(await web3.eth.getBalance(OwnerAddress), "ether") + " ETH";
            let result = web3.utils.fromWei(data, "ether") + " ETH" ;
            console.log(balance , result ,"bal")
             res.render('admin', { title: 'Flight Compensation' ,"address" :OwnerAddress,"balance" : result ,"ownerbal":balance });

           }).catch(function(e) {

            console.log(e.message);
            res.render('admin', { title: 'Flight Compensation' ,"address" :OwnerAddress ,"ownerbal" : "0","balance":'0'});
         
         });
 
});

module.exports = router;