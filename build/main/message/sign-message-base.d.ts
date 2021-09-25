import { Reader } from '..';
interface pubkey {
    type: string;
    value: any;
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
    recovery_email: RecoveryEmail;
    source: ArrayBuffer;
    constructor(username: Reader, register_email: Reader, pubkey: pubkey, recovery_email: RecoveryEmail, source?: ArrayBuffer);
    serialize(): Reader;
}
export declare class addLocalKeyInner {
    username: Reader;
    nonce: Reader;
    pubkey: pubkey;
    constructor(username: Reader, nonce: Reader, pubkey: pubkey);
    serialize(): Reader;
}
export declare class deleteLocalKeyInner {
    username: Reader;
    nonce: Reader;
    pubkey: pubkey;
    constructor(username: Reader, nonce: Reader, pubkey: pubkey);
    serialize(): Reader;
}
export declare class updateQuickLoginInner {
    username: Reader;
    nonce: Reader;
    quick_login: number;
    constructor(username: Reader, nonce: Reader, quick_login: number);
    serialize(): Reader;
}
export declare class UpdateRecoveryEmailInner {
    username: Reader;
    nonce: Reader;
    recovery_email: RecoveryEmail | null;
    constructor(username: Reader, nonce: Reader, recovery_email: RecoveryEmail | null);
    serialize(): Reader;
}
export {};
