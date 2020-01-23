"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('ololog').configure({ concat: { separator: '' } });
const ccxt = require("ccxt");
const asTable = require('as-table');
const ansi = require('ansicolor').nice;
class LiveOrderbook {
    constructor(exchange) {
        this.exchange = exchange;
        this.printSupportedExchanges = function () {
            log('Supported exchanges:', ccxt.exchanges.join(', '));
        };
        this.printUsage = function () {
            log('Usage: node', process.argv[1], 'exchange', 'symbol', 'depth');
            this.printSupportedExchanges();
        };
        this.printOrderBook = async (symbol, depth) => {
            if (symbol in this.exchange.markets) {
                const market = this.exchange.markets[symbol];
                const pricePrecision = market.precision ? market.precision.price : 8;
                const amountPrecision = market.precision ? market.precision.amount : 8;
                const priceVolumeHelper = color => ([price, amount]) => ({
                    price: price.toFixed(pricePrecision)[color],
                    amount: amount.toFixed(amountPrecision)[color],
                    '  ': '  ',
                });
                const cursorUp = '\u001b[1A';
                const tableHeight = depth * 2 + 4;
                log(' ');
                while (true) {
                    const orderbook = await this.exchange.fetchOrderBook(symbol);
                    log(symbol.green, this.exchange.iso8601(this.exchange.milliseconds()));
                    log(asTable.configure({ delimiter: ' | ', right: true })([
                        ...orderbook.asks.slice(0, depth).reverse().map(priceVolumeHelper('red')),
                        ...orderbook.bids.slice(0, depth).map(priceVolumeHelper('green')),
                    ]));
                    log(cursorUp.repeat(tableHeight));
                }
            }
            else {
                log.error('Market Symbol', symbol.bright, 'not found');
            }
        };
    }
}
exports.LiveOrderbook = LiveOrderbook;
//# sourceMappingURL=live-orderbook.js.map