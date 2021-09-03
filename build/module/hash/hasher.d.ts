import { ArrayBufferReader, HexStringReader } from '..';
export interface HashMethod {
    update(data: string | Uint8Array): HashMethod;
    digest(data?: string | Uint8Array): string | Uint8Array;
    digest(encoding: string): string | Uint8Array;
}
export declare abstract class Hasher {
    protected h: HashMethod;
    constructor(h: HashMethod);
    abstract update(data: string | ArrayBuffer | HexStringReader | ArrayBufferReader): Hasher;
    abstract digest(): HexStringReader | ArrayBufferReader;
    abstract reset(): void;
    protected setH(h: HashMethod): void;
    hash(data: string | Uint8Array | HexStringReader | ArrayBufferReader): HexStringReader | ArrayBufferReader;
}
