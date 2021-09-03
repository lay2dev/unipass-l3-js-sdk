export declare class ArrayBufferReader {
    input: ArrayBuffer;
    view: DataView;
    constructor(input: ArrayBuffer);
    static fromRawString(string: any): ArrayBufferReader;
    length(): number;
    indexAt(i: number): number;
    toArrayBuffer(): ArrayBuffer;
    serializeJson(): string;
}
