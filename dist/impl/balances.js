"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBalance = async function (exchange) {
    let balance = await exchange.fetchBalance();
    let tb = balance['total'];
    for (var curr in tb) {
        if (tb[curr] != 0) {
            console.log(curr + ": ", balance[curr]);
        }
    }
};
exports.getBalance = getBalance;
//# sourceMappingURL=balances.js.map