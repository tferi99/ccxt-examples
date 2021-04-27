import * as ccxt from 'ccxt';
import {Exchange} from 'ccxt';
import { USE_TESTNET } from '../constants';
import * as utils from './utils';

const DEFAULT_CONFIG = {
    timeout: 30000,
    enableRateLimit: true,
    verbose: false,
}


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
        const mergedConfig = {...settings[exchangeId], ...DEFAULT_CONFIG, ...config};
        //console.log('CFG:', mergedConfig);

        const exch = new exchangeClass (mergedConfig);
        if (USE_TESTNET) {
            exch.setSandboxMode(true);
        }
        if (config && config.withMarkets) {
            await exch.loadMarkets();
        }
        return exch;
    }
}

