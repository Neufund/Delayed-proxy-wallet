var DelayedProxy = artifacts.require("./DelayedProxy.sol");
var Callable = artifacts.require("./Callable.sol");
var Storage = artifacts.require("./Storage.sol");

module.exports = function (deployer) {
    deployer.deploy(DelayedProxy);
    deployer.deploy(Callable);
    deployer.deploy(Storage);
};
