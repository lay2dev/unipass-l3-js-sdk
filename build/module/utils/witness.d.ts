export function SerializeTxWitness(value: any): ArrayBuffer;
export function SerializeTxVec(value: any): ArrayBuffer;
export function SerializeTx(value: any): ArrayBuffer;
export function SerializeChildTxVec(value: any): ArrayBuffer;
export function SerializeChildTx(value: any): ArrayBufferLike;
export function SerializeRegisterChildTx(value: any): ArrayBuffer;
export function SerializeRegisterChildTxInner(value: any): ArrayBuffer;
export function SerializeAddLocalKeyChildTx(value: any): ArrayBuffer;
export function SerializeAddLocalKeyChildTxInner(value: any): ArrayBuffer;
export function SerializeAddLocalKeyChildTxSig(value: any): ArrayBufferLike;
export function SerializeAddLocalKeyByOldKey(value: any): ArrayBuffer;
export function SerializeAddLocalKeyByDoubleSign(value: any): ArrayBuffer;
export function SerializeDeleteLocalKeyChildTx(value: any): ArrayBuffer;
export function SerializeDeleteLocalKeyChildTxInner(value: any): ArrayBuffer;
export function SerializeUpdateRecoveryEmailChildTx(value: any): ArrayBuffer;
export function SerializeUpdateRecoveryEmailChildTxInner(value: any): ArrayBuffer;
export function SerializeUpdateQuickLoginChildTx(value: any): ArrayBuffer;
export function SerializeUpdateQuickLoginChildTxInner(value: any): ArrayBuffer;
export function SerializeUserInfo(value: any): ArrayBuffer;
export function SerializePendingState(value: any): ArrayBuffer;
export function SerializePendingStateOpt(value: any): ArrayBuffer;
export function SerializeTypeId(value: any): ArrayBuffer;
export function SerializeUserInfoOpt(value: any): ArrayBuffer;
export function SerializeRecoveryEmail(value: any): ArrayBuffer;
export function SerializeRecoveryEmailOpt(value: any): ArrayBuffer;
export function SerializeBytes20(value: any): ArrayBuffer;
export function SerializeBytes32(value: any): ArrayBuffer;
export function SerializeBytes256(value: any): ArrayBuffer;
export function SerializeUint32(value: any): ArrayBuffer;
export function SerializeBytes(value: any): ArrayBufferLike;
export function SerializeBytesOpt(value: any): ArrayBuffer;
export function SerializeBytes32Vec(value: any): ArrayBufferLike;
export function SerializeBytesVec(value: any): ArrayBuffer;
export function SerializeRsaPubkey(value: any): ArrayBuffer;
export function SerializeSecp256k1Pubkey(value: any): ArrayBuffer;
export function SerializeSecp256r1Pubkey(value: any): ArrayBuffer;
export function SerializePubkey(value: any): ArrayBufferLike;
export function SerializePubkeyVec(value: any): ArrayBuffer;
export class TxWitness {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getTxs(): TxVec;
    getUserInfoSmtProof(): Bytes;
    getEmailSmtProof(): BytesOpt;
}
export class TxVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): Tx;
}
export class Tx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getUsername(): Bytes32;
    getUserInfo(): UserInfoOpt;
    getChildTxs(): ChildTxVec;
}
export class ChildTxVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): ChildTx;
}
export class ChildTx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    unionType(): "RegisterChildTx" | "AddLocalKeyChildTx" | "DeleteLocalKeyChildTx" | "UpdateRecoveryEmailChildTx" | "UpdateQuickLoginChildTx";
    value(): RegisterChildTx | AddLocalKeyChildTx | DeleteLocalKeyChildTx | UpdateRecoveryEmailChildTx | UpdateQuickLoginChildTx;
}
export class RegisterChildTx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getInner(): RegisterChildTxInner;
    getSig(): Bytes;
    getEmailHeader(): Bytes;
}
export class RegisterChildTxInner {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getUsername(): Bytes32;
    getRegisterEmail(): Bytes32;
    getPubkey(): Pubkey;
    getRecoveryEmail(): RecoveryEmailOpt;
    getQuickLogin(): number;
    getSource(): Bytes;
}
export class AddLocalKeyChildTx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getInner(): AddLocalKeyChildTxInner;
    getSig(): AddLocalKeyChildTxSig;
}
export class AddLocalKeyChildTxInner {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getUsername(): Bytes32;
    getNonce(): Uint32;
    getPubkey(): Pubkey;
}
export class AddLocalKeyChildTxSig {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    unionType(): "AddLocalKeyByOldKey" | "AddLocalKeyByDoubleSign";
    value(): AddLocalKeyByOldKey | AddLocalKeyByDoubleSign;
}
export class AddLocalKeyByOldKey {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getOldKeySig(): Bytes;
    getNewKeySig(): Bytes;
}
export class AddLocalKeyByDoubleSign {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getEmailHeader(): BytesVec;
    getNewKeySig(): Bytes;
    getUnipassSig(): Bytes;
}
export class DeleteLocalKeyChildTx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getInner(): DeleteLocalKeyChildTxInner;
    getSig(): Bytes;
}
export class DeleteLocalKeyChildTxInner {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getUsername(): Bytes32;
    getNonce(): Uint32;
    getPubkey(): Pubkey;
}
export class UpdateRecoveryEmailChildTx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getInner(): UpdateRecoveryEmailChildTxInner;
    getSig(): Bytes;
}
export class UpdateRecoveryEmailChildTxInner {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getUsername(): Bytes32;
    getNonce(): Uint32;
    getRecoveryEmail(): RecoveryEmailOpt;
}
export class UpdateQuickLoginChildTx {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getInner(): UpdateQuickLoginChildTxInner;
    getSig(): Bytes;
}
export class UpdateQuickLoginChildTxInner {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getUsername(): Bytes32;
    getNonce(): Uint32;
    getQuickLogin(): number;
}
export class UserInfo {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getRegisterEmail(): Bytes32;
    getLocalKeys(): PubkeyVec;
    getQuickLogin(): number;
    getRecoveryEmail(): RecoveryEmailOpt;
    getPendingState(): PendingStateOpt;
    getNonce(): Uint32;
    getSource(): Bytes;
}
export class PendingState {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getPendingKey(): Pubkey;
    getTimeCell(): TypeId;
    getReplaceOld(): number;
}
export class PendingStateOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    value(): PendingState;
    hasValue(): boolean;
}
export class TypeId {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class UserInfoOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    value(): UserInfo;
    hasValue(): boolean;
}
export class RecoveryEmailOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    value(): RecoveryEmail;
    hasValue(): boolean;
}
export class Bytes20 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Bytes32 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Bytes256 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Uint32 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    toBigEndianUint32(): number;
    toLittleEndianUint32(): number;
}
export class Bytes {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    raw(): ArrayBuffer;
    indexAt(i: any): number;
    length(): number;
}
export class BytesOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    value(): Bytes;
    hasValue(): boolean;
}
export class Bytes32Vec {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): Bytes32;
    length(): number;
}
export class BytesVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): Bytes;
}
export class Secp256k1Pubkey {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Secp256r1Pubkey {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Pubkey {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    unionType(): "RsaPubkey" | "Secp256k1Pubkey" | "Secp256r1Pubkey";
    value(): RsaPubkey | Secp256k1Pubkey | Secp256r1Pubkey;
}
export class PubkeyVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): Pubkey;
}
declare class RecoveryEmail {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getThreshold(): number;
    getFirstN(): number;
    getEmails(): Bytes32Vec;
}
declare class RsaPubkey {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getE(): Uint32;
    getN(): Bytes256;
}
export {};
