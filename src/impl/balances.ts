import {Exchange} from 'ccxt';

const getBalance = async function(exchange: Exchange) {
    let balance = await exchange.fetchBalance();

    let tb = balance['total'];
    for (var curr in tb) {
        if (tb[curr] != 0) {
            console.log(curr + ": ", balance[curr]);
        }
    }
};

export {getBalance}


