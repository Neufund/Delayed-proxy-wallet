import "babel-polyfill";
import DelayedProxy from "./proxy";
var RejectPayment = artifacts.require("./RejectPayment.sol");
var AcceptPayment = artifacts.require("./AcceptPayment.sol");
var Callable = artifacts.require("./Callable.sol");
var assert = require("assert");

contract('DelayedProxy', function (accounts) {
    describe("#sendValue", function () {
        it("throws on failure", async function () {
            let rejectPayment = await RejectPayment.deployed();
            let delayedRejectPayment = await DelayedProxy(rejectPayment);
            try {
                let tx = await delayedRejectPayment.send({
                    from: accounts[0],
                    value: web3.toWei('1', 'ether')
                });
            } catch (e) {
                assert(e.message.startsWith("VM Exception while processing transaction"));
            }
        });
        it("succeeds for a contract", async function () {
            let acceptPayment = await AcceptPayment.deployed();
            let delayedAcceptPayment = await DelayedProxy(acceptPayment);
            let tx = await delayedAcceptPayment.send({
                from: accounts[0],
                value: web3.toWei('1', 'ether')
            });
            assert.equal(tx.logs[0].event, "logExecute");
        });
    });
    describe("#callFunction", function () {
        it("throws on failure", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            try {
                await delayedCallable.throwable({from: accounts[0]});
            } catch (e) {
                assert(e.message.startsWith("VM Exception while processing transaction"));
            }
        });
        it("succeeds without value", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let tx = await delayedCallable.okable({from: accounts[0]});
            assert.equal(tx.logs[0].event, "logExecute");
        });
        it("succeeds with value", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let tx = await delayedCallable.payment({
                from: accounts[0],
                value: web3.toWei('1', 'ether')
            });
            assert.equal(tx.logs[0].event, "logExecute");
        });
        it("succeeds with arguments", async function () {
            let callable = await Callable.deployed();
            let delayedCallable = await DelayedProxy(callable);
            let tx = await delayedCallable.singleArgument(42, {from: accounts[0]});
            assert.equal(tx.logs[0].event, "logExecute");
        });
    });
});
