"use strict";
//const log = require ('ololog').configure ({ locate: false })
import * as ccxt from 'ccxt';
import * as utils from './utils';
import {Exchange} from 'ccxt';

const enableRateLimit = true
const EXCHG = 'binance';

const getBalance = async function(exchange: Exchange) {
    let balance = await exchange.fetchBalance();
    // console.log ('Exchange[' + exchange.id + "]: ", balance);

    let tb = balance['total'];
    for (var curr in tb) {
        if (tb[curr] != 0) {
            console.log(curr + ": ", balance[curr]);
        }
    }
};

export {getBalance}


