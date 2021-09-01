import JSBI from 'jsbi';
export declare class RPC {
    private readonly uri;
    private readonly options;
    constructor(uri: string, options?: {});
    [method: string]: any;
}
export declare function HexStringToBigInt(hexString: any): JSBI;
export declare function BigIntToHexString(bigInt: any): string;
