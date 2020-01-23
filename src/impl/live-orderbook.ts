//import * as log from 'ololog';
import {Exchange} from 'ccxt';

const log = require ('ololog').configure ({ concat: { separator: '' }})
import * as ccxt from 'ccxt';

const asTable   = require ('as-table');
const ansi      = require ('ansicolor').nice;


export class LiveOrderbook {
    constructor(private exchange: Exchange) {}

    printSupportedExchanges = function () {
        log('Supported exchanges:', ccxt.exchanges.join (', '));
    }

     printUsage = function () {
        log('Usage: node', process.argv[1], 'exchange', 'symbol', 'depth');
        this.printSupportedExchanges();
    }

    printOrderBook = async (symbol: string, depth: number) => {
        // // output a list of all market symbols
        // log (id.green, 'has', exchange.symbols.length, 'symbols:', exchange.symbols.join (', ').yellow)
        if (symbol in this.exchange.markets) {
            const market = this.exchange.markets[symbol];
            const pricePrecision = market.precision ? market.precision.price : 8;
            const amountPrecision = market.precision ? market.precision.amount : 8;

            // Object.values (markets).forEach (market => log (market))

            // make a table of all markets
            // const table = asTable.configure ({ delimiter: ' | ' }) (Object.values (markets))
            // log (table)
            const priceVolumeHelper = color => ([price, amount]) => ({
                price: price.toFixed (pricePrecision)[color],
                amount: amount.toFixed (amountPrecision)[color],
                '  ': '  ',
            });

            const cursorUp = '\u001b[1A'
            const tableHeight = depth * 2 + 4 // bids + asks + headers
            log (' ') // empty line

            while (true) {
                const orderbook = await this.exchange.fetchOrderBook (symbol)
                // @ts-ignore
                log (symbol.green, this.exchange.iso8601 (this.exchange.milliseconds ()))
                log (asTable.configure ({ delimiter: ' | ', right: true }) ([
                    ... orderbook.asks.slice (0, depth).reverse ().map (priceVolumeHelper ('red')),
                    // { price: '--------'.dim, amount: '--------'.dim },
                    ... orderbook.bids.slice (0, depth).map (priceVolumeHelper ('green')),
                ]));
                log (cursorUp.repeat (tableHeight));
            }
        } else {
            // @ts-ignore
            log.error ('Market Symbol', symbol.bright, 'not found');
            // console.log('markets:', exchange.markets);
        }
    }
}
