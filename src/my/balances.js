"use strict";
const log = require ('ololog').configure ({ locate: false })
const utils = require ('./utils')
const ccxt = require ('ccxt')

const enableRateLimit = true
const EXCHG = 'binance';

(async () => {
    const settings = utils.loadCredentials();
    // console.log('settings: ', settings);

    const exchangeId = 'binance';
    const exchangeClass = ccxt[exchangeId];
    const config = {...settings[exchangeId], timeout: 30000, enableRateLimit: true, verbose: true};
    const exchange = new exchangeClass (config);

    //let exchange = new ccxt[EXCHG](ccxt.extend ({ enableRateLimit }, settings[EXCHG]));

    // await exchange.loadMarkets();
    let balance = await exchange.fetchBalance();
     console.log ('Exchange[' + exchange.id + "]: ", balance);

/*    let tb = balance['total'];
    for (var curr in tb) {
        if (tb[curr] != 0) {
            console.log(curr + ": ", balance[curr]);
        }
    }*/
}) ()

