pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 waveCount;

    constructor() {
        console.log("This is a contract and it's damn smart");
    }

    function wave() public {
        waveCount += 1;
        console.log("%s just waved!!", msg.sender);
    }

    function getWaveCount() public view returns (uint256) {
        console.log("%d people have waved till now.", waveCount);
        return waveCount;
    }

}