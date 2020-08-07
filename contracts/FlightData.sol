pragma solidity >=0.4.25 <0.6.0;

contract FlightData{

    address payable contractOwner;
    bool private operational = true;
    struct Booking {
    address payable passengerAddress;
    uint16 tQuantity;
    string name;
    bool exits;
    }
    
    struct CompStatus{
    address passaddress;
    uint256 amount ;
    string  delayType;
    uint    currencyAmt; 
    uint    hoursDuration;
    uint    time;
    uint    etherRate;
    uint    qty ;
    bool    status ;
    }
   mapping(string => mapping(string => Booking)) private ticketsByFlightNo;
   mapping(address => uint256) private passengerLoyalityPoints;
   mapping(string => CompStatus)  private compensationStatus;
   address private baseContractAddress;
    
   constructor() public {
        contractOwner = msg.sender;
       
    }
    
    function isOperational() public view requireContractOwner returns (bool) {
        
        return operational;
    }

   
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }
    
    modifier isActive() {
        require(operational == true, "Requires contract is operational");
        _;
    }
  

    modifier requireIsOperational() {
        require(isOperational(), "Requires contract is operational");
        _;
    }
    
    
    modifier requireContractOwner() {
        require(
            msg.sender == contractOwner || msg.sender == baseContractAddress, "Requires caller is contract owner");
        _;
    }
    
  function addBooking(
    string calldata _flightNo,
    string calldata _pnr,
    address payable _passengerAddress,
    string calldata _name,
    uint16 _tQuantity
    
  )  external isActive requireContractOwner {
  
    require(_tQuantity > 0, "Quantity must be positive");
    require(bytes(_flightNo).length > 0,  "Given invalid Flight No" );
    require(bytes(_pnr).length > 0,  "Given invalid PNR" );
    require(compensationStatus[_pnr].status == false,"Not a valid data");
    ticketsByFlightNo[_flightNo][_pnr] = Booking(_passengerAddress,_tQuantity , _name,true);
    
  }

  
  function editBooking(  string calldata _flightNo,string calldata _pnr,  uint16 _newTQuantity) external isActive requireContractOwner  {
    require(_newTQuantity > 0, "Quantity must be positive");
    require(bytes(_flightNo).length > 0,  "Given invalid Flight No" );
    require(bytes(_pnr).length > 0,  "Given invalid PNR" );
    require( ticketsByFlightNo[_flightNo][_pnr].exits, "No tickets prsent");
    require(compensationStatus[_pnr].status == false,"Not valid data");
    ticketsByFlightNo[_flightNo][_pnr].tQuantity=_newTQuantity;
  
  }

 
  function removeBooking(string calldata _flightNo,string calldata _pnr) external isActive requireContractOwner returns(bool) {
        require(bytes(_pnr).length > 0,  "Given invalid PNR" );
        require( ticketsByFlightNo[_flightNo][_pnr].exits, "No tickets prsent");
        require(compensationStatus[_pnr].status == false,"Not a valid data");
        delete ticketsByFlightNo[_flightNo][_pnr];
        return true;
    
    
    }    

     function getBookingDetails(string calldata _flightNo,string calldata _pnr, bool viewOnly) external isActive view returns(uint16, address payable, string memory) {
        require(bytes(_pnr).length > 0,  "Given invalid PNR" );
        require( ticketsByFlightNo[_flightNo][_pnr].exits, "No tickets prsent");
        if(!viewOnly)
        require(compensationStatus[_pnr].status == false,"Not a valid data");
         
        return (ticketsByFlightNo[_flightNo][_pnr].tQuantity,ticketsByFlightNo[_flightNo][_pnr].passengerAddress , ticketsByFlightNo[_flightNo][_pnr].name);
    
    
    }    
        
        
    
    function checkBookingStatus(string calldata _flightNo,string calldata _pnr) external view returns(bool){
        require(bytes(_pnr).length > 0,  "Give valid PNR" );
        require(bytes(_flightNo).length > 0,  "Give valid Flight No" );
        return ticketsByFlightNo[_flightNo][_pnr].exits;
        
    }


  
    function incrementLoyalityPoints(address _passengerAddress, uint _newpoints) public requireContractOwner {

    uint points =  passengerLoyalityPoints[_passengerAddress] + _newpoints ;
    
     passengerLoyalityPoints[_passengerAddress] = points;  
      
    }
    
    function decrementLoyalityPoints(address _passengerAddress, uint _newpoints) external isActive requireContractOwner {
      
     uint points =  passengerLoyalityPoints[_passengerAddress] ; 
    
     passengerLoyalityPoints[_passengerAddress] = points - _newpoints;  
      
    }
    
    
    function deleteLoyalityPointByAddress(address _passengerAddress) external isActive requireContractOwner {
      
      if(passengerLoyalityPoints[_passengerAddress] > 0) {
       
        delete passengerLoyalityPoints[_passengerAddress];  
       
      }
      
    }
    
   function getPassengerLoyalityPoints(address _passengerAddress) external isActive view returns(uint){
       
       return passengerLoyalityPoints[_passengerAddress];
   }
   
   function getCompensationStatus(string calldata _pnr) external view isActive returns(bool) {
       require(bytes(_pnr).length > 0,  "Give valid PNR" );
       return compensationStatus[_pnr].status;
    }

    function getCompensationStatusDetails(string calldata _pnr) external isActive view returns(address , uint  , bool , string memory,uint,uint,uint ) {
       require(bytes(_pnr).length > 0,  "Give valid PNR" );
    
       return (compensationStatus[_pnr].passaddress,compensationStatus[_pnr].amount,compensationStatus[_pnr].status ,compensationStatus[_pnr].delayType, compensationStatus[_pnr].currencyAmt,compensationStatus[_pnr].hoursDuration,compensationStatus[_pnr].time ) ;
    }

    function getCompensationQtyAndRate(string calldata _pnr) external isActive view returns(uint,uint){
         return (compensationStatus[_pnr].etherRate,compensationStatus[_pnr].qty);
    }
    
    function updateCompensationStatus(string calldata _pnr, bool status, address passaddres, uint amount, string calldata delayType, uint currencyAmount, uint hoursDuration, uint rate, uint qty) external isActive requireContractOwner returns(bool) {
        require(bytes(_pnr).length > 0,  "Give valid PNR" );
        compensationStatus[_pnr] = CompStatus(passaddres,amount, delayType,currencyAmount, hoursDuration,now , rate, qty, status);
        if(status == true )   incrementLoyalityPoints(passaddres, 100);
        return true;
    }
  
   

    function setContarctAddress( address _baseContractAddress) external  requireContractOwner {
 
        baseContractAddress =_baseContractAddress;
    }
    
   function () external isActive requireContractOwner payable {
 
   }

      

   function destroyContract() public isActive requireContractOwner {
        selfdestruct(contractOwner);
        contractOwner.transfer(address(this).balance);
    }
    
}