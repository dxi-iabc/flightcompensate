pragma solidity >=0.4.25 <0.6.0;

import "./provableAPI.sol";
import "./libs/FlightUtil.sol";

contract FlightComponsationLogic is usingProvable {
     using FlightUtil for *;
    enum DistanceType {Long, Medium, Short}
    address payable contractOwner;
    bool private operational = true;
    mapping(bytes32 => CompRequestDetails) public pendingQueries;
    struct CompRequestDetails{
      string pnr;
      address payable passaddress;
      uint16 quantity ;
      
    } 
  
    FlightData dataContract;
    event LogCompensationPaid(address passengerAddress, uint256 amount, string pnr);
    event LogDeposit(address snder , uint value);
    event LogNewProvableQuery(string description);
    event LogPriceUpdated(string price);

    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function isOperational() public view returns (bool) {
        return operational;
    }

    modifier isActive() {
        require(operational == true, "Requires contract is operational");
        _;
    }

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireNotContractOwner() {
        require(msg.sender != contractOwner, "Caller is the contract owner");
        _;
    }
       
   
    constructor(address _dataContract) public {
         
         contractOwner = msg.sender;
         dataContract = FlightData(_dataContract);
    }

   
    function getOwnerAddress() public view isActive returns(address payable){

        return contractOwner;
    }

    function updateContractAddess(address _dataContract) public isActive requireContractOwner {
         
          dataContract = FlightData(_dataContract);

    }


    function getContractAddress() public view isActive returns (address) {
        return address(dataContract);
    }

    function deposit()
        public
        payable
        isActive
        requireContractOwner
        returns (bool success)
    { 
        require(address(msg.sender).balance > msg.value ,"Not enough balance");
        emit LogDeposit(msg.sender, msg.value);
        return true;
    }

    function _transfer(address payable _to, uint256 _value)
        internal returns (bool success)
    {
         require(_to != address(0));

        require(address(this).balance > _value ,"Not enough balance");

        (bool sent, ) = _to.call.value(_value)("");
        return sent;
    }

    function() external payable isActive requireContractOwner {
        emit LogDeposit(msg.sender, msg.value);
    }

    function getAccountBalance()
        public
        view
        requireContractOwner isActive 
        returns (uint256 balance)
    {
        return address(this).balance;
    }

  function getCompensationStatus(string memory _pnr) public isActive view returns(bool){
       require(
            bytes(_pnr).length > 0,
            "Give valid PNR"
        );
        return dataContract.getCompensationStatus(_pnr );
    }

    function payPassengerCompensation(
        string memory _flightNo,
        address payable _passenegerAddress,
        string memory _pnrNo
        
    ) public isActive {
        require(
            bytes(_flightNo).length > 0,
            "Input valid flight number"
        );
         require(
            bytes(_pnrNo).length > 0,
            "Give valid PNR"
        );
        require(
            _passenegerAddress != contractOwner,
            "Passenger address is same as contract owner"
        );
        bool isPaid = getCompensationStatus(_pnrNo);
         require(
            isPaid == false,
            "Already paid"
        );
        bool validPassenger = dataContract.checkBookingStatus(
            _flightNo,
            _pnrNo
        );
        require(
            validPassenger == true,
            "Not a valid passenger details.Please check the PNR and passenger address"
        );

        
        _getFlightStatus(_pnrNo,_flightNo);

    }

    function _checkHoursLimit(uint256 _hours, uint8[3] memory _limitArray)
        internal
        pure
        returns (DistanceType)
    {
        if (_hours > _limitArray[2]) {
            return DistanceType.Long;
        }

        if (_hours >= _limitArray[1]) {
            return DistanceType.Medium;
        }

        return DistanceType.Short;

    }

    function _checkDistanceLimit(
        uint256 _distanceKM,
        uint16[3] memory _limitArray
    ) internal pure returns (DistanceType) {
        if (_distanceKM > _limitArray[2]) {
            return DistanceType.Long;
        }

        if (_distanceKM >= _limitArray[1]) {
            return DistanceType.Medium;
        }

        return DistanceType.Short;

    }

    function _applyEURule(uint256 _distance, uint256 _delayHours)
        internal
        pure
        returns (uint256 amount, string memory delayType)
    {
        uint8[3] memory _hoursLimit = [2, 3, 4];
        uint16[3] memory _distanceLimit = [1499, 1500, 3500];
        DistanceType disType;
      

        if (_distance > 0) {
            disType = _checkDistanceLimit(_distance, _distanceLimit);

        } else {
            disType = _checkHoursLimit(_delayHours, _hoursLimit);

        }

        if (disType == DistanceType.Long) {
            amount = 700;
            delayType = "Long-haul" ;
        }

        if (disType == DistanceType.Medium) {
            amount = 420;
            delayType = "Medium-haul" ;
        }

        if (disType == DistanceType.Short) {
            amount = 280;
            delayType = "Short-haul" ;
        }

    }

     function convertEuroToEth(uint _amount, uint _rate) internal pure returns(uint){
        
        uint value  = _amount /_rate ;
        uint bal = (_amount - (value *_rate));
       if(bal != 0) {
            
           bal = bal * 100000000;
           value = value * 1000000000000000000;
           value  = value  + bal;
        }else {
            value = value * 1000000000000000000;
        }
         return value;
        
    }

    function _appyCancellationDurationRule(uint _hour) internal pure returns(uint){

         if(_hour  > 6 ) 

         return 420 ;

         else if(_hour >= 3)

         return 280;
          
         else
          
          return 140;
        

    }

    function __callback(bytes32 myid, string memory result) public {

        if (msg.sender != provable_cbAddress()) revert();
        string[] memory values = result.split("|");
        CompRequestDetails memory reqDetails = pendingQueries[myid];
        uint256 amount;
        if (values[0].compareEqual("Cancelled") == true) {

           
            uint additionalAmout =_appyCancellationDurationRule(parseInt(values[2]));
            amount      =  parseInt(values[1]) ;
            amount      =  amount  + additionalAmout;
            amount      =  amount  * reqDetails.quantity;
            uint rate   =  parseInt(values[5]);
            amount      =  convertEuroToEth(amount,rate);
            _transfer(reqDetails.passaddress, amount);
            dataContract.updateCompensationStatus(reqDetails.pnr ,true , reqDetails.passaddress , amount ,"Cancelled",parseInt(values[1]),parseInt(values[2]), rate,reqDetails.quantity);
            
        }else if (values[0].compareEqual("Delayed") == true) {

            (uint currncyamount, string memory delayType) = _applyEURule(
                parseInt(values[1]),
                parseInt(values[2])
            );
            amount = currncyamount * reqDetails.quantity ;
           // amount =  (amount.div(parseInt(values[5])) * 1000000000000000000);
            uint rate = parseInt(values[5]);
            amount =  convertEuroToEth(amount,rate);
           _transfer(reqDetails.passaddress, amount);
            dataContract.updateCompensationStatus(reqDetails.pnr ,true , reqDetails.passaddress , amount, delayType,currncyamount,parseInt(values[2]),rate, reqDetails.quantity);
            emit LogCompensationPaid(reqDetails.passaddress , amount , reqDetails.pnr);
        }

        
      
        delete pendingQueries[myid]; // This effectively marks the query id as processed.
               
    }

    function _getFlightStatus(
        string memory _ticketNo,
        string memory _flightNo
    ) internal isActive {
        if (provable_getPrice("URL") > address(this).balance) {
            emit LogNewProvableQuery(
                "Provable query was NOT sent, please add some ETH to cover for the query fee"
            );

            
        } else {
            //
            string memory flightstatus = FlightUtil.append(
                "json(https://demo-flight-status.herokuapp.com/flightstatus/",
                _ticketNo,"/",_flightNo,
                ").result.status"
            );

           bytes32 queryId = provable_query("URL", flightstatus,900000);
           (uint16 qty,address payable passaddres,string memory name) = dataContract.getBookingDetails(_flightNo,_ticketNo, false);
            pendingQueries[queryId]  = CompRequestDetails(_ticketNo,passaddres,qty);
           emit LogNewProvableQuery("Provable flightststus query was sent, standing by for the answer..");
           
        }
        
    }

   function getPassengerLoyalityPoints(address _passengerAddress)
        external isActive 
        view 
        returns (uint256)
    {
        return dataContract.getPassengerLoyalityPoints(_passengerAddress);
    }


   
    function destroyContract() public isActive requireContractOwner {
        selfdestruct(contractOwner);
        contractOwner.transfer(address(this).balance);
    }

    function flightRuleSimulation( string memory _status, uint _distance , uint _delayHours, 
                                   uint rate,uint currencyAmount) public pure returns(string memory compType,uint amount){
         
          
          if (_status.compareEqual("Cancelled") == true) {
                  
            uint additionalAmout =_appyCancellationDurationRule(_delayHours);
            amount      =  currencyAmount + additionalAmout;
            amount      =  convertEuroToEth(amount,rate);
            compType        =  "Cancelled";

          } else {

               (amount, compType) = _applyEURule(
                       _distance,
                       _delayHours
                );
            
           
            amount =  convertEuroToEth(amount,rate);
           
          }

    }

}

