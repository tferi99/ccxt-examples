const USE_TESTNET = true;

//const EXCHANGE="binance";
const EXCHANGE="coinbasepro";

/**
 *  Credential config JSON file structure:
 *
 * {
 *   "exchange1":        { "apiKey": ".....", "secret": "....." },
 *   "exchange1":        { "apiKey": ".....", "secret": "....." },
 *      ...
 *   "exchangeN":        { "apiKey": ".....", "secret": "....." },
 * }
 * for example:
 *  {
 *      "binance":        { "apiKey": "sdSfsf368f09DF987", "secret": "45ksk5F6sfI4CV7" },
 *      "coinbase":        { "apiKey": "84dF5Crth5SvyY2Cdghd4Jg", "secret": "dfgh5FHf6fFh8SnS34nJ8" }
 *  }
 */
var CREDENTIAL_CONFIG;
if (!USE_TESTNET) {
    CREDENTIAL_CONFIG = '/tmp/ccxt-examples-credentials.json'
} else {
    CREDENTIAL_CONFIG = '/tmp/ccxt-examples-credentials-test.json'
}

export {USE_TESTNET, CREDENTIAL_CONFIG, EXCHANGE}

