import { ArrayBufferReader } from '..';
export declare class HexStringReader {
    input: string;
    constructor(input: string);
    static fromRawString(string: any): ArrayBufferReader;
    length(): any;
    indexAt(i: number): any;
    toArrayBuffer(length: number): ArrayBuffer;
    serializeJson(): string;
}
