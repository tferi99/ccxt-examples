export declare class ArbitragePair {
    printSupportedExchanges: () => void;
    printUsage: () => void;
    printExchangeSymbolsAndMarkets: (exchange: any) => void;
    getExchangeMarketsTable: (exchange: any) => any;
    sleep: (ms: any) => Promise<unknown>;
    proxies: string[];
    do: (exchangeIds: string[]) => Promise<void>;
}
