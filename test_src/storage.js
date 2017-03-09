import "babel-polyfill";
import DelayedProxy from "./proxy";
let DelayedProxyContract = artifacts.require("./DelayedProxy");
var Storage = artifacts.require("./Storage.sol");
var assert = require("assert");
let delayedProxy;

contract('Storage', function (accounts) {
    beforeEach(function (done) {
        web3.eth.defaultAccount = accounts[0];
        DelayedProxyContract.deployed().then(function (_delayedProxy) {
            delayedProxy = _delayedProxy;
            web3.eth.sendTransaction({
                to: delayedProxy.address,
                value: web3.toWei('2', 'ether')
            }, done);
        })
    });
    describe("#set & get", function () {
        it("", async function () {
            let storage = await Storage.deployed();
            let delayedStorage = await DelayedProxy(storage);
            // set values
            await storage.setStorage("user");
            await ((await delayedStorage.setStorage("proxy"))());
            // get storage by address
            assert.equal(await storage.getStorage(web3.eth.defaultAccount), "user");
            assert.equal(await storage.getStorage(delayedProxy.address), "proxy");
            assert.equal(await storage.getMyStorage(), "user");
            assert.equal(await delayedStorage.getMyStorage(), "proxy");
        });
    });
});
