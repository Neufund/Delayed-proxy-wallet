var DelayedProxy = artifacts.require("./DelayedProxy.sol");
var Callable = artifacts.require("./Callable.sol");

module.exports = function (deployer) {
    deployer.deploy(DelayedProxy);
    deployer.deploy(Callable);
};
