import * as ccxt from 'ccxt';
const asciichart = require ('asciichart')
const asTable   = require ('as-table');
const ansi      = require ('ansicolor').nice;
const log        = require ('ololog').configure ({ locate: false })

require ('ansicolor').nice;

export class BasicChart {
    async do() {
        const index = 4 // [ timestamp, open, high, low, close, volume ]
        const ohlcv = await new ccxt.binance().fetchOHLCV ('BTC/USDT', '15m', undefined, 100)
        const lastPrice = ohlcv[ohlcv.length - 1][index] // closing price
        const series = ohlcv.map (x => x[index])         // closing price
        // @ts-ignore
        const bitcoinRate = ('₿ = $' + lastPrice).green;
        const chart = asciichart.plot (series, { height: 15, padding: '            ' })
        log.yellow ("\n" + chart, bitcoinRate, "\n")
    }
}

