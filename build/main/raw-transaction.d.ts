import { ResponseInfo, UniTokenModel } from '.';
export declare class RawTransaction implements UniTokenModel {
    readonly transactionResult: any;
    constructor(transactionResult: any);
    raw(): ResponseInfo;
    transform(): object;
    serializeJson(): object;
}
