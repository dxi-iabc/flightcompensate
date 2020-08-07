var express = require('express');
var router = express.Router();
router.get('/', async function(req, res, next) {
  let pnr = req.query.pnr;
  console.log(pnr)
  var rateQty= await FlightDataContract.methods.getCompensationQtyAndRate(pnr).call({from:OwnerAddress});
  console.log("---------------Rate Qty---------",rateQty)
  FlightDataContract.methods.getCompensationStatusDetails(pnr).call({from:OwnerAddress}).then(async function (data) {
               console.log(data)   
            
                let amount  = web3.utils.fromWei(data[1], "ether") + " ETH" ;
                let status  = data[2] ;
                let type    = data[3] ;
                let currencyAmount = "€" +data[4]  ;
                let delayInHours   = data[5] ;
               
                res.send({"amount":amount ,"status": status ,"type" :type , "FiatCurrenyAmount":currencyAmount,"HoursDelay":delayInHours , time:new Date(parseInt(data[6])*1000).toLocaleString(),"rate":rateQty[0],"qty":rateQty[1]});
           }).catch(function(e) {
            console.log("error",e.message);
             res.send({"data":"Not Available"});
           });

         
    
});

module.exports = router;