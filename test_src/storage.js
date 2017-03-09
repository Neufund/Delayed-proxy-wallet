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
            // watch logs
            let getMyStorageEvent = storage.logGetMyStorage(()=> {
            });
            // get storage by address
            assert.equal(await storage.getStorage(web3.eth.defaultAccount), "user");
            assert.equal(await storage.getStorage(delayedProxy.address), "proxy");
            // get storage of caller
            let tx = await ((await delayedStorage.getMyStorage())());
            // get emited logs
            let logs = getMyStorageEvent.get();
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'logGetMyStorage');
            assert.equal(logs[0].args._s, "proxy");
            // stop watching
            getMyStorageEvent.stopWatching();
        });
    });
});
