"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializePubkeyVec = exports.PubkeyVec = exports.SerializePubkey = exports.Pubkey = exports.SerializeSecp256r1Pubkey = exports.Secp256r1Pubkey = exports.SerializeSecp256k1Pubkey = exports.Secp256k1Pubkey = exports.SerializeRsaPubkey = exports.RsaPubkey = exports.SerializeBytesVec = exports.BytesVec = exports.SerializeBytes32Vec = exports.Bytes32Vec = exports.SerializeBytesOpt = exports.BytesOpt = exports.SerializeBytes = exports.Bytes = exports.SerializeUint32 = exports.Uint32 = exports.SerializeBytes256 = exports.Bytes256 = exports.SerializeBytes32 = exports.Bytes32 = exports.SerializeBytes20 = exports.Bytes20 = exports.SerializeRecoveryEmailOpt = exports.RecoveryEmailOpt = exports.SerializeRecoveryEmail = exports.RecoveryEmail = exports.SerializeUserInfoOpt = exports.UserInfoOpt = exports.SerializeTypeId = exports.TypeId = exports.SerializePendingStateOpt = exports.PendingStateOpt = exports.SerializePendingState = exports.PendingState = exports.SerializeUserInfo = exports.UserInfo = exports.SerializeAssetLockWitness = exports.AssetLockWitness = void 0;
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
class AssetLockWitness {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Pubkey(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), { validate: false }).validate();
        new UserInfo(this.view.buffer.slice(offsets[2], offsets[3]), { validate: false }).validate();
        new Bytes(this.view.buffer.slice(offsets[3], offsets[4]), { validate: false }).validate();
    }
    getPubkey() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Pubkey(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getUserInfo() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new UserInfo(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getUserInfoSmtProof() {
        const start = 16;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
exports.AssetLockWitness = AssetLockWitness;
function SerializeAssetLockWitness(value) {
    const buffers = [];
    buffers.push(SerializePubkey(value.pubkey));
    buffers.push(SerializeBytes(value.sig));
    buffers.push(SerializeUserInfo(value.user_info));
    buffers.push(SerializeBytes(value.user_info_smt_proof));
    return serializeTable(buffers);
}
exports.SerializeAssetLockWitness = SerializeAssetLockWitness;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRfbG9ja193aXRuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21lc3NhZ2UvdW5pcGFzcy12My1qc3MvYXNzZXRfbG9ja193aXRuZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLFFBQVEsYUFBYSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQ3hDLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUN2QixlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25DO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsTUFBTTtJQUMvQixJQUFJLE1BQU0sWUFBWSxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsWUFBWSxRQUFRLEVBQUU7UUFDeEUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNqQztJQUNELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUMsRUFBRTtRQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7S0FDbEc7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsVUFBVTtJQUNuRSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFB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LEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDMUYsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdGLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1RixDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsTUFBTTtRQUNKLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJ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SyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNGLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvRixDQUFDO0lBRUQsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFF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