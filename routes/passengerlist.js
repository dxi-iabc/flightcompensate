var express = require('express');
var router = express.Router();
const dataPath = './data/data.json';
const fs   = require('fs');
var Request = require("request");
var data;
var balance;
var result;
var pnrList=[];
var distance = "";
var hours    = "";
var flighttype="";
var paidrows =[];
var flightData = null;
/* GET home page. */
router.get('/', function(req, res, next) {
    pnrList=[];
    paidrows =[];
    flightData = null;
    console.log("Flightno",req.query.flightnpo)
    var flightNo = req.query.flightnpo;
    getFlightDetails(flightNo);
    prepareDispaly(flightNo).then(
      
    fs.readFile(dataPath, 'utf-8', function(err, dataContent) {
        if (err) throw err
        console.log("---Data--", dataContent);
        arrayOfObjects = JSON.parse(dataContent);
        console.log("------------paid rows",paidrows)
        res.render('passview', { title: 'Flight Compensation',"paidrows":paidrows,"pnrList" : pnrList,"flightno":flightNo,"distance" : distance,"hours" : hours,"flighttype" : flighttype,"contractaddress": OwnerAddress ,"data":getBookDetails(arrayOfObjects,flightNo),"address" :OwnerAddress,"balance" : result ,"ownerbal":balance});
 }));

});

function getBookDetails(array, flightNo){
var filterdList = [];
 for(var i=0; i < array.length; i++){

     if(array[i].FlightNo.trim()  ==  flightNo.trim() )
     filterdList.push(array[i]);

 }
 return filterdList;
}
function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}


async function getAllPaidPass(flightNo){

    var sql = "select * from FlightComp where flightno ='"+ flightNo + "'"
    var params = []
    await db.all(sql, params, (err, rows) => {
        if(rows.length > 0){
          rows.forEach((row)=>{
              paidrows.push(row.pnr+row.flightno+row.passaddress)
          });
        }
          return rows;
      });
}

async function prepareDispaly(flightNo){
    await getFlightDetails(flightNo);
    await getAllPaidPass(flightNo);
    sleep(2000);
    data = await CompensationContract.methods.getAccountBalance().call({ from: OwnerAddress});
    balance = web3.utils.fromWei(await web3.eth.getBalance(OwnerAddress), "ether") + " ETH";
    result =  web3.utils.fromWei(data, "ether") + " ETH" ;
   sleep(2000);
    console.log("Distance",distance,hours,flighttype)
    
}

async function getFlightDetails(flightno){

  await Request.get("https://demo-flight-status.herokuapp.com/fligtdetails/"+flightno, (error, response, body) => {
    
     var data = JSON.parse(body)
    
     for (var key in data) {
       
    
				if(key != undefined) {
				
				    
                      distance   = data[key].result.distance + " KM" ;
                      hours      = data[key].result.hours + " Hrs";
                      flighttype = data[key].result.flighttype ;
                      if(distance == undefined ||distance.trim().length ==0 ){
                        
                               distance = data[key].result.status.split("|")[1]
                      }
                      if(flighttype == "I" || flighttype == "i")
                       flighttype= "International";
                      else
                      flighttype ="Domestic";
                      pnrList.push(key);
					
				}
                
         
			}
            
   
  });
  console.log("Distance",distance,hours,flighttype)
}
module.exports = router;
