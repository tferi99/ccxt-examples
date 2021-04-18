import * as ccxt from 'ccxt';
import {Exchange} from 'ccxt';
import * as utils from './utils';

export class ExchangeFactory {
    /**
     *
     * @param exchangeId
     * @param config - CCXT Exchange config object + custom properties.
     *
     * Custom config properties:
     *  - withMarkets (true/false - default: false)
     */
    static async create(exchangeId, config?: any): Promise<Exchange> {
        const exchangeClass = ccxt[exchangeId];
        const settings = utils.loadCredentials();
        //console.log('SETTINGS:', settings);
        const mergedConfig = {...settings[exchangeId], timeout: 30000, enableRateLimit: true, verbose: false, ...config};
        //console.log('CFG:', mergedConfig);

        const exch = new exchangeClass (mergedConfig);
        if (exch.urls.test) {
            exch.urls['api'] = exch.urls['test'];
        }
        console.log('Exchange UIRLs:', exch.urls);

        if (config && config.withMarkets) {
            await exch.loadMarkets();
        }
        return exch;
    }
}

