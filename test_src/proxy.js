let DelayedProxy = async function (instance_to_proxy) {
    let DelayedProxyContract = artifacts.require("./DelayedProxy");
    let delayedProxyContract = await DelayedProxyContract.deployed();
    let functionNames = instance_to_proxy.abi.filter(abi_entry => abi_entry.type === "function")
        .map(abi_entry => abi_entry.name);
    let extractValue = function (transactionObject) {
        let value = 0;
        if (transactionObject && transactionObject.value) {
            value = transactionObject["value"];
            delete transactionObject["value"];
        }
        return value;
    };
    let makeConfirmer = function (id) {
        return function () {
            return delayedProxyContract.confirm(id);
        }
    };
    let execute = async function (address, value, data, transactionObject) {
        let tx = await delayedProxyContract.execute(address, value, data, transactionObject);
        return makeConfirmer(tx.logs[0].args.txId);
    };
    let proxifiedFunctionCall = (arg_converter) => {
        return async function () {
            let args = [...arguments];
            let value = 0;
            let transactionObject = {};
            if (args.length && args[args.length - 1] instanceof Object) {
                transactionObject = args.pop();
                value = extractValue(transactionObject);
            }
            return execute(instance_to_proxy.address, value, arg_converter.apply(null, args), transactionObject);
        }
    };
    let proxifiedSend = async function (transactionObject) {
        const value = extractValue(transactionObject);
        return execute(instance_to_proxy.address, value, "", transactionObject);
    };
    let handler = {
        get (target, key) {
            if (functionNames.includes(key)) {
                return proxifiedFunctionCall(target.contract[key].getData)
            }
            if (key === "send") {
                return proxifiedSend
            }
            return target[key]
        }
    };
    return new Proxy(instance_to_proxy, handler);
};

export default DelayedProxy;