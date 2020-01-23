import { Exchange } from 'ccxt';
export declare class ExchangeFactory {
    static create(exchangeId: any, config?: any): Promise<Exchange>;
}
