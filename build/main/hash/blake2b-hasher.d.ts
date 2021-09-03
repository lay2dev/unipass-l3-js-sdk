import { Hasher } from '.';
import { ArrayBufferReader } from '..';
export declare class Blake2bHasher extends Hasher {
    constructor();
    update(data: string | ArrayBuffer): Hasher;
    digest(): ArrayBufferReader;
    reset(): void;
}
