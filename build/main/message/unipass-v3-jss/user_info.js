"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeBytesVec = exports.BytesVec = exports.SerializeBytes32Vec = exports.Bytes32Vec = exports.SerializeBytesOpt = exports.BytesOpt = exports.SerializeBytes = exports.Bytes = exports.SerializeUint32 = exports.Uint32 = exports.SerializeBytes256 = exports.Bytes256 = exports.SerializeBytes32 = exports.Bytes32 = exports.SerializeBytes20 = exports.Bytes20 = exports.SerializePubkeyVec = exports.PubkeyVec = exports.SerializePubkey = exports.Pubkey = exports.SerializeSecp256r1Pubkey = exports.Secp256r1Pubkey = exports.SerializeSecp256k1Pubkey = exports.Secp256k1Pubkey = exports.SerializeRsaPubkey = exports.RsaPubkey = exports.SerializeRecoveryEmailOpt = exports.RecoveryEmailOpt = exports.SerializeRecoveryEmail = exports.RecoveryEmail = exports.SerializeUserInfoOpt = exports.UserInfoOpt = exports.SerializeTypeId = exports.TypeId = exports.SerializePendingStateOpt = exports.PendingStateOpt = exports.SerializePendingState = exports.PendingState = exports.SerializeUserInfo = exports.UserInfo = void 0;
function dataLengthError(actual, required) {
    throw new Error(`Invalid data length! Required: ${required}, actual: ${actual}`);
}
function assertDataLength(actual, required) {
    if (actual !== required) {
        dataLengthError(actual, required);
    }
}
function assertArrayBuffer(reader) {
    if (reader instanceof Object && reader.toArrayBuffer instanceof Function) {
        reader = reader.toArrayBuffer();
    }
    if (!(reader instanceof ArrayBuffer)) {
        throw new Error("Provided value must be an ArrayBuffer or can be transformed into ArrayBuffer!");
    }
    return reader;
}
function verifyAndExtractOffsets(view, expectedFieldCount, compatible) {
    if (view.byteLength < 4) {
        dataLengthError(view.byteLength, ">4");
    }
    const requiredByteLength = view.getUint32(0, true);
    assertDataLength(view.byteLength, requiredByteLength);
    if (requiredByteLength === 4) {
        return [requiredByteLength];
    }
    if (requiredByteLength < 8) {
        dataLengthError(view.byteLength, ">8");
    }
    const firstOffset = view.getUint32(4, true);
    if (firstOffset % 4 !== 0 || firstOffset < 8) {
        throw new Error(`Invalid first offset: ${firstOffset}`);
    }
    const itemCount = firstOffset / 4 - 1;
    if (itemCount < expectedFieldCount) {
        throw new Error(`Item count not enough! Required: ${expectedFieldCount}, actual: ${itemCount}`);
    }
    else if ((!compatible) && itemCount > expectedFieldCount) {
        throw new Error(`Item count is more than required! Required: ${expectedFieldCount}, actual: ${itemCount}`);
    }
    if (requiredByteLength < firstOffset) {
        throw new Error(`First offset is larger than byte length: ${firstOffset}`);
    }
    const offsets = [];
    for (let i = 0; i < itemCount; i++) {
        const start = 4 + i * 4;
        offsets.push(view.getUint32(start, true));
    }
    offsets.push(requiredByteLength);
    for (let i = 0; i < offsets.length - 1; i++) {
        if (offsets[i] > offsets[i + 1]) {
            throw new Error(`Offset index ${i}: ${offsets[i]} is larger than offset index ${i + 1}: ${offsets[i + 1]}`);
        }
    }
    return offsets;
}
function serializeTable(buffers) {
    const itemCount = buffers.length;
    let totalSize = 4 * (itemCount + 1);
    const offsets = [];
    for (let i = 0; i < itemCount; i++) {
        offsets.push(totalSize);
        totalSize += buffers[i].byteLength;
    }
    const buffer = new ArrayBuffer(totalSize);
    const array = new Uint8Array(buffer);
    const view = new DataView(buffer);
    view.setUint32(0, totalSize, true);
    for (let i = 0; i < itemCount; i++) {
        view.setUint32(4 + i * 4, offsets[i], true);
        array.set(new Uint8Array(buffers[i]), offsets[i]);
    }
    return buffer;
}
class UserInfo {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new PubkeyVec(this.view.buffer.slice(offsets[1], offsets[2]), { validate: false }).validate();
        if (offsets[3] - offsets[2] !== 1) {
            throw new Error(`Invalid offset for quick_login: ${offsets[2]} - ${offsets[3]}`);
        }
        new RecoveryEmailOpt(this.view.buffer.slice(offsets[3], offsets[4]), { validate: false }).validate();
        new PendingStateOpt(this.view.buffer.slice(offsets[4], offsets[5]), { validate: false }).validate();
        new Uint32(this.view.buffer.slice(offsets[5], offsets[6]), { validate: false }).validate();
        new Bytes(this.view.buffer.slice(offsets[6], offsets[7]), { validate: false }).validate();
    }
    getRegisterEmail() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getLocalKeys() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new PubkeyVec(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getQuickLogin() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new DataView(this.view.buffer.slice(offset, offset_end)).getUint8(0);
    }
    getRecoveryEmail() {
        const start = 16;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new RecoveryEmailOpt(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getPendingState() {
        const start = 20;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new PendingStateOpt(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getNonce() {
        const start = 24;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSource() {
        const start = 28;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
exports.UserInfo = UserInfo;
function SerializeUserInfo(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.register_email));
    buffers.push(SerializePubkeyVec(value.local_keys));
    const quickLoginView = new DataView(new ArrayBuffer(1));
    quickLoginView.setUint8(0, value.quick_login);
    buffers.push(quickLoginView.buffer);
    buffers.push(SerializeRecoveryEmailOpt(value.recovery_email));
    buffers.push(SerializePendingStateOpt(value.pending_state));
    buffers.push(SerializeUint32(value.nonce));
    buffers.push(SerializeBytes(value.source));
    return serializeTable(buffers);
}
exports.SerializeUserInfo = SerializeUserInfo;
class PendingState {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Pubkey(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new TypeId(this.view.buffer.slice(offsets[1], offsets[2]), { validate: false }).validate();
        if (offsets[3] - offsets[2] !== 1) {
            throw new Error(`Invalid offset for replace_old: ${offsets[2]} - ${offsets[3]}`);
        }
    }
    getPendingKey() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Pubkey(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getTimeCell() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new TypeId(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getReplaceOld() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new DataView(this.view.buffer.slice(offset, offset_end)).getUint8(0);
    }
}
exports.PendingState = PendingState;
function SerializePendingState(value) {
    const buffers = [];
    buffers.push(SerializePubkey(value.pending_key));
    buffers.push(SerializeTypeId(value.time_cell));
    const replaceOldView = new DataView(new ArrayBuffer(1));
    replaceOldView.setUint8(0, value.replace_old);
    buffers.push(replaceOldView.buffer);
    return serializeTable(buffers);
}
exports.SerializePendingState = SerializePendingState;
class PendingStateOpt {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.hasValue()) {
            this.value().validate(compatible);
        }
    }
    value() {
        return new PendingState(this.view.buffer, { validate: false });
    }
    hasValue() {
        return this.view.byteLength > 0;
    }
}
exports.PendingStateOpt = PendingStateOpt;
function SerializePendingStateOpt(value) {
    if (value) {
        return SerializePendingState(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
exports.SerializePendingStateOpt = SerializePendingStateOpt;
class TypeId {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 32);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    static size() {
        return 32;
    }
}
exports.TypeId = TypeId;
function SerializeTypeId(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 32);
    return buffer;
}
exports.SerializeTypeId = SerializeTypeId;
class UserInfoOpt {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.hasValue()) {
            this.value().validate(compatible);
        }
    }
    value() {
        return new UserInfo(this.view.buffer, { validate: false });
    }
    hasValue() {
        return this.view.byteLength > 0;
    }
}
exports.UserInfoOpt = UserInfoOpt;
function SerializeUserInfoOpt(value) {
    if (value) {
        return SerializeUserInfo(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
exports.SerializeUserInfoOpt = SerializeUserInfoOpt;
class RecoveryEmail {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        if (offsets[1] - offsets[0] !== 1) {
            throw new Error(`Invalid offset for threshold: ${offsets[0]} - ${offsets[1]}`);
        }
        if (offsets[2] - offsets[1] !== 1) {
            throw new Error(`Invalid offset for first_n: ${offsets[1]} - ${offsets[2]}`);
        }
        new Bytes32Vec(this.view.buffer.slice(offsets[2], offsets[3]), { validate: false }).validate();
    }
    getThreshold() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new DataView(this.view.buffer.slice(offset, offset_end)).getUint8(0);
    }
    getFirstN() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new DataView(this.view.buffer.slice(offset, offset_end)).getUint8(0);
    }
    getEmails() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes32Vec(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
exports.RecoveryEmail = RecoveryEmail;
function SerializeRecoveryEmail(value) {
    const buffers = [];
    const thresholdView = new DataView(new ArrayBuffer(1));
    thresholdView.setUint8(0, value.threshold);
    buffers.push(thresholdView.buffer);
    const firstNView = new DataView(new ArrayBuffer(1));
    firstNView.setUint8(0, value.first_n);
    buffers.push(firstNView.buffer);
    buffers.push(SerializeBytes32Vec(value.emails));
    return serializeTable(buffers);
}
exports.SerializeRecoveryEmail = SerializeRecoveryEmail;
class RecoveryEmailOpt {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.hasValue()) {
            this.value().validate(compatible);
        }
    }
    value() {
        return new RecoveryEmail(this.view.buffer, { validate: false });
    }
    hasValue() {
        return this.view.byteLength > 0;
    }
}
exports.RecoveryEmailOpt = RecoveryEmailOpt;
function SerializeRecoveryEmailOpt(value) {
    if (value) {
        return SerializeRecoveryEmail(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
exports.SerializeRecoveryEmailOpt = SerializeRecoveryEmailOpt;
class RsaPubkey {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Uint32(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new Bytes256(this.view.buffer.slice(offsets[1], offsets[2]), { validate: false }).validate();
    }
    getE() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getN() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes256(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
exports.RsaPubkey = RsaPubkey;
function SerializeRsaPubkey(value) {
    const buffers = [];
    buffers.push(SerializeUint32(value.e));
    buffers.push(SerializeBytes256(value.n));
    return serializeTable(buffers);
}
exports.SerializeRsaPubkey = SerializeRsaPubkey;
class Secp256k1Pubkey {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 20);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    static size() {
        return 20;
    }
}
exports.Secp256k1Pubkey = Secp256k1Pubkey;
function SerializeSecp256k1Pubkey(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 20);
    return buffer;
}
exports.SerializeSecp256k1Pubkey = SerializeSecp256k1Pubkey;
class Secp256r1Pubkey {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 64);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    static size() {
        return 64;
    }
}
exports.Secp256r1Pubkey = Secp256r1Pubkey;
function SerializeSecp256r1Pubkey(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 64);
    return buffer;
}
exports.SerializeSecp256r1Pubkey = SerializeSecp256r1Pubkey;
class Pubkey {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.view.byteLength < 4) {
            assertDataLength(this.view.byteLength, ">4");
        }
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                new RsaPubkey(this.view.buffer.slice(4), { validate: false }).validate();
                break;
            case 1:
                new Secp256k1Pubkey(this.view.buffer.slice(4), { validate: false }).validate();
                break;
            case 2:
                new Secp256r1Pubkey(this.view.buffer.slice(4), { validate: false }).validate();
                break;
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    unionType() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return "RsaPubkey";
            case 1:
                return "Secp256k1Pubkey";
            case 2:
                return "Secp256r1Pubkey";
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    value() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return new RsaPubkey(this.view.buffer.slice(4), { validate: false });
            case 1:
                return new Secp256k1Pubkey(this.view.buffer.slice(4), { validate: false });
            case 2:
                return new Secp256r1Pubkey(this.view.buffer.slice(4), { validate: false });
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
}
exports.Pubkey = Pubkey;
function SerializePubkey(value) {
    switch (value.type) {
        case "RsaPubkey":
            {
                const itemBuffer = SerializeRsaPubkey(value.value);
                const array = new Uint8Array(4 + itemBuffer.byteLength);
                const view = new DataView(array.buffer);
                view.setUint32(0, 0, true);
                array.set(new Uint8Array(itemBuffer), 4);
                return array.buffer;
            }
        case "Secp256k1Pubkey":
            {
                const itemBuffer = SerializeSecp256k1Pubkey(value.value);
                const array = new Uint8Array(4 + itemBuffer.byteLength);
                const view = new DataView(array.buffer);
                view.setUint32(0, 1, true);
                array.set(new Uint8Array(itemBuffer), 4);
                return array.buffer;
            }
        case "Secp256r1Pubkey":
            {
                const itemBuffer = SerializeSecp256r1Pubkey(value.value);
                const array = new Uint8Array(4 + itemBuffer.byteLength);
                const view = new DataView(array.buffer);
                view.setUint32(0, 2, true);
                array.set(new Uint8Array(itemBuffer), 4);
                return array.buffer;
            }
        default:
            throw new Error(`Invalid type: ${value.type}`);
    }
}
exports.SerializePubkey = SerializePubkey;
class PubkeyVec {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        for (let i = 0; i < offsets.length - 1; i++) {
            new Pubkey(this.view.buffer.slice(offsets[i], offsets[i + 1]), { validate: false }).validate();
        }
    }
    length() {
        if (this.view.byteLength < 8) {
            return 0;
        }
        else {
            return this.view.getUint32(4, true) / 4 - 1;
        }
    }
    indexAt(i) {
        const start = 4 + i * 4;
        const offset = this.view.getUint32(start, true);
        let offset_end = this.view.byteLength;
        if (i + 1 < this.length()) {
            offset_end = this.view.getUint32(start + 4, true);
        }
        return new Pubkey(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
exports.PubkeyVec = PubkeyVec;
function SerializePubkeyVec(value) {
    return serializeTable(value.map(item => SerializePubkey(item)));
}
exports.SerializePubkeyVec = SerializePubkeyVec;
class Bytes20 {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 20);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    static size() {
        return 20;
    }
}
exports.Bytes20 = Bytes20;
function SerializeBytes20(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 20);
    return buffer;
}
exports.SerializeBytes20 = SerializeBytes20;
class Bytes32 {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 32);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    static size() {
        return 32;
    }
}
exports.Bytes32 = Bytes32;
function SerializeBytes32(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 32);
    return buffer;
}
exports.SerializeBytes32 = SerializeBytes32;
class Bytes256 {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 256);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    static size() {
        return 256;
    }
}
exports.Bytes256 = Bytes256;
function SerializeBytes256(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 256);
    return buffer;
}
exports.SerializeBytes256 = SerializeBytes256;
class Uint32 {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        assertDataLength(this.view.byteLength, 4);
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    raw() {
        return this.view.buffer;
    }
    toBigEndianUint32() {
        return this.view.getUint32(0, false);
    }
    toLittleEndianUint32() {
        return this.view.getUint32(0, true);
    }
    static size() {
        return 4;
    }
}
exports.Uint32 = Uint32;
function SerializeUint32(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 4);
    return buffer;
}
exports.SerializeUint32 = SerializeUint32;
class Bytes {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.view.byteLength < 4) {
            dataLengthError(this.view.byteLength, ">4");
        }
        const requiredByteLength = this.length() + 4;
        assertDataLength(this.view.byteLength, requiredByteLength);
    }
    raw() {
        return this.view.buffer.slice(4);
    }
    indexAt(i) {
        return this.view.getUint8(4 + i);
    }
    length() {
        return this.view.getUint32(0, true);
    }
}
exports.Bytes = Bytes;
function SerializeBytes(value) {
    const item = assertArrayBuffer(value);
    const array = new Uint8Array(4 + item.byteLength);
    (new DataView(array.buffer)).setUint32(0, item.byteLength, true);
    array.set(new Uint8Array(item), 4);
    return array.buffer;
}
exports.SerializeBytes = SerializeBytes;
class BytesOpt {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.hasValue()) {
            this.value().validate(compatible);
        }
    }
    value() {
        return new Bytes(this.view.buffer, { validate: false });
    }
    hasValue() {
        return this.view.byteLength > 0;
    }
}
exports.BytesOpt = BytesOpt;
function SerializeBytesOpt(value) {
    if (value) {
        return SerializeBytes(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
exports.SerializeBytesOpt = SerializeBytesOpt;
class Bytes32Vec {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.view.byteLength < 4) {
            dataLengthError(this.view.byteLength, ">4");
        }
        const requiredByteLength = this.length() * Bytes32.size() + 4;
        assertDataLength(this.view.byteLength, requiredByteLength);
        for (let i = 0; i < 0; i++) {
            const item = this.indexAt(i);
            item.validate(compatible);
        }
    }
    indexAt(i) {
        return new Bytes32(this.view.buffer.slice(4 + i * Bytes32.size(), 4 + (i + 1) * Bytes32.size()), { validate: false });
    }
    length() {
        return this.view.getUint32(0, true);
    }
}
exports.Bytes32Vec = Bytes32Vec;
function SerializeBytes32Vec(value) {
    const array = new Uint8Array(4 + Bytes32.size() * value.length);
    (new DataView(array.buffer)).setUint32(0, value.length, true);
    for (let i = 0; i < value.length; i++) {
        const itemBuffer = SerializeBytes32(value[i]);
        array.set(new Uint8Array(itemBuffer), 4 + i * Bytes32.size());
    }
    return array.buffer;
}
exports.SerializeBytes32Vec = SerializeBytes32Vec;
class BytesVec {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        for (let i = 0; i < offsets.length - 1; i++) {
            new Bytes(this.view.buffer.slice(offsets[i], offsets[i + 1]), { validate: false }).validate();
        }
    }
    length() {
        if (this.view.byteLength < 8) {
            return 0;
        }
        else {
            return this.view.getUint32(4, true) / 4 - 1;
        }
    }
    indexAt(i) {
        const start = 4 + i * 4;
        const offset = this.view.getUint32(start, true);
        let offset_end = this.view.byteLength;
        if (i + 1 < this.length()) {
            offset_end = this.view.getUint32(start + 4, true);
        }
        return new Bytes(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
exports.BytesVec = BytesVec;
function SerializeBytesVec(value) {
    return serializeTable(value.map(item => SerializeBytes(item)));
}
exports.SerializeBytesVec = SerializeBytesVec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21lc3NhZ2UvdW5pcGFzcy12My1qc3MvdXNlcl9pbmZvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLFFBQVEsYUFBYSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQ3hDLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUN2QixlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25DO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsTUFBTTtJQUMvQixJQUFJLE1BQU0sWUFBWSxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsWUFBWSxRQUFRLEVBQUU7UUFDeEUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNqQztJQUNELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUMsRUFBRTtRQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7S0FDbEc7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsVUFBVTtJQUNuRSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFD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LElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlGLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDakY7UUFDRCxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNGLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFD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