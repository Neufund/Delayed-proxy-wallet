pragma solidity ^0.4.0;


contract Storage {

    event logGetMyStorage(string _s);

    function setStorage(string _s) {
        data[msg.sender] = _s;
    }

    function getStorage(address user) constant returns (string s){
        return data[user];
    }

    function getMyStorage() constant returns (string s){
        logGetMyStorage(data[msg.sender]);
        return data[msg.sender];
    }

    mapping (address => string) public data;
}
