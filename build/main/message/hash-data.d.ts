import { registerInner } from '..';
export declare class HashData {
    private inner;
    private backend?;
    constructor(inner: registerInner, backend?: boolean);
    hash(): string;
}
