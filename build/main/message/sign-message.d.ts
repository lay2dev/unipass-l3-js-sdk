import { registerInner } from '..';
export declare function hashData(data: string): string;
export declare class SignMessage {
    private inner;
    constructor(inner: registerInner);
    sign(): string;
}
