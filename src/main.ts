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
import {Exchange} from 'ccxt';
import {EXCHANGE} from "./constants";

const config = {
    verbose: false,
    withMarkets: true
};


async function createExchange(exchangeId: string, config: any): Promise<Exchange> {
    return await ExchangeFactory.create(exchangeId, config);
}

async function getExchange() {
    const exch = await createExchange(EXCHANGE, config);
    console.log(`Exchange[${exch.id}]:`, JSON.stringify(exch));
}

async function getExchangeCapabilities() {
    const exch = await createExchange(EXCHANGE, config);
    console.log(`Exchange[${exch.id}] capabilities:`, JSON.stringify(exch.has));
}

async function getExchangeMarkets() {
    const exch = await createExchange(EXCHANGE, config);
    console.log(`Exchange[${exch.id}] markets:`, JSON.stringify(exch.markets));
}


async function balances() {
    const exch = await createExchange(EXCHANGE, config);
    await bal.getBalance(exch);
}

async function live_orderbook() {
    const exch = await createExchange(EXCHANGE, config);
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
    const exch = await createExchange(EXCHANGE, config);
    const since = exch.milliseconds () - 86400000 // -1 day from now
    //const symbol = 'ADA/USDT';
    const symbol = 'BNB/USDT';
    await ft.fetchTradesPublic(exch, symbol, since, 10);
}

async function fetch_closed_orders_history_private() {
    const exch = await createExchange(EXCHANGE, config);
    const fco = new FetchClosedOrdersHistoryPrivate();
    const startingDate = '2017-01-01T00:00:00';
    const symbol = 'MATIC/USDT'
    fco.call(exch, startingDate, symbol);
}

async function rate_limiting_fetch_test() {
    const exch = await createExchange(EXCHANGE, config);
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

/**
 * See also:
 *  - CCXT - Implicit API Methods: https://github.com/ccxt/ccxt/wiki/Manual#implicit-api-methods
 *  - Binance - https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#test-new-order-trade
 *  - etc/binance-exchange.json/api/...
 */
async function callImplicit() {
    const exch = await createExchange(EXCHANGE, config);
    //const res = await  exch.sapiGetAccountSnapshot({type: 'SPOT'});
    //const res = await  exch.publicGetExchangeInfo();
    //const res = await  exch.publicGetDepth({symbol: 'BTCUSDT'});

/*    await exch.privatePostOrder({
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 0.03,
        timeInForce: 'GTC',
        price: 15000
    });*/

    await exch.privateDeleteOpenOrders({symbol: 'BTCUSDT'});
    const res = await  exch.privateGetOpenOrders();

    console.log('Implicit result:', JSON.stringify(res));
}
//---------------------------------------------------------------------
async function doit() {
    // ----- exchange info -----
    //await getExchange();
    //await getExchangeCapabilities();
    //await getExchangeMarkets();
    //await rate_limiting_fetch_test();

    // ----- balance -----
    //await balances();

    // ----- chart, tickers -----
    //await basic_chart();

    // ----- trade info -----
    //await fetch_trades_public();
    //await live_orderbook();
    //await fetch_closed_orders_history_private();

    // ----- trade -----

    // ----- implicit  -----
    await callImplicit();

    // ----- etc -----
    //await arbitrage_pairs();

    console.log('----------------------- END --------------------------');
}

doit();
