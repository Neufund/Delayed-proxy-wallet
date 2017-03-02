var DelayedProxy = artifacts.require("./DelayedProxy.sol");
var RejectPayment = artifacts.require("./RejectPayment.sol");
var AcceptPayment = artifacts.require("./AcceptPayment.sol");
var Callable = artifacts.require("./Callable.sol");

module.exports = function (deployer) {
    deployer.deploy(DelayedProxy);
    deployer.deploy(RejectPayment);
    deployer.deploy(AcceptPayment);
    deployer.deploy(Callable);
};
