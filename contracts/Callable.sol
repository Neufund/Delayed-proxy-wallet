pragma solidity ^0.4.0;


contract Callable {
    uint data;

    uint public publicData;

    function throwable(){
        throw;
    }

    function okable(){}

    function payment() payable {}

    function singleArgument(uint x) {

    }
}
