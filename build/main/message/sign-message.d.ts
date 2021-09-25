import { registerInner } from '..';
export declare class SignMessage {
    private inner;
    private backend?;
    constructor(inner: registerInner, backend?: boolean);
    messageHash(): string;
}
