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
    event Transact(address owner, uint txId, uint value, address to, bytes data);
// Confirmation still needed for a transaction.
    event ConfirmationNeeded(uint txId, address initiator, address to, uint value, bytes data);


    function() payable {
        if (msg.value > 0) {
            Deposit(msg.sender, msg.value);
        }
    }

    function execute(address _to, uint _value, bytes _data) external returns (uint txId) {
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

    function confirm(uint txId) external txExists(txId) returns (bool) {
        if (!transactions[txId].to.call.value(transactions[txId].value)(transactions[txId].data)) {
            throw;
        }
        Transact(msg.sender, txId, transactions[txId].value, transactions[txId].to, transactions[txId].data);
        delete transactions[txId];
        return true;
    }

// pending transactions we have at present.
    uint transactionCount;

    mapping (uint => Transaction) public transactions;
}
