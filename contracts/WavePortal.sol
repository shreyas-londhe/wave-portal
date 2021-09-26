pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    mapping (address => uint256) waveLog;
    uint256 totalWaveCount;

    constructor() {
        console.log("This is a contract and it's damn smart");
    }

    function wave() public {
        waveLog[msg.sender] += 1;
        totalWaveCount += 1;
        console.log("%s just waved!!", msg.sender);
    }

    function getWaveCountOf(address _caller) public view returns (uint256) {
        console.log("%s has waved %d times.", _caller, waveLog[_caller]);
        return waveLog[_caller];
    }

    function getTotalWaveCount() public view returns (uint256) {
        console.log("%d people have waved till now.", totalWaveCount);
        return totalWaveCount;
    }

}