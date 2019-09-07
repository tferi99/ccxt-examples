const ccxt = require ('ccxt');
let exchange = new ccxt.binance({
    id: 'proba'
});
console.log("result:", exchange.has);

