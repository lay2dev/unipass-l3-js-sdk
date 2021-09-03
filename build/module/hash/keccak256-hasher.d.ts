import { Hasher } from '.';
import { ArrayBufferReader, HexStringReader } from '../reader';
export declare class Keccak256Hasher extends Hasher {
    constructor();
    update(data: string | ArrayBuffer | ArrayBufferReader | HexStringReader): Hasher;
    digest(): HexStringReader;
    reset(): void;
}
