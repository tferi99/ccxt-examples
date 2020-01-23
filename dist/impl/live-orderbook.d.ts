import { Exchange } from 'ccxt';
export declare class LiveOrderbook {
    private exchange;
    constructor(exchange: Exchange);
    printSupportedExchanges: () => void;
    printUsage: () => void;
    printOrderBook: (symbol: string, depth: number) => Promise<void>;
}
