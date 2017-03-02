pragma solidity ^0.4.0;


contract RejectPayment {
    function rejectPayment() payable {
        throw;
    }
}
