const FlightComponsationLogic = artifacts.require("FlightComponsationLogic");
const FlightData = artifacts.require("FlightData");
const FlightUtil = artifacts.require("FlightUtil");
const fs = require('fs');
const Web3 = require('web3');
const path = './data/data.json'
module.exports = async(deployer, network, accounts) => {
console.log(network.id)
let owner = accounts[0];
await deployer.deploy(FlightUtil);
deployer.link(FlightUtil, FlightComponsationLogic);
await deployer.deploy(FlightData);
let flightData = await FlightData.deployed();
let flightComponsationContract = await deployer.deploy(FlightComponsationLogic, FlightData.address) ;
  
let config = {
    newtork: {
        url : 'http://localhost:9545',
        dataAddress : FlightData.address ,
        appAddress: flightComponsationContract.address,
        owneraddress: owner
  }
}

fs.writeFileSync(__dirname + '/../config/server.json',JSON.stringify(config, null, '\t'), 'utf-8');
updateFile([accounts[1], accounts[2],accounts[3],accounts[4],accounts[5],accounts[6],accounts[7],accounts[8],accounts[9]])
await flightComponsationContract.deposit(
    {from: owner, value: Web3.utils.toWei('3000', "ether")});
    //flightData.addBooking("BJ153","B2JJEW5",accounts[1],2);
     //flightData.addBooking("WS153","XDRDHJ",accounts[2],2);
     //flightData.addBooking("WK220","WXIKXI",accounts[1],2);
     flightData.setContarctAddress(flightComponsationContract.address);
};

function updateFile(addresses){

  try {

    fs.readFile(path, 'utf-8', function(err, data) {
        if (err) throw err
        arrayOfObjects = JSON.parse(data);
        for(var i =0 ; i < arrayOfObjects.length ; i++){
          
          arrayOfObjects[i].address = addresses[i];

        }
       
               
        
        fs.writeFile(path, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
           // if (err) throw err
            console.log('Done!')
        });
    
    });
    
           
        } catch(err) {
    
             console.log(err);
    
        }
    }



