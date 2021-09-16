import { RPC, Sign, TransactionParams, UniTokenModel } from '.';
export declare class Transaction implements UniTokenModel {
    inner: any;
    sig?: Sign;
    constructor(inner: any, sig?: Sign);
    validate(): Transaction;
    validateRaw(): Transaction;
    setSig(sig: any): void;
    transform(): object;
    serializeJson(): TransactionParams;
    sendTransaction(rpc: RPC): Promise<string | object>;
}
