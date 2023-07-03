pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Mixer is Ownable, Pausable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    mapping(bytes32 => uint256) internal hashStore;

    constructor (
    )
    public {
    }

    function depositMixer (
        bytes32 _hashedPw
    ) public payable returns(bytes32){

        hashStore[makeHashFromByte(_hashedPw)] = uint256(msg.value);
    }
    function makeHashFromByte (bytes32 _hash) public view returns(bytes32){
        bytes32 tempHash = keccak256(abi.encodePacked(_hash));
        return tempHash;
    }
    function makeHashFromString (string memory _hash) public view returns(bytes32){
        bytes32 tempHash = keccak256(abi.encodePacked(_hash));
        return tempHash;
    }
    function withdrawMixer(
        string memory _pw
    ) public {
        uint256 tempValue = hashStore[makeHashFromByte(makeHashFromString(_pw))];
        if(tempValue > 0){
            payable(msg.sender).transfer(tempValue);
        }
    }
    
}