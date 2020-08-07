const path = require('path');
const netId = "5777";

const getFlightContract =  (web3) =>{
var FlightCompJSON =require(path.join(__dirname, 'build/contracts/FlightComponsationLogic.json'))
let netId = Object.keys(FlightCompJSON.networks)[0];
const contractAddress = FlightCompJSON.networks[netId].address;
const abi = FlightCompJSON.abi;
FlightContract = new web3.eth.Contract(abi, contractAddress);
 return FlightContract;
}

const getFlightDataContract =  (web3) =>{
    var FlightDataJSON =require(path.join(__dirname, 'build/contracts/FlightData.json'))
    let netId = Object.keys(FlightDataJSON.networks)[0];
    const contractAddress = FlightDataJSON.networks[netId].address;
    const abi = FlightDataJSON.abi;
    FlightDataContract = new web3.eth.Contract(abi, contractAddress);
    return FlightDataContract;
}

const getOwnerAddress = () =>{
    let serverConfig =require(path.join(__dirname, 'config/server.json')) ;
    let ownerAddres  = serverConfig['newtork']['owneraddress'] ;
    return ownerAddres ;
}


const getNetworkUrl = () =>{
    let serverConfig =require(path.join(__dirname, 'config/server.json')) ;
    let ownerAddres  = serverConfig['newtork']['url'] ;
    return ownerAddres ;
}

exports.getFlightContract = getFlightContract;
exports.getFlightDataContract = getFlightDataContract;
exports.getOwnerAddress = getOwnerAddress;
exports.getNetworkUrl = getNetworkUrl;