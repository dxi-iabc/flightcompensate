const truffleAssert = require('truffle-assertions');
const Test = require('../config/testConfig.js');
contract('FlightData Tests', (accounts) => {
  const GAS_LIMIT = 9e6
  let instance;
  let flComp;
  let account = accounts[1];
  let config;
  before(async () => {
    config = await Test.Config(accounts);
    instance =  config.flightData;
    flComp  =   config.flightComponsationApp ;
    instance.setContarctAddress(config.contarctAddress) ;
  });
   

  describe("Check Add Booking" ,async ()=> {

  it('Should successfully add flight booking data', async () => {
   
    instance.addBooking("123","PNR1234",accounts[1],2).then( () =>{
         
        return instance.checkBookingStatus("123","PNR1234");
      }).then((result)=> {
         assert( result == true ,"Failed to add booking");
        
      })
  });

  it('Requires caller is contract owner can add booking', async () => {

        try{

        await truffleAssert.reverts(instance.addBooking("123","PNR1234",accounts[1],2,{from:accounts[1]}), "Requires caller is contract owner");
        
      }catch(e){

          console.log(e)

        }
        
     
  });
});

describe("Check Edit  Booking" ,async ()=> {
  it('Should successfully edit  flight booking data', async () => {

     instance.addBooking("123","PNR1234",accounts[1],2).then( async () =>{
        
            await  instance.editBooking("123","PNR1234",1);
      })
  });

  it('Requires caller is contract owner can  edit  flight booking data', async () => {
   
        instance.addBooking("123","PNR1234",accounts[1],2).then( async () =>{
        try {
        await truffleAssert.reverts(  instance.editBooking("123","PNR1234",1,{from:accounts[1]}),"Requires caller is contract owner");
        }catch(e){
         
           console.log(e);
        }
      })
  });
});

describe("Check Remeove  Booking" , async ()=> {
  it('Should successfully remove flight booking data', async () => {
     instance.addBooking("123","PNR1234",accounts[1],2).then( () =>{
         
        return instance.removeBooking("123","PNR1234");
      }).then( () =>{
         
        return instance.checkBookingStatus("123","PNR1234");
      }).then((result)=> {
         assert( result == false ,"Failed to remove booking");
        
      })
  });


  it('Requires caller is contract owner remove flight booking data', async () => {
    instance.addBooking("123","PNR1234",accounts[1],2).then( async () =>{
         
        await truffleAssert.reverts( instance.removeBooking("123","PNR1234",{from:accounts[1]}));
      })
  });
});

describe("Loyality  Points" , async ()=> {
  it('Should successfully add loyality points', async () => {
        await instance.incrementLoyalityPoints(accounts[6],100);
        points  = await instance.getPassengerLoyalityPoints(accounts[6]);
        assert(points.toNumber() == 100 ,"Error in adding loyality points!")
          
  });

  
  it('Requires caller is contract owner can add loyality points', async () => {
   
        await truffleAssert.reverts( instance.incrementLoyalityPoints(accounts[5],100,{from:accounts[2]}),"Requires caller is contract owner");
      
        let points  = await instance.getPassengerLoyalityPoints(accounts[5]);
        
        assert(points.toNumber() == 0 ,"Error in decreasing loyality points!")
    
  });

  it('Should successfully decerement  loyality points', async () => {
    

        await instance.incrementLoyalityPoints(accounts[4],100);
        await instance.decrementLoyalityPoints(accounts[4],50);
        let points  = await instance.getPassengerLoyalityPoints(accounts[4]);
        assert(points.toNumber() == 50 ,"Error in decreasing loyality points!")
     
  });

  it('Requires caller is contract owner can decerement  loyality points', async () => {
    
        await instance.incrementLoyalityPoints(accounts[3],100);
        try{
                await truffleAssert.reverts( instance.decrementLoyalityPoints(accounts[3],50,{from:accounts[1]}),"Requires caller is contract owner");
      }catch(e){

      }
        let points  = await instance.getPassengerLoyalityPoints(accounts[3]);
        assert(points.toNumber() == 100 ,"Error in decreasing loyality points!")
       
  
  });


  it('Should successfully delete loyality points', async () => {
        await instance.incrementLoyalityPoints(accounts[2],100);
        await instance.deleteLoyalityPointByAddress(accounts[2]);
        let points  = await instance.getPassengerLoyalityPoints(accounts[2]);
        assert(points.toNumber() == 0 ,"Error in removing loyality points!")
       
  });

  it('Requires caller is contract owner can delete loyality points', async () => {
   
        await instance.incrementLoyalityPoints(accounts[8],100);
        try{
        await truffleAssert.reverts( instance.deleteLoyalityPointByAddress(accounts[8],{from:accounts[1]}),"Requires caller is contract owner");
        }catch(e){

        }
        let points  = await instance.getPassengerLoyalityPoints(accounts[8]);
        assert(points.toNumber() == 100 ,"Error in removing loyality points!")
       
      
  });
});
describe("Compensation Status" , async ()=> {

  it('Should successfully update compensation satus', async () => {
       
       let status  = await instance.getCompensationStatus("PNR12341");
        

       await instance.updateCompensationStatus("PNR12341",!status,accounts[1],100);
        
        let newstatus  = await instance.getCompensationStatus("PNR12341");
        assert(status != newstatus ,"Error in updating status!")
       
      
  });

  it('Requires caller is contract owner can update compensation satus', async () => {
  

        try{
        await truffleAssert.reverts(  instance.updateCompensationStatus("PNR123412",true,accounts[1],100,{from:accounts[1]}),"Requires caller is contract owner");
        }catch(e){
          console.log(e)
        }
        let status  = await instance.getCompensationStatus("PNR123412");
       
        assert(status == false ,"Error in updating status!")
       
     
  });
});


})
