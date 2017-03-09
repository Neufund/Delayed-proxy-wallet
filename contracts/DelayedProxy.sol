pragma solidity ^0.4.8;


contract DelayedProxy {
    struct Transaction {
    address to;
    uint value;
    bytes data;
    }

// Funds has arrived into the wallet (record how much).
    event Deposit(address indexed _from, uint indexed value);
// Single transaction going out of the wallet (record who signed for it, how much, and to whom it's going).
    event Transact(address indexed owner, uint txId, uint indexed value, address indexed to, bytes data);
// Confirmation still needed for a transaction.
    event ConfirmationNeeded(uint txId, address indexed initiator, address indexed to, uint indexed value, bytes data);


    function() payable {
        if (msg.value > 0) {
            Deposit(msg.sender, msg.value);
        }
    }

    function execute(address _to, uint _value, bytes _data) returns (uint txId) {
        txId = transactionCount++;
        transactions[txId] = Transaction(_to, _value, _data);
        ConfirmationNeeded(txId, msg.sender, _to, _value, _data);
    }

    modifier txExists(uint txId){
        if (transactions[txId].to == 0) {
            throw;
        }
        _;
    }

    function confirm(uint txId) txExists(txId) returns (bool) {
        if (!transactions[txId].to.call.value(transactions[txId].value)(transactions[txId].data)) {
            throw;
        }
        Transact(msg.sender, txId, transactions[txId].value, transactions[txId].to, transactions[txId].data);
        delete transactions[txId];
        return true;
    }

// pending transactions we have at present.
    uint public transactionCount;

    mapping (uint => Transaction) public transactions;
}
