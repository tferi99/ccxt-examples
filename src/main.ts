import * as exch from './impl/exchange-factory'
import * as bal from './impl/balances'
import * as liveorderbook from './impl/live-orderbook'
import {LiveOrderbook} from './impl/live-orderbook';
import {ArbitragePair} from './impl/arbitrage';
import {ExchangeFactory} from './impl/exchange-factory';


async function testExchange() {
    const exch = await ExchangeFactory.create('binance', {verbose: false, withMarkets: true});
    console.log('Exchange:', exch)
}

async function balances() {
    const exch = await ExchangeFactory.create('binance', { withMarkets: true});
    bal.getBalance(exch);
}

async function live_orderbook() {
    const exch = await ExchangeFactory.create('binance', { withMarkets: true});
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

}
//---------------------------------------------------------------------
async function work() {
    //await testExchange();
    //await balances();
    //await live_orderbook();
    await arbitrage_pairs();
}

work();

