const log = require ('ololog').configure ({ concat: { separator: '' }})
import * as ccxt from 'ccxt';
const asTable = require ('as-table');
const ansi = require ('ansicolor').nice;
const fs = require('fs');
const {} = require ('ansicolor').nice
/*    , verbose   = process.argv.includes ('--verbose')
    , keysGlobal = 'keys.json'
    , keysLocal = 'keys.local.json'
    , keysFile = fs.existsSync (keysLocal) ? keysLocal : (fs.existsSync (keysGlobal) ? keysGlobal : false)
    , config = keysFile ? require ('../../' + keysFile) : {}
*/
const keysGlobal = 'keys.json';
const keysLocal = 'keys.local.json';
const keysFile = fs.existsSync (keysLocal) ? keysLocal : (fs.existsSync (keysGlobal) ? keysGlobal : false);
const configFromFile = keysFile ? require ('../../' + keysFile) : {};

const defaultConfig = {
    timeout: 30000,
    enableRateLimit: true,
    verbose: false,
};

export class ArbitragePair {
    printSupportedExchanges = function () {
        log('Supported exchanges:', ccxt.exchanges.join (', '));
    }

    printUsage = function () {
        log('Usage: node', process.argv[1], 'id1', 'id2', 'id3', '...')
        this.printSupportedExchanges ()
    }

    printExchangeSymbolsAndMarkets = function (exchange) {
        log(this.getExchangeSymbols (exchange))
        log(this.getExchangeMarketsTable (exchange))
    }

    getExchangeMarketsTable = (exchange) => {
        return asTable.configure ({ delimiter: ' | ' }) (Object.values (exchange.markets))
    }

    sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

    proxies = [
        '', // no proxy by default
        'https://crossorigin.me/',
        'https://cors-anywhere.herokuapp.com/',
    ]

    do = async(exchangeIds: Array<string>) => {
        if (exchangeIds.length == 0) {
            this.printSupportedExchanges();
            return;
        }

        let exchanges = {}

        // load all markets from all exchanges
        for (let id of exchangeIds) {
            let settings = configFromFile[id] || {}
            const config = {...defaultConfig, ...settings};

            // instantiate the exchange by id
            let exchange = new ccxt[id](config);

            // save it in a dictionary under its id for future use
            exchanges[id] = exchange

            // load all markets from the exchange
            let markets = await exchange.loadMarkets ()

            // basic round-robin proxy scheduler
            let currentProxy = 0
            let maxRetries   = this.proxies.length

            for (let numRetries = 0; numRetries < maxRetries; numRetries++) {
            try { // try to load exchange markets using current proxy
                    exchange.proxy = this.proxies[currentProxy]
                    await exchange.loadMarkets ()
                } catch (e) { // rotate proxies in case of connectivity errors, catch all other exceptions
                    // swallow connectivity exceptions only
                    if (e instanceof ccxt.DDoSProtection || e.message.includes ('ECONNRESET')) {
                        log.bright.yellow ('[DDoS Protection Error] ' + e.message)
                    } else if (e instanceof ccxt.RequestTimeout) {
                        log.bright.yellow ('[Timeout Error] ' + e.message)
                    } else if (e instanceof ccxt.AuthenticationError) {
                        log.bright.yellow ('[Authentication Error] ' + e.message)
                    } else if (e instanceof ccxt.ExchangeNotAvailable) {
                        log.bright.yellow ('[Exchange Not Available Error] ' + e.message)
                    } else if (e instanceof ccxt.ExchangeError) {
                        log.bright.yellow ('[Exchange Error] ' + e.message)
                    } else {
                        throw e; // rethrow all other exceptions
                    }

                    // retry next proxy in round-robin fashion in case of error
                    currentProxy = ++currentProxy % this.proxies.length
                }
            }

            log(id, 'loaded', exchange.symbols.length.toString ().green, 'markets')
        }

        log('Loaded all markets');

        // get all unique symbols
        const exchangeSymbols: Array<string> = exchangeIds.map (id => exchanges[id].symbols);
        const flatExchangeSymbols = [].concat.apply([], exchangeSymbols);
        const uniqueSymbols = Array.from(new Set(flatExchangeSymbols));
        //console.log("TEST: ", flatExchangeSymbols);

        //let uniqueSymbols = ccxt.unique (ccxt.flatten (exchangeIds.map (id => exchanges[id].symbols)));
        //let uniqueSymbols = [];

        // filter out symbols that are not present on at least two exchanges
        let arbitrableSymbols = uniqueSymbols.filter (symbol =>
            exchangeIds.filter (id => (exchanges[id].symbols.indexOf (symbol) >= 0)).length > 1)
            .sort ((id1, id2) => (id1 > id2) ? 1 : ((id2 > id1) ? -1 : 0));

        // print a table of arbitrable symbols
        let table = arbitrableSymbols.map (symbol => {
            let row = { symbol }
            for (let id of exchangeIds) {
                if (exchanges[id].symbols.indexOf (symbol) >= 0) {
                    row[id] = id
                }
            }
            return row
        })
        log(asTable.configure ({ delimiter: ' | ' }) (table))

        log('------------------------ end -------------------------');
    }
}
