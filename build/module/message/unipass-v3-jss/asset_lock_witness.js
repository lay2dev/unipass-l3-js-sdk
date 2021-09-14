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
export class AssetLockWitness {
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
export function SerializeAssetLockWitness(value) {
    const buffers = [];
    buffers.push(SerializePubkey(value.pubkey));
    buffers.push(SerializeBytes(value.sig));
    buffers.push(SerializeUserInfo(value.user_info));
    buffers.push(SerializeBytes(value.user_info_smt_proof));
    return serializeTable(buffers);
}
export class UserInfo {
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
export function SerializeUserInfo(value) {
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
export class PendingState {
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
export function SerializePendingState(value) {
    const buffers = [];
    buffers.push(SerializePubkey(value.pending_key));
    buffers.push(SerializeTypeId(value.time_cell));
    const replaceOldView = new DataView(new ArrayBuffer(1));
    replaceOldView.setUint8(0, value.replace_old);
    buffers.push(replaceOldView.buffer);
    return serializeTable(buffers);
}
export class PendingStateOpt {
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
export function SerializePendingStateOpt(value) {
    if (value) {
        return SerializePendingState(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
export class TypeId {
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
export function SerializeTypeId(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 32);
    return buffer;
}
export class UserInfoOpt {
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
export function SerializeUserInfoOpt(value) {
    if (value) {
        return SerializeUserInfo(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
export class RecoveryEmail {
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
export function SerializeRecoveryEmail(value) {
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
export class RecoveryEmailOpt {
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
export function SerializeRecoveryEmailOpt(value) {
    if (value) {
        return SerializeRecoveryEmail(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
export class Bytes20 {
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
export function SerializeBytes20(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 20);
    return buffer;
}
export class Bytes32 {
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
export function SerializeBytes32(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 32);
    return buffer;
}
export class Bytes256 {
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
export function SerializeBytes256(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 256);
    return buffer;
}
export class Uint32 {
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
export function SerializeUint32(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 4);
    return buffer;
}
export class Bytes {
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
export function SerializeBytes(value) {
    const item = assertArrayBuffer(value);
    const array = new Uint8Array(4 + item.byteLength);
    (new DataView(array.buffer)).setUint32(0, item.byteLength, true);
    array.set(new Uint8Array(item), 4);
    return array.buffer;
}
export class BytesOpt {
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
export function SerializeBytesOpt(value) {
    if (value) {
        return SerializeBytes(value);
    }
    else {
        return new ArrayBuffer(0);
    }
}
export class Bytes32Vec {
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
export function SerializeBytes32Vec(value) {
    const array = new Uint8Array(4 + Bytes32.size() * value.length);
    (new DataView(array.buffer)).setUint32(0, value.length, true);
    for (let i = 0; i < value.length; i++) {
        const itemBuffer = SerializeBytes32(value[i]);
        array.set(new Uint8Array(itemBuffer), 4 + i * Bytes32.size());
    }
    return array.buffer;
}
export class BytesVec {
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
export function SerializeBytesVec(value) {
    return serializeTable(value.map(item => SerializeBytes(item)));
}
export class RsaPubkey {
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
export function SerializeRsaPubkey(value) {
    const buffers = [];
    buffers.push(SerializeUint32(value.e));
    buffers.push(SerializeBytes256(value.n));
    return serializeTable(buffers);
}
export class Secp256k1Pubkey {
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
export function SerializeSecp256k1Pubkey(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 20);
    return buffer;
}
export class Secp256r1Pubkey {
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
export function SerializeSecp256r1Pubkey(value) {
    const buffer = assertArrayBuffer(value);
    assertDataLength(buffer.byteLength, 64);
    return buffer;
}
export class Pubkey {
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
export function SerializePubkey(value) {
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
export class PubkeyVec {
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
export function SerializePubkeyVec(value) {
    return serializeTable(value.map(item => SerializePubkey(item)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRfbG9ja193aXRuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21lc3NhZ2UvdW5pcGFzcy12My1qc3MvYXNzZXRfbG9ja193aXRuZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLFFBQVEsYUFBYSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQ3hDLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUN2QixlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25DO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsTUFBTTtJQUMvQixJQUFJLE1BQU0sWUFBWSxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsWUFBWSxRQUFRLEVBQUU7UUFDeEUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNqQztJQUNELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUMsRUFBRTtRQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7S0FDbEc7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsVUFBVTtJQUNuRSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxF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