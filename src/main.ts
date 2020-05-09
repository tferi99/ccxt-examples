import * as exch from './impl/exchange-factory'
import * as bal from './impl/balances'
import * as liveorderbook from './impl/live-orderbook'
import {LiveOrderbook} from './impl/live-orderbook';
import {ArbitragePair} from './impl/arbitrage';
import {ExchangeFactory} from './impl/exchange-factory';
import {BasicChart} from './impl/basic-chart';
import * as ft from './impl/fetch-trades-public';
import {FetchClosedOrdersHistoryPrivate} from './impl/fetch-closed-orders-history-private';
import { RateLimitingFetchTest } from './impl/rate-limiting-fetch-test';
import {Exchange} from "ccxt";

async function createExchange(exchangeId: string, config: any): Promise<Exchange> {
    return await ExchangeFactory.create('binance', {verbose: false, withMarkets: true});
}

async function createBinance(config: any): Promise<Exchange> {
    return await createExchange('binance', config);
}

async function testExchange() {
    const exch = await createBinance({verbose: false, withMarkets: true});
    console.log('Exchange:', exch)
}

async function balances() {
    const exch = await createBinance({verbose: false, withMarkets: true});

    bal.getBalance(exch);
}

async function live_orderbook() {
    const exch = await createBinance({verbose: false, withMarkets: true});
    const ob = new LiveOrderbook(exch);
    //ob.printOrderBook('BTC/USDT', 10);
    ob.printOrderBook('MATIC/USDT', 10);
}

async function arbitrage_pairs () {
    const arb = new ArbitragePair();
    const exchanges = ['binance', 'hitbtc'];
    arb.do(exchanges);
}

async function basic_chart() {
    const bc = new BasicChart();
    await bc.do();
}

async function fetch_trades_public() {
    const exch = await createBinance({verbose: false, withMarkets: true});
    const since = exch.milliseconds () - 86400000 // -1 day from now
    const symbol = 'ADA/USDT';
    //const symbol = 'BNB/USDT';
    await ft.fetchTradesPublic(exch, symbol, since, 10);
}

async function fetch_closed_orders_history_private() {
    const exch = await createBinance({verbose: false, withMarkets: true});
    const fco = new FetchClosedOrdersHistoryPrivate();
    const startingDate = '2017-01-01T00:00:00';
    const symbol = 'MATIC/USDT'
    fco.call(exch, startingDate, symbol);
}

async function rate_limiting_fetch_test() {
    const exch = await createBinance({});
    const rlft = new RateLimitingFetchTest();

    const concurrent = [
        rlft.call(exch, 'BTC/USDT'),
        rlft.call(exch, 'BNB/USDT'),
        rlft.call(exch, 'MATIC/USDT'),
        rlft.call(exch, 'ETC/USDT'),
        rlft.call(exch, 'ADA/USDT'),
    ]

    Promise.all(concurrent);
}
//---------------------------------------------------------------------
async function doit() {
    //await testExchange();
    //await balances();
    //await live_orderbook();
    //await arbitrage_pairs();
    //await basic_chart();
     await fetch_trades_public();
    //await fetch_closed_orders_history_private();
    //await rate_limiting_fetch_test();

    console.log('----------------------- END --------------------------');
}

doit();
