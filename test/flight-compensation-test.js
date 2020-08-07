const Web3 = require('web3')
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
const { waitForEvent } = require('./utils')
const web3WithWebsockets = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))
contract('FlightComponsationLogic', (accounts) => {
 const GAS_LIMIT = 9e6
 let flComp;
 let flightData;
 let contarctAddress;
 let config;
 before('setup contract',async () => {

    config   = await Test.Config(accounts);
    flightData = config.flightData;
    flComp   = config.flightComponsationApp ;
    contarctAddress =  config.contarctAddress ;
    
  });
   



  it('Should get owner addres correctly', async () => {
    let owner = await flComp.getOwnerAddress();
    console.log("Owner address", owner);
    assert(owner == accounts[0],"Error. owner not assigned") 
   });

   
  it('Should successfully get compensation status', async () => {
    let status = await flComp.getCompensationStatus("PNR1234");
    assert(status == false,"Error. wrong status") 
   });

  it("sets an owner", async () => {
    
    assert.equal(await flComp.getOwnerAddress() ,accounts[0]);
  });
  
  it("get  flightdat contarct address correctly", async () => {
    
    assert.equal(await flComp.getContractAddress() ,contarctAddress);
  });

  

  it("Only owner can transfer money to contarct address", async () => {
     
    let startbalance = await flComp.getAccountBalance();
    await truffleAssert.reverts( flComp.deposit( {from:accounts[1],value:1000000000000000000}),"Caller is not contract owner");
    let currentbalance = await flComp.getAccountBalance();
    let expected =web3.utils.fromWei(startbalance,"ether");
    assert.equal(web3.utils.fromWei(currentbalance,"ether") ,expected);
  });

  
  it("Owner  canot claim compensation", async () => {
     
    let startbalance = await flComp.getAccountBalance();
    await truffleAssert.reverts( flComp.deposit( {from:accounts[1],value:1000000000000000000}),"Caller is not contract owner");
    let currentbalance = await flComp.getAccountBalance();
    let expected =web3.utils.fromWei(startbalance,"ether");
    assert.equal(web3.utils.fromWei(currentbalance,"ether") ,expected);
  });
  
  it("Should successfully transfer money to contarct address", async () => {
 let result;
 let startbalance;
  const { contract: deployedContract } = flComp;
  const { methods, events } = new web3WithWebsockets.eth.Contract(
      deployedContract._jsonInterface,
      deployedContract._address
    );
    contractEvents = events;
    contractMethods = methods;
 web3.eth.getBalance(accounts[2]).then((bal)=>{
    console.log("---",bal);
    startbalance = bal;
 })
console.log("Balance" ,startbalance);
let pnr = 123;
let status = await flightData.getCompensationStatus("123");
if(status){
   pnr  = pnr + 2
}
await flightData.addBooking("125",pnr.toString(),accounts[2],2)
flComp.payPassengerCompensation("125",accounts[2],pnr.toString()).then((res) =>{
       result = res;

      return new Promise(resolve => setTimeout(resolve, 3000));
}).then(function(){

 
   waitForEvent(contractEvents["LogCompensationPaid"]).then((res)=>{
   console.log("---new----------",res.Result);
   web3.eth.getBalance(accounts[2]).then((newbal)=>{
   assert(newbal > startbalance);
    })  ;
   }) ;
     
});


     
  });

})
