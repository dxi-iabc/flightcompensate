const Web3 = require('web3');
const fs   = require('fs');
var Request = require("request");
const utils = require('./utils');
const path = './data/data.json';

async function urlTest(){


    
setTimeout(async () => {


    try {
      
        

        fs.readFile(path, 'utf-8', function(err, data) {
          if (err) throw err
          arrayOfObjects = JSON.parse(data);
          for(var i =0 ; i < arrayOfObjects.length ; i++){
           
          
           callUrls(arrayOfObjects[i].PNR,arrayOfObjects[i].FlightNo);
  
          }
               
        
      });
      
      } catch(err) {
        console.log(err);
      }
  

      
    
}, 100);

}

async function callUrls(pnr,flightno){
console.log("https://demo-flight-status.herokuapp.com/flightstatus/"+pnr+"/"+flightno)
  Request.get("https://demo-flight-status.herokuapp.com/flightstatus/"+pnr+"/"+flightno, (error, response, body) => {
    console.log(body)
  });
}
const deleteFile = async (filepath)=> {

    try {

       fs.unlinkSync(filepath)
    
    } catch(err) {

         console.log(err);

    }
}

urlTest()