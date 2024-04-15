// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameFunding {
    function fundAccount(address payable playerAddress) public payable {
        require(msg.value > 0, "Must send some ether");
        playerAddress.transfer(msg.value);
    }
}