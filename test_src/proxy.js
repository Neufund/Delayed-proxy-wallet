let DelayedProxy = async function (instance_to_proxy) {
    let DelayedProxyContract = artifacts.require("./DelayedProxy");
    let delayedProxyContract = await DelayedProxyContract.deployed();
    let functionNames = instance_to_proxy.abi.filter(abi_entry => abi_entry.type === "function")
        .map(abi_entry => abi_entry.name);
    let proxifiedFunctionCall = (arg_converter) => {
        return function () {
            let args = [...arguments];
            let transactionObject = args.pop();
            return delayedProxyContract.execute(instance_to_proxy.address, arg_converter.apply(null, args), transactionObject);
        }
    };
    let proxifiedSend = function (transactionObject) {
        return delayedProxyContract.execute(instance_to_proxy.address, "", transactionObject);
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