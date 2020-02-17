import {Exchange} from 'ccxt';
const log = require ('ololog').configure ({ locate: false })
const asTable   = require ('as-table');
const ansi = require ('ansicolor').nice;

const repeat = 100;

export class RateLimitingFetchTest {
    async call(exchange: Exchange, symbol: string) {
        for (let i = 0; i < repeat; i++) {
            let ticker = await exchange.fetchTicker (symbol);
            // @ts-ignore
            log (exchange.id.green, exchange.iso8601 (exchange.milliseconds ()), ticker['datetime'], symbol.green, ticker['last']);
        }
    }
}
