import { HashRawData } from '..';
export declare class SignMessage {
    private inner;
    private backend?;
    constructor(inner: HashRawData, backend?: boolean);
    messageHash(): string;
}
