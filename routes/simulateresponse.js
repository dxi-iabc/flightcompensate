var express = require('express');
var router = express.Router();
var Request = require("request");
router.post('/', function(req, res, next) {
    console.log("in side simulare response" ,req.body)

Request.get("https://demo-flight-status.herokuapp.com/getcurrencyratedetails", (error, response, body) => {
  console.log("in side simulare response rest" ,body)
    if(error) {
        
    }
  var currdata = JSON.parse(body);
  reqData      = req.body;
  var status   = reqData.status;
  var distance = reqData.distance;
  var hours    = reqData.hours;
  var rate     = currdata.etherrate;
  var amount   = reqData.amount;
  console.log("all details " ,status,distance,hours,rate, amount);

  CompensationContract.methods.flightRuleSimulation(status,parseInt(distance),parseInt(hours),parseInt(rate),parseInt( amount)).call({from:OwnerAddress}).then((data)=>{
       console.log("all details " ,data);
       let result   = web3.utils.fromWei(data[1].toString(), "ether") + " ETH"
       res.send({"status":"success","compamount" : result, "type":data[0]});

  });


});
});
module.exports = router;
