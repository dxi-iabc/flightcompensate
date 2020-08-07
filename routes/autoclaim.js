var express = require('express');
var router = express.Router();
function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

router.post('/', async function (req, res, next) {

  
  reqData = JSON.parse(req.body.data);
  console.log(reqData.length,"in",reqData)
   let receipt ;
   let errormOccured = false;
   let errorMsg =""
  for(var i= 0; i < reqData.length ; i++){
 console.log("------------------inside---------",reqData[i])
   await CompensationContract.methods.payPassengerCompensation(reqData[i].flightno,reqData[i].address,reqData[i].pnr).send({ from:OwnerAddress, gas: 6400000})
   .on('receipt',async (receipt) => {
        let hash = receipt.transactionHash.toString() ;
        console.log(hash ,"Hash ", JSON.stringify(receipt) );
         
         receipt  =  {"blockHash": receipt.blockHash ,"blockNumber" : receipt.blockNumber , "from" : receipt.from ,"to" : receipt.to}
         storeData(  reqData[i].pnr , reqData[i].address , reqData[i].flightno , hash, JSON.stringify(receipt));
         
         
    }).on('error', (error) => {

      console.log(error.message);
      errormOccured = true;
      errorMsg += error.message;
    
  
    });
        sleep(1000);
    
  }
 if(errormOccured)
          res.send( {"result" : errorMsg , "error" : true});
      else
        res.send( {"result" : "You request processed successfully!", "error" : false});

 
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
