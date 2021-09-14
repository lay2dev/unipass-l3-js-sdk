import { Reader } from '..';
interface pubkey {
    type: string;
    value: any;
}
export declare class RecoveryEmail {
    threshold: number;
    first_n: number;
    emails: ArrayBuffer[];
    constructor(threshold: number, first_n: number, emails: ArrayBuffer[]);
}
export declare class RegisterInner {
    username: Reader;
    register_email: Reader;
    pubkey: pubkey;
    recoveryEmail: RecoveryEmail;
    source: ArrayBuffer;
    constructor(username: Reader, register_email: Reader, pubkey: pubkey, recoveryEmail: RecoveryEmail, source?: ArrayBuffer);
    serialize(): string;
}
export declare class Rsa {
    e: ArrayBuffer;
    n: ArrayBuffer;
    constructor(e: ArrayBuffer, n: ArrayBuffer);
}
export declare class RsaPubkey implements pubkey {
    type: string;
    value: Rsa;
    constructor(rsa: Rsa);
}
export {};
