"use strict";
const log = require ('ololog').configure ({ locate: false })
const utils = require ('./utils')
const ccxt = require ('ccxt')

const enableRateLimit = true
const EXCHG = 'binance';

(async () => {
    const settings = utils.loadCredentials();
    let exchange = new ccxt[EXCHG](ccxt.extend ({ enableRateLimit }, settings[EXCHG]));
    await exchange.loadMarkets();
    let balance = await exchange.fetchBalance();
    //console.log ('Exchange[' + exchange.id + "]: ", balance['free']);

    let b = balance['free'];
    for (var curr in b) {
        if (b[curr] != 0) {
            console.log(curr + ": " + b[curr]);
        }
    }
    //console.log(b);

}) ()

