pragma solidity ^0.4.8;


contract DelayedProxy {
    struct Transaction {
    address to;
    uint value;
    bytes data;
    }

// Funds has arrived into the wallet (record how much).
    event Deposit(address _from, uint value);
// Single transaction going out of the wallet (record who signed for it, how much, and to whom it's going).
    event Transact(address owner, bytes32 hash, uint value, address to, bytes data);
// Confirmation still needed for a transaction.
    event ConfirmationNeeded(bytes32 operation, address initiator, address to, uint value, bytes data);


    function() payable {
        if (msg.value > 0) {
            Deposit(msg.sender, msg.value);
        }
    }

    function execute(address _to, uint _value, bytes _data) external returns (bytes32 _r) {
        _r = sha3(msg.data, block.number);
        ConfirmationNeeded(_r, msg.sender, _to, _value, _data);
    }

    function confirm(bytes32 _h) returns (bool) {
        if (!txs[_h].to.call.value(txs[_h].value)(txs[_h].data)) {
            throw;
        }
        Transact(msg.sender, _h, txs[_h].value, txs[_h].to, txs[_h].data);
        delete txs[_h];
        return true;
    }

// pending transactions we have at present.
    mapping (bytes32 => Transaction) txs;
}
