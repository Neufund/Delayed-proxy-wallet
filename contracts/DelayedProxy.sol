pragma solidity ^0.4.8;


contract DelayedProxy {
    event logExecute (
    address indexed _from,
    address indexed _to,
    uint _value,
    bytes data
    );

    function execute(address to, bytes data) payable external returns (bool) {
        if (!to.call.value(msg.value)(data)) {
            throw;
        }
        logExecute(msg.sender, to, msg.value, data);
        return true;
    }
}
