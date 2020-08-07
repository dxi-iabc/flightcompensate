var express = require('express');
var router = express.Router();
router.post('/', function (req, res, next) {
  console.log("in")
  reqData = req.body;
  let receipt ;
  CompensationContract.methods.payPassengerCompensation(reqData.flightno,reqData.address,reqData.pnr).send({ from:OwnerAddress, gas: 6400000})
   .on('receipt',(receipt) => {
        let hash = receipt.transactionHash.toString() ;
        console.log(hash ,"Hash ", JSON.stringify(receipt) );
         
         receipt  =  {"blockHash": receipt.blockHash ,"blockNumber" : receipt.blockNumber , "from" : receipt.from ,"to" : receipt.to}
         storeData( reqData.pnr , reqData.address , reqData.flightno , hash, JSON.stringify(receipt));
         res.send( {"result" : "You request processed successfully!", "error" : false});
         
    }).on('error', (error) => {

      console.log(error.message);
      res.send( {"result" : error.message, "error" : true});
  
    });


 
});

async function  storeData(pnr, passengeraddress, flightno , trhash, receiptdetails){
    console.log("---ash--",trhash);
    FlightDataContract.methods.getBookingDetails(flightno.trim(),pnr.trim(), true).call({from:OwnerAddress}).then(async function (data){
    console.log(data,"Name", data[2]);
    var sql    = 'INSERT INTO FlightComp (pnr,passaddress,passname,flightno,hash,receipt) VALUES (?,?,?,?,?,?)' ;
    var params = [ pnr, passengeraddress,data[2].toString(),flightno, trhash , receiptdetails ] ;
    db.run(sql, params, function (err, result) {

      console.log(result, "Errrrror", err)
    })

    });

}

module.exports = router;
