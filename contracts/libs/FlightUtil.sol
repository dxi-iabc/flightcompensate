pragma solidity 0.5.0;


library  FlightUtil{ 
 
 
 function _indexOf(string memory _base, string memory _value, uint _offset)
        internal
        pure
        returns (int) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length == 1);

        for (uint i = _offset; i < _baseBytes.length; i++) {
            if (_baseBytes[i] == _valueBytes[0]) {
                return int(i);
            }
        }

        return -1;
    }
    
    function split(string memory _base, string memory _value)
        internal
        pure
        returns (string[] memory splitArr) {
        bytes memory _baseBytes = bytes(_base);

        uint _offset = 0;
        uint _splitsCount = 1;
        while (_offset < _baseBytes.length - 1) {
            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == -1)
                break;
            else {
                _splitsCount++;
                _offset = uint(_limit) + 1;
            }
        }

        splitArr = new string[](_splitsCount);

        _offset = 0;
        _splitsCount = 0;
        while (_offset < _baseBytes.length - 1) {

            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == - 1) {
                _limit = int(_baseBytes.length);
            }

            string memory _tmp = new string(uint(_limit) - _offset);
            bytes memory _tmpBytes = bytes(_tmp);

            uint j = 0;
            for (uint i = _offset; i < uint(_limit); i++) {
                _tmpBytes[j++] = _baseBytes[i];
            }
            _offset = uint(_limit) + 1;
            splitArr[_splitsCount++] = string(_tmpBytes);
        }
        return splitArr;
    }
    
    
      function compareEqual(string memory a, string memory b) public pure 
       returns (bool) {

        if(bytes(a).length != bytes(b).length) return false;
    
         return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );

       }

    
    /*function convertStringToUint(string memory _value) public  pure  returns (uint _ret) {
        bytes memory _bytesValue = bytes(_value);
        uint j = 1;
        for(uint i = _bytesValue.length-1; i >= 0 && i < _bytesValue.length; i--) {
            assert(uint8(_bytesValue[i]) >= 48 && uint8(_bytesValue[i]) <= 57);
            _ret += (uint8(_bytesValue[i]) - 48)*j;
            j*=10;
        }
    }*/
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0); // Solidity only automatically asserts when dividing by 0
        uint256 c = a / b;
        return c;
      }
      
    function append(string memory a, string memory b, string memory c ) internal pure returns (string memory) {
   
        return string(abi.encodePacked(a, b , c));

    }


    function append(string memory a, string memory b, string memory c,string memory d, string memory e ) internal pure returns (string memory) {
   
        return string(abi.encodePacked(a, b , c , d , e));

    }


    function appendBySeparator(string memory a, string memory b, string memory c ) internal pure returns (string memory) {
   
        return string(abi.encodePacked(a, "|" , b , "|", c));

    }
    
    
    function append(string memory a, string memory b ) internal pure returns (string memory) {
   
        return string(abi.encodePacked(a, b ));

    }


}