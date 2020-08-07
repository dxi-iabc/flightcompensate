const Web3 = require('web3')
const FlightComponsationLogic = artifacts.require('./FlightComponsationLogic.sol')
const FlightData = artifacts.require("./FlightData");

var Config = async function (accounts) {
    
    let owner = accounts[0];
    const flightData = await FlightData.new();
    const flightComponsationApp  = await FlightComponsationLogic.new(flightData.address ,{from:accounts[0]});
    await flightData.setContarctAddress(flightComponsationApp.address);
    let value = web3.utils.toWei("8","ether").toString();
    flightComponsationApp.deposit({from:accounts[0],value:value})
    flightData.addBooking("123","PNR1234",accounts[1],2);
    flightData.addBooking("125","123",accounts[2],2);
    flightData.addBooking("1251","PNR12341",accounts[1],2);
    let contarctAddress =  flightData.address ;
    return {
        owner: owner,
        flightData: flightData,
        contarctAddress:contarctAddress,
        flightComponsationApp: flightComponsationApp,

    }
}

module.exports = {
    Config: Config
};