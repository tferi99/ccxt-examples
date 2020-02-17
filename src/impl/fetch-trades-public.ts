import {Exchange} from 'ccxt';
const log = require ('ololog').configure ({ locate: false })
const asTable   = require ('as-table');

const fetchTradesPublic = async function(exchange: Exchange, symbol: string, since: number, limit: number) {
    const response = await exchange.fetchTrades (symbol, since, limit);
    log (asTable (response))
    log (response.length.toString (), 'trades')
}

export {fetchTradesPublic}
