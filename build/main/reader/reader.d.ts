export class ArrayBufferReader {
    constructor(buffer: any);
    view: DataView;
    length(): number;
    indexAt(i: any): number;
    toArrayBuffer(): ArrayBuffer;
    serializeJson(): string;
}
export class HexStringReader {
    constructor(string: any);
    string: any;
    length(): number;
    indexAt(i: any): number;
    toArrayBuffer(): ArrayBuffer;
    serializeJson(): any;
}
export class Reader {
    static fromRawString(string: any): ArrayBufferReader;
    constructor(input: any);
}
