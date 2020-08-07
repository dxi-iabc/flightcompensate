const Web3 = require('web3');
const fs   = require('fs');
var Request = require("request");
const utils = require('./utils');
const path = './data/data.json';
web3=new Web3(new Web3.providers.HttpProvider(utils.getNetworkUrl()));
flightData = utils.getFlightDataContract(web3);

async function migrateData(){

  console.log( "                                         ")
  console.log( " ____    _____      _      ____    _____ ");
  console.log( "/ ___|  |_   _|    / \    |  _ \  |_   _|");
  console.log( "\___ \    | |     / _ \   | |_) |   | |  ")
  console.log( " ___) |   | |    / ___ \  |  _ <    | |  ");
  console.log( "|____/    |_|   /_/   \_\ |_| \_\   |_|  ");
    
setTimeout(async () => {


    try {
        web3=new Web3(new Web3.providers.HttpProvider(utils.getNetworkUrl()));
        accounts =   await web3.eth.getAccounts();
        
        console.log("************************************************");
        console.log("************ started data migration  ************");
        console.log("***********************************************");
        fs.readFile(path, 'utf-8', function(err, data) {
          if (err) throw err
          arrayOfObjects = JSON.parse(data);
          for(var i =0 ; i < arrayOfObjects.length ; i++){
            console.log("---inserting record no-----",1)  
           flightData.methods.addBooking(arrayOfObjects[i].FlightNo,arrayOfObjects[i].PNR,arrayOfObjects[i].address,arrayOfObjects[i].Name,arrayOfObjects[i].quantity).send({from:accounts[0],gas:680000});
           callUrls(arrayOfObjects[i].PNR,arrayOfObjects[i].FlightNo);
  
          }
               
        
      });
      
      } catch(err) {
        console.log(err);
      }
  
      console.log( '                         ' );                      
      console.log( " _____   _   _   ____   " );
      console.log( "| ____| | \ | | |  _ \  " );
      console.log( "|  _|   |  \| | | | | | " );
      console.log( "| |___  | |\  | | |_| | " );
      console.log( "|_____| |_| \_| |____/  " );
      console.log( '                          ');
      
    
}, 2000);

}

async function callUrls(pnr,flightno){

  Request.get("https://demo-flight-status.herokuapp.com/flightstatus/"+pnr+"/"+flightno, (error, response, body) => {
  });
}
const deleteFile = async (filepath)=> {

    try {

       fs.unlinkSync(filepath)
    
    } catch(err) {

         console.log(err);

    }
}
deleteFile("./db.sqlite");
migrateData()