/********************************************************************************************/
/*                                  FlightData contract                               */
/********************************************************************************************/

contract FlightData {
    function isOperational() public returns (bool);
    function setOperatingStatus(bool mode) external;
    function addBooking(
    string calldata _flightNo,
    string calldata _pnr,
    address payable _passengerAddress,
    string calldata  _name,
    uint256 _tQuantity
    
  )  external ;
  function editBooking(  string calldata _flightNo,string calldata _pnr,  uint256 _newTQuantity) external;
  function removeBooking(string calldata _flightNo,string calldata _pnr) external returns(bool) ;
  function checkBookingStatus(string calldata _flightNo,string calldata _pnr) external view returns(bool);
  function incrementLoyalityPoints(address _passengerAddress, uint _newpoints) public ;
  function decrementLoyalityPoints(address _passengerAddress, uint _newpoints) external ;
  function deleteLoyalityPointAddress(address _passengerAddress) external;
  function getPassengerLoyalityPoints(address _passengerAddress)  external view returns (uint256);
  function getCompensationStatus(string calldata _pnr) external view returns(bool);
  function updateCompensationStatus(string calldata _pnr, bool status,address passaddres, uint amount,string calldata delayType, uint currencyAmount, uint hoursDuration, uint rate, uint qty ) external  returns(bool);
  function setContarctAddress(address _baseContractAddress) external ;
  function getCompensationStatusDetails(string calldata _pnr) external view returns(address , uint  , bool , string memory,uint,uint ,uint)  ;
  function getBookingDetails(string calldata _flightNo,string calldata _pnr, bool viewOnly) external view returns(uint16, address payable , string memory);
  function destroyContract() public;
   function getCompensationQtyAndRate(string calldata _pnr) external  view returns(uint,uint);
}
/********************************************************************************************/
/*                                  FlightData contract                               */
/********************************************************************************************/


