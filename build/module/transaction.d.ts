import { ArrayBufferReader, RPC, TransactionParams, UniTokenModel } from '.';
export declare class Transaction implements UniTokenModel {
    inner: any;
    sig?: string;
    constructor(inner: any, sig?: string);
    validate(): Transaction;
    validateRaw(): Transaction;
    setSig(sig: any): void;
    transform(): object;
    serializeJson(): TransactionParams;
    sigVerify(): ArrayBufferReader;
    sendTransaction(rpc: RPC): Promise<string | object>;
}
