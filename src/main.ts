import * as exch from './utils/exchange-factory'
import * as bal from './impl/balances'
import * as liveorderbook from './impl/live-orderbook'
import {LiveOrderbook} from './impl/live-orderbook';
import {ArbitragePair} from './impl/arbitrage';
import {ExchangeFactory} from './utils/exchange-factory';
import {BasicChart} from './impl/basic-chart';
import * as ft from './impl/fetch-trades-public';
import {FetchClosedOrdersHistoryPrivate} from './impl/fetch-closed-orders-history-private';
import { RateLimitingFetchTest } from './impl/rate-limiting-fetch-test';
import {Exchange} from 'ccxt';
import {EXCHANGE} from "./constants";
import {prittyPrintObjectAsJSON} from "./utils/utils";

const config = {
    verbose: false,
    withMarkets: true
};

async function createExchange(exchangeId: string, config: any): Promise<Exchange> {
    return await ExchangeFactory.create(exchangeId, config);
}

async function getExchange() {
    const exch = await createExchange(EXCHANGE, config);
    prittyPrintObjectAsJSON(exch, `Exchange[${exch.id}]`);
}

async function getExchangeRequiredCredentials() {
    const exch = await createExchange(EXCHANGE, config);
    prittyPrintObjectAsJSON(exch.requiredCredentials, `Exchange[${exch.id}] required credentials`);
}

async function getExchangeCapabilities() {
    const exch = await createExchange(EXCHANGE, config);
    prittyPrintObjectAsJSON(exch.has, `Exchange[${exch.id}] capabilities`);
}

async function getExchangeMarkets() {
    const exch = await createExchange(EXCHANGE, config);
    prittyPrintObjectAsJSON(exch.markets, `Exchange[${exch.id}] markets`);
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
    //---------- sapi ----------
    //const res = await  exch.sapiGetAccountSnapshot({type: 'SPOT'});

    //---------- public ----------
    //const res = await  exch.publicGetExchangeInfo();
    //const res = await  exch.publicGetDepth({symbol: 'BTCUSDT'});
    //const res = await  exch.publicGetTrades({symbol: 'BTCUSDT', limit: 5});
    //const res = await  exch.publicGetAggTrades({symbol: 'BTCUSDT', limit: 5});
    ///const res = await  exch.publicGetKlines({symbol: 'BTCUSDT', limit: 5, interval: '5m'});
    //const res = await  exch.publicGetTickerPrice({symbol: 'BTCUSDT'});
    //const res = await  exch.publicGetTicker24hr({symbol: 'BTCUSDT'});
    //const res = await  exch.publicGetTickerBookTicker({symbol: 'BTCUSDT'});

    //---------- private ----------
/*        await exch.privatePostOrder({
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 0.01
        });*/

/*    await exch.privatePostOrder({
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 0.03,
        timeInForce: 'GTC',
        price: 15000
    });*/

/*    await exch.privateDeleteOpenOrders({symbol: 'BTCUSDT'});
    const res = await  exch.privateGetOpenOrders();*/
    //const res = await  exch.privateGetMyTrades({symbol: 'BTCUSDT'});
    const res = await  exch.privateGetAccount();


    prittyPrintObjectAsJSON(res, `Implicit result`);
}

async function fetch_tickers() {
    const exch = await createExchange(EXCHANGE, config);
    const tickers = await exch.fetchTickers(['BTC/USDT', 'MATIC/USDT', 'BNB/USDT']);
    prittyPrintObjectAsJSON(tickers, `Exchange[${exch.id}] - some tickers`);
}


//---------------------------------------------------------------------
async function doit() {
    // ----- exchange info -----
    //await getExchange();
    //await getExchangeRequiredCredentials();
    //await getExchangeCapabilities();
    //await getExchangeMarkets();
    //await rate_limiting_fetch_test();

    // ----- balance -----
    //await balances();

    // ----- chart, tickers -----
    //await basic_chart();

    // market
    await fetch_tickers()

    // ----- trade info -----
    //await fetch_trades_public();
    //await live_orderbook();
    //await fetch_closed_orders_history_private();

    // ----- trade -----

    // ----- implicit  -----
    //await callImplicit();

    // ----- etc -----
    //await arbitrage_pairs();

    console.log('----------------------- END --------------------------');
}

doit();
