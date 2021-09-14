export function SerializeCellData(value: any): ArrayBufferLike;
export function SerializeEmailCellData(value: any): ArrayBuffer;
export function SerializeUserInfoCellData(value: any): ArrayBuffer;
export function SerializeBytes20(value: any): ArrayBuffer;
export function SerializeBytes32(value: any): ArrayBuffer;
export function SerializeBytes256(value: any): ArrayBuffer;
export function SerializeUint32(value: any): ArrayBuffer;
export function SerializeBytes(value: any): ArrayBufferLike;
export function SerializeBytesOpt(value: any): ArrayBuffer;
export function SerializeBytes32Vec(value: any): ArrayBufferLike;
export function SerializeBytesVec(value: any): ArrayBuffer;
export class CellData {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    unionType(): "EmailCellData" | "UserInfoCellData";
    value(): EmailCellData | UserInfoCellData;
}
export class EmailCellData {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getSmtRoot(): Bytes32;
}
export class UserInfoCellData {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getSmtRoot(): Bytes32;
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
