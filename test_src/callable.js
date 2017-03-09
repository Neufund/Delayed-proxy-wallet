import "babel-polyfill";
import DelayedProxy from "./proxy";
let DelayedProxyContract = artifacts.require("./DelayedProxy");
var Callable = artifacts.require("./Callable.sol");
var assert = require("assert");

contract('Callable', function (accounts) {
    beforeEach(function (done) {
        web3.eth.defaultAccount = accounts[0];
        DelayedProxyContract.deployed().then(function (delayedProxy) {
            web3.eth.sendTransaction({
                to: delayedProxy.address,
                value: web3.toWei('2', 'ether')
            }, done);
        })
    });
    describe("#sendValue", function () {
        it("succeeds for a contract", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let confirmer = await delayedCallable.send({
                value: web3.toWei('1', 'ether')
            });
            let tx = await confirmer();
        });
    });
    describe("#callFunction", function () {
        it("succeeds without value", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let confirmer = await delayedCallable.okable();
            let tx = await confirmer();
            assert.equal(tx.logs[0].event, "Transact");
            assert.equal(tx.logs[0].args.value, 0);
            assert.equal(tx.logs[0].args.to, callable.address);
            assert.equal(tx.logs[0].args.owner, web3.eth.defaultAccount);
        });
        it("succeeds with value", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let confirmer = await delayedCallable.payment({
                value: web3.toWei('1', 'ether')
            });
            let tx = await confirmer();
            assert.equal(tx.logs[0].event, "Transact");
            assert.equal(tx.logs[0].args.value, web3.toWei('1', 'ether'));
            assert.equal(tx.logs[0].args.to, callable.address);
            assert.equal(tx.logs[0].args.owner, web3.eth.defaultAccount);
        });
        it("succeeds with arguments", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let confirmer = await delayedCallable.singleArgument(42);
            let tx = await confirmer();
            assert.equal(tx.logs[0].event, "Transact");
            assert.equal(tx.logs[0].args.value, 0);
            assert.equal(tx.logs[0].args.to, callable.address);
            assert.equal(tx.logs[0].args.owner, web3.eth.defaultAccount);
        });
    });
});
