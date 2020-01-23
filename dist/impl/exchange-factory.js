"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ccxt = require("ccxt");
const utils = require("./utils");
class ExchangeFactory {
    static async create(exchangeId, config) {
        const exchangeClass = ccxt[exchangeId];
        const settings = utils.loadCredentials();
        const mergedConfig = Object.assign(Object.assign(Object.assign({}, settings[exchangeId]), { timeout: 30000, enableRateLimit: true, verbose: false }), config);
        const exch = new exchangeClass(mergedConfig);
        if (config && config.withMarkets) {
            await exch.loadMarkets();
        }
        return exch;
    }
}
exports.ExchangeFactory = ExchangeFactory;
//# sourceMappingURL=exchange-factory.js.map