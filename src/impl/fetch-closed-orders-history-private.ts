import {Exchange} from 'ccxt';
const log = require ('ololog').configure ({ locate: false })
const asTable   = require ('as-table');


export class FetchClosedOrdersHistoryPrivate {
        async call(exchange: Exchange, startingDate: string, symbol: string) {
        const now = exchange.milliseconds();
        log.bright.green ('\nFetching history for:', symbol, '\n')

        let allOrders = [];
        let since = exchange.parse8601 (startingDate);
        while (since < now) {
            try {
                log.bright.blue('Fetching history for', symbol, 'since', exchange.iso8601(since))
                const orders = await exchange.fetchClosedOrders(symbol, since);
                log.green.dim('Fetched', orders.length, 'orders');

                allOrders = allOrders.concat(orders)
                if (orders.length) {
                    const lastOrder = orders[orders.length - 1];
                    since = lastOrder['timestamp'] + 1;

                } else {
                    break; // no more orders left for this symbol, move to next one
                }
            } catch (e) {
                log.red.unlimited(e);
            }
        }

        // omit the following keys for a compact table output
        // otherwise it won't fit into the screen width
        const omittedKeys = [
            'info',
            'timestamp',
            'lastTradeTimestamp',
            'fee',
        ];
        log.yellow (asTable (allOrders.map (order => exchange.omit (order, omittedKeys))));
        log.green ('Fetched', allOrders.length, symbol, 'orders in total');
    }
}
