import { HashRawData } from '..';
export declare class SignMessage {
    private inner;
    constructor(inner: HashRawData);
    messageHash(): string;
}
