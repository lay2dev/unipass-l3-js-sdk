export declare class UserInfo {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    getRegisterEmail(): Bytes32;
    getLocalKeys(): PubkeyVec;
    getQuickLogin(): number;
    getRecoveryEmail(): Bytes32;
    getPendingState(): PendingState;
    getNonce(): Uint32;
}
export declare function SerializeUserInfo(value: any): ArrayBuffer;
export declare class PendingState {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    getPendingKey(): Pubkey;
    getTimeCell(): TypeId;
    getReplaceOld(): number;
}
export declare function SerializePendingState(value: any): ArrayBuffer;
export declare class TypeId {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    static size(): number;
}
export declare function SerializeTypeId(value: any): ArrayBuffer;
export declare class UserInfoOpt {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    value(): UserInfo;
    hasValue(): boolean;
}
export declare function SerializeUserInfoOpt(value: any): ArrayBuffer;
export declare class RsaPubkey {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    getE(): Uint32;
    getN(): Bytes256;
}
export declare function SerializeRsaPubkey(value: any): ArrayBuffer;
export declare class Secp256k1Pubkey {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    static size(): number;
}
export declare function SerializeSecp256k1Pubkey(value: any): ArrayBuffer;
export declare class Secp256r1Pubkey {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    static size(): number;
}
export declare function SerializeSecp256r1Pubkey(value: any): ArrayBuffer;
export declare class Pubkey {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    unionType(): "RsaPubkey" | "Secp256k1Pubkey" | "Secp256r1Pubkey";
    value(): RsaPubkey | Secp256k1Pubkey | Secp256r1Pubkey;
}
export declare function SerializePubkey(value: any): ArrayBufferLike;
export declare class PubkeyVec {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): Pubkey;
}
export declare function SerializePubkeyVec(value: any): ArrayBuffer;
export declare class Bytes32 {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    static size(): number;
}
export declare function SerializeBytes32(value: any): ArrayBuffer;
export declare class Bytes256 {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    static size(): number;
}
export declare function SerializeBytes256(value: any): ArrayBuffer;
export declare class Uint32 {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    toBigEndianUint32(): number;
    toLittleEndianUint32(): number;
    static size(): number;
}
export declare function SerializeUint32(value: any): ArrayBuffer;
export declare class Bytes {
    view: DataView;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    validate(compatible?: boolean): void;
    raw(): ArrayBuffer;
    indexAt(i: any): number;
    length(): number;
}
export declare function SerializeBytes(value: any): ArrayBufferLike;
export declare const userInfo: {
    SerializeUserInfo: typeof SerializeUserInfo;
};
