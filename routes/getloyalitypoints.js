var express = require('express');
var router = express.Router();
router.post('/', function(req, res, next) {
    let reqData = req.body;
    console.log("address---",reqData.address);
    CompensationContract.methods.getPassengerLoyalityPoints(reqData.address).call({ from: OwnerAddress }).then(function (data) {
                
             res.send({"points":data});

           }).catch(function(e) {

             console.log(e.message);
             res.send({"points":"0"});
         
         });
 
});

module.exports = router;