const Web3 = require('web3');
const fs   = require('fs');
var Request = require("request");
const utils = require('./utils');
const path = './data/data.json';
web3=new Web3(new Web3.providers.HttpProvider(utils.getNetworkUrl()));


async function transferMoney(){

    
setTimeout(async () => {


    try {
        web3=new Web3(new Web3.providers.HttpProvider(utils.getNetworkUrl()));
        accounts =   await web3.eth.getAccounts();
        
 web3.eth.sendTransaction({from:accounts[1],to:accounts[0], value:web3.utils.toWei('49990', "ether")})

 web3.eth.sendTransaction({from:accounts[2],to:accounts[0], value:web3.utils.toWei('49990', "ether")})

 web3.eth.sendTransaction({from:accounts[3],to:accounts[0], value:web3.utils.toWei('49990', "ether")})

 web3.eth.sendTransaction({from:accounts[4],to:accounts[0], value:web3.utils.toWei('49990', "ether")})

        
  
      
      } catch(err) {
        console.log(err);
      }
  
     
    
}, 1000);

}


transferMoney()