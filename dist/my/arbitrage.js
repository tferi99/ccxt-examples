"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('ololog').configure({ concat: { separator: '' } });
const ccxt = require("ccxt");
const asTable = require('as-table');
const ansi = require('ansicolor').nice;
const fs = require('fs');
const {} = require('ansicolor').nice;
const keysGlobal = 'keys.json';
const keysLocal = 'keys.local.json';
const keysFile = fs.existsSync(keysLocal) ? keysLocal : (fs.existsSync(keysGlobal) ? keysGlobal : false);
const configFromFile = keysFile ? require('../../' + keysFile) : {};
const defaultConfig = {
    timeout: 30000,
    enableRateLimit: true,
    verbose: false,
};
class ArbitragePair {
    constructor() {
        this.printSupportedExchanges = function () {
            log('Supported exchanges:', ccxt.exchanges.join(', '));
        };
        this.printUsage = function () {
            log('Usage: node', process.argv[1], 'id1', 'id2', 'id3', '...');
            this.printSupportedExchanges();
        };
        this.printExchangeSymbolsAndMarkets = function (exchange) {
            log(this.getExchangeSymbols(exchange));
            log(this.getExchangeMarketsTable(exchange));
        };
        this.getExchangeMarketsTable = (exchange) => {
            return asTable.configure({ delimiter: ' | ' })(Object.values(exchange.markets));
        };
        this.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        this.proxies = [
            '',
            'https://crossorigin.me/',
            'https://cors-anywhere.herokuapp.com/',
        ];
        this.do = async (exchangeIds) => {
            if (exchangeIds.length == 0) {
                this.printSupportedExchanges();
                return;
            }
            let exchanges = {};
            for (let id of exchangeIds) {
                let settings = configFromFile[id] || {};
                const config = Object.assign(Object.assign({}, defaultConfig), settings);
                let exchange = new ccxt[id](config);
                exchanges[id] = exchange;
                let markets = await exchange.loadMarkets();
                let currentProxy = 0;
                let maxRetries = this.proxies.length;
                for (let numRetries = 0; numRetries < maxRetries; numRetries++) {
                    try {
                        exchange.proxy = this.proxies[currentProxy];
                        await exchange.loadMarkets();
                    }
                    catch (e) {
                        if (e instanceof ccxt.DDoSProtection || e.message.includes('ECONNRESET')) {
                            log.bright.yellow('[DDoS Protection Error] ' + e.message);
                        }
                        else if (e instanceof ccxt.RequestTimeout) {
                            log.bright.yellow('[Timeout Error] ' + e.message);
                        }
                        else if (e instanceof ccxt.AuthenticationError) {
                            log.bright.yellow('[Authentication Error] ' + e.message);
                        }
                        else if (e instanceof ccxt.ExchangeNotAvailable) {
                            log.bright.yellow('[Exchange Not Available Error] ' + e.message);
                        }
                        else if (e instanceof ccxt.ExchangeError) {
                            log.bright.yellow('[Exchange Error] ' + e.message);
                        }
                        else {
                            throw e;
                        }
                        currentProxy = ++currentProxy % this.proxies.length;
                    }
                }
                log(id, 'loaded', exchange.symbols.length.toString().green, 'markets');
            }
            log('Loaded all markets');
            const exchangeSymbols = exchangeIds.map(id => exchanges[id].symbols);
            const flatExchangeSymbols = [].concat.apply([], exchangeSymbols);
            const uniqueSymbols = Array.from(new Set(flatExchangeSymbols));
            let arbitrableSymbols = uniqueSymbols.filter(symbol => exchangeIds.filter(id => (exchanges[id].symbols.indexOf(symbol) >= 0)).length > 1)
                .sort((id1, id2) => (id1 > id2) ? 1 : ((id2 > id1) ? -1 : 0));
            let table = arbitrableSymbols.map(symbol => {
                let row = { symbol };
                for (let id of exchangeIds) {
                    if (exchanges[id].symbols.indexOf(symbol) >= 0) {
                        row[id] = id;
                    }
                }
                return row;
            });
            log(asTable.configure({ delimiter: ' | ' })(table));
            log('------------------------ end -------------------------');
        };
    }
}
exports.ArbitragePair = ArbitragePair;
//# sourceMappingURL=arbitrage.js.map