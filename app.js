const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Web3 = require('web3');
const utils = require('./utils');
const loginRouter = require('./routes/index');
const loyalityPoints = require('./routes/getloyalitypoints');
const admin= require('./routes/admin');
const bookinglist = require('./routes/bookinglist');
const simulateresp    = require('./routes/simulateresponse');
const getcompensationstatus = require('./routes/getcompensationstatus');
const claimRequestRouter = require('./routes/claimrequest');
const passengerlist = require('./routes/passengerlist.js');
const autoclaim = require('./routes/autoclaim.js');
web3=new Web3(new Web3.providers.HttpProvider(utils.getNetworkUrl()));
OwnerAddress = utils.getOwnerAddress();
//var MyContractJSON =require(path.join(__dirname, 'build/contracts/FlightComponsationLogic.json'));
web3=new Web3(new Web3.providers.HttpProvider(utils.getNetworkUrl()));

//contractAddress = MyContractJSON.networks['5777'].address;

//console.log(contractAddress);

// get abi
//const abi = MyContractJSON.abi;

// creating contract object
CompensationContract = utils.getFlightContract(web3);//new web3.eth.Contract(abi, contractAddress);
db = require("./database.js")
console.log("OwnerAddress",OwnerAddress);

FlightDataContract    = utils.getFlightDataContract(web3);


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', loginRouter);
app.use("/claimrequest", claimRequestRouter);
app.use("/getloyalitypoints", loyalityPoints);
app.use("/getpassengerlist", passengerlist);
app.use("/admin", admin);
app.use("/getcompensationstatus",getcompensationstatus);
app.use("/getbookinglist",bookinglist);
app.use("/getsimulatedetails",simulateresp);
app.use("/autoclaimdetails",autoclaim);

app.use("/getsimulation",async (req, res) => {
    data = await CompensationContract.methods.getAccountBalance().call({ from: OwnerAddress});
    balance = web3.utils.fromWei(await web3.eth.getBalance(OwnerAddress), "ether") + " ETH";
    result =  web3.utils.fromWei(data, "ether") + " ETH" ;
   res.render('simulation',{"contractaddress": OwnerAddress ,"address" :OwnerAddress,"balance" : result ,"ownerbal":balance});
});

app.get('/balance', async (req, res) => {
    console.log("accounts",req.query.account )
  let account = req.query.account;
  let balance = await web3.eth.getBalance(account);
  let result = web3.utils.fromWei(balance, "ether") + " ETH"
  res.send({'balance': result });
})

app.get("/getcompdetails", async (req, res, next) => {
    var sql = "select * from FlightComp"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
      
       res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/getBookingDetials", async(req, res, next) => {

 FlightDataContract.methods.getBookingDetails("BJ1531","B2JJEW51", true).call({from:OwnerAddress}).then((data) =>{
   console.log(data)
 res.json({ "data" :data[2]});

 })
  
   
});


app.get("/addPermission", async(req, res, next) => {

  reqData = req.body;
  console.log("---",reqData);
  
   
});

app.get("/migrateData", async(req, res, next) => {
    try{
   const path = './data/data.json';
   fs.readFile(path, 'utf-8', function(err, data) {
    if (err) throw err
    arrayOfObjects = JSON.parse(data);
    for(var i =0 ; i < arrayOfObjects.length ; i++){
        
     flightData.methods.addBooking(arrayOfObjects[i].FlightNo,arrayOfObjects[i].PNR,arrayOfObjects[i].address,arrayOfObjects[i].quantity);
       

    }
    res.json({
      "message":"success",
      "data":"All data migarted"
    });
});
} catch(err) {
      console.log(err);
     

      res.json({
        "message":"Error",
        "data":"Error data migartion"
      });
    }

});



app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
