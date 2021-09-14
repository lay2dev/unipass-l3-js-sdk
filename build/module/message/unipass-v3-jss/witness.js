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
        throw new Error('Provided value must be an ArrayBuffer or can be transformed into ArrayBuffer!');
    }
    return reader;
}
function verifyAndExtractOffsets(view, expectedFieldCount, compatible) {
    if (view.byteLength < 4) {
        dataLengthError(view.byteLength, '>4');
    }
    const requiredByteLength = view.getUint32(0, true);
    assertDataLength(view.byteLength, requiredByteLength);
    if (requiredByteLength === 4) {
        return [requiredByteLength];
    }
    if (requiredByteLength < 8) {
        dataLengthError(view.byteLength, '>8');
    }
    const firstOffset = view.getUint32(4, true);
    if (firstOffset % 4 !== 0 || firstOffset < 8) {
        throw new Error(`Invalid first offset: ${firstOffset}`);
    }
    const itemCount = firstOffset / 4 - 1;
    if (itemCount < expectedFieldCount) {
        throw new Error(`Item count not enough! Required: ${expectedFieldCount}, actual: ${itemCount}`);
    }
    else if (!compatible && itemCount > expectedFieldCount) {
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
export class TxWitness {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new TxVec(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new BytesOpt(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getTxs() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new TxVec(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getUserInfoSmtProof() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getEmailSmtProof() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new BytesOpt(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeTxWitness(value) {
    const buffers = [];
    buffers.push(SerializeTxVec(value.txs));
    buffers.push(SerializeBytes(value.user_info_smt_proof));
    buffers.push(SerializeBytesOpt(value.email_smt_proof));
    return serializeTable(buffers);
}
export class TxVec {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        for (let i = 0; i < offsets.length - 1; i++) {
            new Tx(this.view.buffer.slice(offsets[i], offsets[i + 1]), {
                validate: false,
            }).validate();
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
        return new Tx(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeTxVec(value) {
    return serializeTable(value.map(item => SerializeTx(item)));
}
export class Tx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new UserInfoOpt(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new ChildTxVec(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getUsername() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getUserInfo() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new UserInfoOpt(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getChildTxs() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new ChildTxVec(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeTx(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.username));
    buffers.push(SerializeUserInfoOpt(value.user_info));
    buffers.push(SerializeChildTxVec(value.child_txs));
    return serializeTable(buffers);
}
export class ChildTxVec {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        for (let i = 0; i < offsets.length - 1; i++) {
            new ChildTx(this.view.buffer.slice(offsets[i], offsets[i + 1]), {
                validate: false,
            }).validate();
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
        return new ChildTx(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeChildTxVec(value) {
    return serializeTable(value.map(item => SerializeChildTx(item)));
}
export class ChildTx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.view.byteLength < 4) {
            assertDataLength(this.view.byteLength, '>4');
        }
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                new RegisterChildTx(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            case 1:
                new AddLocalKeyChildTx(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            case 2:
                new DeleteLocalKeyChildTx(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            case 3:
                new UpdateRecoveryEmailChildTx(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            case 4:
                new UpdateQuickLoginChildTx(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    unionType() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return 'RegisterChildTx';
            case 1:
                return 'AddLocalKeyChildTx';
            case 2:
                return 'DeleteLocalKeyChildTx';
            case 3:
                return 'UpdateRecoveryEmailChildTx';
            case 4:
                return 'UpdateQuickLoginChildTx';
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    value() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return new RegisterChildTx(this.view.buffer.slice(4), {
                    validate: false,
                });
            case 1:
                return new AddLocalKeyChildTx(this.view.buffer.slice(4), {
                    validate: false,
                });
            case 2:
                return new DeleteLocalKeyChildTx(this.view.buffer.slice(4), {
                    validate: false,
                });
            case 3:
                return new UpdateRecoveryEmailChildTx(this.view.buffer.slice(4), {
                    validate: false,
                });
            case 4:
                return new UpdateQuickLoginChildTx(this.view.buffer.slice(4), {
                    validate: false,
                });
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
}
export function SerializeChildTx(value) {
    switch (value.type) {
        case 'RegisterChildTx': {
            const itemBuffer = SerializeRegisterChildTx(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 0, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'AddLocalKeyChildTx': {
            const itemBuffer = SerializeAddLocalKeyChildTx(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 1, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'DeleteLocalKeyChildTx': {
            const itemBuffer = SerializeDeleteLocalKeyChildTx(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 2, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'UpdateRecoveryEmailChildTx': {
            const itemBuffer = SerializeUpdateRecoveryEmailChildTx(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 3, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'UpdateQuickLoginChildTx': {
            const itemBuffer = SerializeUpdateQuickLoginChildTx(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 4, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        default:
            throw new Error(`Invalid type: ${value.type}`);
    }
}
export class RegisterChildTx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new RegisterChildTxInner(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getInner() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new RegisterChildTxInner(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getEmailHeader() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeRegisterChildTx(value) {
    const buffers = [];
    buffers.push(SerializeRegisterChildTxInner(value.inner));
    buffers.push(SerializeBytes(value.sig));
    buffers.push(SerializeBytes(value.email_header));
    return serializeTable(buffers);
}
export class RegisterChildTxInner {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Bytes32(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new Pubkey(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
        new RecoveryEmailOpt(this.view.buffer.slice(offsets[3], offsets[4]), {
            validate: false,
        }).validate();
        if (offsets[5] - offsets[4] !== 1) {
            throw new Error(`Invalid offset for quick_login: ${offsets[4]} - ${offsets[5]}`);
        }
        new Bytes(this.view.buffer.slice(offsets[5], offsets[6]), {
            validate: false,
        }).validate();
    }
    getUsername() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getRegisterEmail() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getPubkey() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Pubkey(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getRecoveryEmail() {
        const start = 16;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new RecoveryEmailOpt(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getQuickLogin() {
        const start = 20;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new DataView(this.view.buffer.slice(offset, offset_end)).getUint8(0);
    }
    getSource() {
        const start = 24;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeRegisterChildTxInner(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.username));
    buffers.push(SerializeBytes32(value.register_email));
    buffers.push(SerializePubkey(value.pubkey));
    buffers.push(SerializeRecoveryEmailOpt(value.recovery_email));
    const quickLoginView = new DataView(new ArrayBuffer(1));
    quickLoginView.setUint8(0, value.quick_login);
    buffers.push(quickLoginView.buffer);
    buffers.push(SerializeBytes(value.source));
    return serializeTable(buffers);
}
export class AddLocalKeyChildTx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new AddLocalKeyChildTxInner(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new AddLocalKeyChildTxSig(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
    }
    getInner() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new AddLocalKeyChildTxInner(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new AddLocalKeyChildTxSig(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
}
export function SerializeAddLocalKeyChildTx(value) {
    const buffers = [];
    buffers.push(SerializeAddLocalKeyChildTxInner(value.inner));
    buffers.push(SerializeAddLocalKeyChildTxSig(value.sig));
    return serializeTable(buffers);
}
export class AddLocalKeyChildTxInner {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Uint32(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new Pubkey(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getUsername() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNonce() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getPubkey() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Pubkey(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeAddLocalKeyChildTxInner(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.username));
    buffers.push(SerializeUint32(value.nonce));
    buffers.push(SerializePubkey(value.pubkey));
    return serializeTable(buffers);
}
export class AddLocalKeyChildTxSig {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        if (this.view.byteLength < 4) {
            assertDataLength(this.view.byteLength, '>4');
        }
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                new AddLocalKeyByOldKey(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            case 1:
                new AddLocalKeyByDoubleSign(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    unionType() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return 'AddLocalKeyByOldKey';
            case 1:
                return 'AddLocalKeyByDoubleSign';
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    value() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return new AddLocalKeyByOldKey(this.view.buffer.slice(4), {
                    validate: false,
                });
            case 1:
                return new AddLocalKeyByDoubleSign(this.view.buffer.slice(4), {
                    validate: false,
                });
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
}
export function SerializeAddLocalKeyChildTxSig(value) {
    switch (value.type) {
        case 'AddLocalKeyByOldKey': {
            const itemBuffer = SerializeAddLocalKeyByOldKey(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 0, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'AddLocalKeyByDoubleSign': {
            const itemBuffer = SerializeAddLocalKeyByDoubleSign(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 1, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        default:
            throw new Error(`Invalid type: ${value.type}`);
    }
}
export class AddLocalKeyByOldKey {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
    }
    getOldKeySig() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNewKeySig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeAddLocalKeyByOldKey(value) {
    const buffers = [];
    buffers.push(SerializeBytes(value.old_key_sig));
    buffers.push(SerializeBytes(value.new_key_sig));
    return serializeTable(buffers);
}
export class AddLocalKeyByDoubleSign {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new BytesVec(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getEmailHeader() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new BytesVec(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNewKeySig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getUnipassSig() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeAddLocalKeyByDoubleSign(value) {
    const buffers = [];
    buffers.push(SerializeBytesVec(value.email_header));
    buffers.push(SerializeBytes(value.new_key_sig));
    buffers.push(SerializeBytes(value.unipass_sig));
    return serializeTable(buffers);
}
export class DeleteLocalKeyChildTx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new DeleteLocalKeyChildTxInner(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
    }
    getInner() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new DeleteLocalKeyChildTxInner(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeDeleteLocalKeyChildTx(value) {
    const buffers = [];
    buffers.push(SerializeDeleteLocalKeyChildTxInner(value.inner));
    buffers.push(SerializeBytes(value.sig));
    return serializeTable(buffers);
}
export class DeleteLocalKeyChildTxInner {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Uint32(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new Pubkey(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getUsername() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNonce() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getPubkey() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Pubkey(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeDeleteLocalKeyChildTxInner(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.username));
    buffers.push(SerializeUint32(value.nonce));
    buffers.push(SerializePubkey(value.pubkey));
    return serializeTable(buffers);
}
export class UpdateRecoveryEmailChildTx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new UpdateRecoveryEmailChildTxInner(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
    }
    getInner() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new UpdateRecoveryEmailChildTxInner(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeUpdateRecoveryEmailChildTx(value) {
    const buffers = [];
    buffers.push(SerializeUpdateRecoveryEmailChildTxInner(value.inner));
    buffers.push(SerializeBytes(value.sig));
    return serializeTable(buffers);
}
export class UpdateRecoveryEmailChildTxInner {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Uint32(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        new RecoveryEmailOpt(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
    }
    getUsername() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNonce() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getRecoveryEmail() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new RecoveryEmailOpt(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeUpdateRecoveryEmailChildTxInner(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.username));
    buffers.push(SerializeUint32(value.nonce));
    buffers.push(SerializeRecoveryEmailOpt(value.recovery_email));
    return serializeTable(buffers);
}
export class UpdateQuickLoginChildTx {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new UpdateQuickLoginChildTxInner(this.view.buffer.slice(offsets[0], offsets[1]), { validate: false }).validate();
        new Bytes(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
    }
    getInner() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new UpdateQuickLoginChildTxInner(this.view.buffer.slice(offset, offset_end), { validate: false });
    }
    getSig() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializeUpdateQuickLoginChildTx(value) {
    const buffers = [];
    buffers.push(SerializeUpdateQuickLoginChildTxInner(value.inner));
    buffers.push(SerializeBytes(value.sig));
    return serializeTable(buffers);
}
export class UpdateQuickLoginChildTxInner {
    constructor(reader, { validate = true } = {}) {
        this.view = new DataView(assertArrayBuffer(reader));
        if (validate) {
            this.validate();
        }
    }
    validate(compatible = false) {
        const offsets = verifyAndExtractOffsets(this.view, 0, true);
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Uint32(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        if (offsets[3] - offsets[2] !== 1) {
            throw new Error(`Invalid offset for quick_login: ${offsets[2]} - ${offsets[3]}`);
        }
    }
    getUsername() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNonce() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getQuickLogin() {
        const start = 12;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new DataView(this.view.buffer.slice(offset, offset_end)).getUint8(0);
    }
}
export function SerializeUpdateQuickLoginChildTxInner(value) {
    const buffers = [];
    buffers.push(SerializeBytes32(value.username));
    buffers.push(SerializeUint32(value.nonce));
    const quickLoginView = new DataView(new ArrayBuffer(1));
    quickLoginView.setUint8(0, value.quick_login);
    buffers.push(quickLoginView.buffer);
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
        new Bytes32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new PubkeyVec(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        if (offsets[3] - offsets[2] !== 1) {
            throw new Error(`Invalid offset for quick_login: ${offsets[2]} - ${offsets[3]}`);
        }
        new RecoveryEmailOpt(this.view.buffer.slice(offsets[3], offsets[4]), {
            validate: false,
        }).validate();
        new PendingStateOpt(this.view.buffer.slice(offsets[4], offsets[5]), {
            validate: false,
        }).validate();
        new Uint32(this.view.buffer.slice(offsets[5], offsets[6]), {
            validate: false,
        }).validate();
        new Bytes(this.view.buffer.slice(offsets[6], offsets[7]), {
            validate: false,
        }).validate();
    }
    getRegisterEmail() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Bytes32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getLocalKeys() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new PubkeyVec(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
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
        return new RecoveryEmailOpt(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getPendingState() {
        const start = 20;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new PendingStateOpt(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getNonce() {
        const start = 24;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getSource() {
        const start = 28;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
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
        new Pubkey(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new TypeId(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
        if (offsets[3] - offsets[2] !== 1) {
            throw new Error(`Invalid offset for replace_old: ${offsets[2]} - ${offsets[3]}`);
        }
    }
    getPendingKey() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Pubkey(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getTimeCell() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new TypeId(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
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
        new Bytes32Vec(this.view.buffer.slice(offsets[2], offsets[3]), {
            validate: false,
        }).validate();
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
        return new Bytes32Vec(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
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
            dataLengthError(this.view.byteLength, '>4');
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
    new DataView(array.buffer).setUint32(0, item.byteLength, true);
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
            dataLengthError(this.view.byteLength, '>4');
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
    new DataView(array.buffer).setUint32(0, value.length, true);
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
            new Bytes(this.view.buffer.slice(offsets[i], offsets[i + 1]), {
                validate: false,
            }).validate();
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
        return new Bytes(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
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
        new Uint32(this.view.buffer.slice(offsets[0], offsets[1]), {
            validate: false,
        }).validate();
        new Bytes256(this.view.buffer.slice(offsets[1], offsets[2]), {
            validate: false,
        }).validate();
    }
    getE() {
        const start = 4;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.getUint32(start + 4, true);
        return new Uint32(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
    getN() {
        const start = 8;
        const offset = this.view.getUint32(start, true);
        const offset_end = this.view.byteLength;
        return new Bytes256(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
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
            assertDataLength(this.view.byteLength, '>4');
        }
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                new RsaPubkey(this.view.buffer.slice(4), { validate: false }).validate();
                break;
            case 1:
                new Secp256k1Pubkey(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            case 2:
                new Secp256r1Pubkey(this.view.buffer.slice(4), {
                    validate: false,
                }).validate();
                break;
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
    unionType() {
        const t = this.view.getUint32(0, true);
        switch (t) {
            case 0:
                return 'RsaPubkey';
            case 1:
                return 'Secp256k1Pubkey';
            case 2:
                return 'Secp256r1Pubkey';
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
                return new Secp256k1Pubkey(this.view.buffer.slice(4), {
                    validate: false,
                });
            case 2:
                return new Secp256r1Pubkey(this.view.buffer.slice(4), {
                    validate: false,
                });
            default:
                throw new Error(`Invalid type: ${t}`);
        }
    }
}
export function SerializePubkey(value) {
    switch (value.type) {
        case 'RsaPubkey': {
            const itemBuffer = SerializeRsaPubkey(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 0, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'Secp256k1Pubkey': {
            const itemBuffer = SerializeSecp256k1Pubkey(value.value);
            const array = new Uint8Array(4 + itemBuffer.byteLength);
            const view = new DataView(array.buffer);
            view.setUint32(0, 1, true);
            array.set(new Uint8Array(itemBuffer), 4);
            return array.buffer;
        }
        case 'Secp256r1Pubkey': {
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
            new Pubkey(this.view.buffer.slice(offsets[i], offsets[i + 1]), {
                validate: false,
            }).validate();
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
        return new Pubkey(this.view.buffer.slice(offset, offset_end), {
            validate: false,
        });
    }
}
export function SerializePubkeyVec(value) {
    return serializeTable(value.map(item => SerializePubkey(item)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0bmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tZXNzYWdlL3VuaXBhc3MtdjMtanNzL3dpdG5lc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVE7SUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FDYixrQ0FBa0MsUUFBUSxhQUFhLE1BQU0sRUFBRSxDQUNoRSxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFFBQVE7SUFDeEMsSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFO1FBQ3ZCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkM7QUFDSCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNO0lBQy9CLElBQUksTUFBTSxZQUFZLE1BQU0sSUFBSSxNQUFNLENBQUMsYUFBYSxZQUFZLFFBQVEsRUFBRTtRQUN4RSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLFdBQVcsQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQ2IsK0VBQStFLENBQ2hGLENBQUM7S0FDSDtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxTQUFTLHVCQUF1QixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxVQUFVO0lBQ25FLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7UUFDdkIsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDeEM7SUFDRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUN0RCxJQUFJLGtCQUFrQixLQUFLLENBQUMsRUFBRTtRQUM1QixPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUM3QjtJQUNELElBQUksa0JBQWtCLEdBQUcsQ0FBQyxFQUFFO1FBQzFCLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO1FBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDekQ7SUFDRCxNQUFNLFNBQVMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxJQUFJLFNBQVMsR0FBRyxrQkFBa0IsRUFBRTtRQUNsQyxNQUFNLElBQUksS0FBSyxDQUNiLG9DQUFvQyxrQkFBa0IsYUFBYSxTQUFTLEVBQUUsQ0FDL0UsQ0FBQztLQUNIO1NBQU0sSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLEdBQUcsa0JBQWtCLEVBQUU7UUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FDYiwrQ0FBK0Msa0JBQWtCLGFBQWEsU0FBUyxFQUFFLENBQzFGLENBQUM7S0FDSDtJQUNELElBQUksa0JBQWtCLEdBQUcsV0FBVyxFQUFFO1FBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDNUU7SUFDRCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDM0M7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FDYixnQkFBZ0IsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsZ0NBQzlCLENBQUMsR0FBRyxDQUNOLEtBQUssT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUN0QixDQUFDO1NBQ0g7S0FDRjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFPO0lBQzdCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDakMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7S0FDcEM7SUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25EO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxTQUFTO0lBQ3BCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzNELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxtQkFBbUI7UUFDakIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDOUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLEtBQUs7SUFDdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDeEQsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN2RCxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLEtBQUs7SUFDaEIsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDekQsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUN4RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLEtBQUs7SUFDbEMsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUVELE1BQU0sT0FBTyxFQUFFO0lBQ2IsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM5RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzdELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDN0QsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ2pFLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDaEUsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxLQUFLO0lBQy9CLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuRCxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLFVBQVU7SUFDckIsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDOUQsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM3RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsS0FBSztJQUN2QyxPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxNQUFNLE9BQU8sT0FBTztJQUNsQixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDNUIsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsUUFBUSxDQUFDLEVBQUU7WUFDVCxLQUFLLENBQUM7Z0JBQ0osSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QyxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNkLE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2hELFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTTtZQUNSLEtBQUssQ0FBQztnQkFDSixJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDbkQsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDZCxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLElBQUksMEJBQTBCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN4RCxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNkLE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osSUFBSSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3JELFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsRUFBRTtZQUNULEtBQUssQ0FBQztnQkFDSixPQUFPLGlCQUFpQixDQUFDO1lBQzNCLEtBQUssQ0FBQztnQkFDSixPQUFPLG9CQUFvQixDQUFDO1lBQzlCLEtBQUssQ0FBQztnQkFDSixPQUFPLHVCQUF1QixDQUFDO1lBQ2pDLEtBQUssQ0FBQztnQkFDSixPQUFPLDRCQUE0QixDQUFDO1lBQ3RDLEtBQUssQ0FBQztnQkFDSixPQUFPLHlCQUF5QixDQUFDO1lBQ25DO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQsS0FBSztRQUNILE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsRUFBRTtZQUNULEtBQUssQ0FBQztnQkFDSixPQUFPLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDcEQsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQztZQUNMLEtBQUssQ0FBQztnQkFDSixPQUFPLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN2RCxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFDO1lBQ0wsS0FBSyxDQUFDO2dCQUNKLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzFELFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUM7WUFDTCxLQUFLLENBQUM7Z0JBQ0osT0FBTyxJQUFJLDBCQUEwQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDL0QsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQztZQUNMLEtBQUssQ0FBQztnQkFDSixPQUFPLElBQUksdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM1RCxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFDO1lBQ0w7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxLQUFLO0lBQ3BDLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLGlCQUFpQixDQUFDLENBQUM7WUFDdEIsTUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUNyQjtRQUNELEtBQUssb0JBQW9CLENBQUMsQ0FBQztZQUN6QixNQUFNLFVBQVUsR0FBRywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3JCO1FBQ0QsS0FBSyx1QkFBdUIsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sVUFBVSxHQUFHLDhCQUE4QixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvRCxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDckI7UUFDRCxLQUFLLDRCQUE0QixDQUFDLENBQUM7WUFDakMsTUFBTSxVQUFVLEdBQUcsbUNBQW1DLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUNyQjtRQUNELEtBQUsseUJBQXlCLENBQUMsQ0FBQztZQUM5QixNQUFNLFVBQVUsR0FBRyxnQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakUsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3JCO1FBQ0Q7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNsRDtBQUNILENBQUM7QUFFRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZFLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN4RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELFFBQVE7UUFDTixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLG9CQUFvQixDQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUMxQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsY0FBYztRQUNaLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzNELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxLQUFLO0lBQzVDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbkUsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUNiLG1DQUFtQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ2hFLENBQUM7U0FDSDtRQUNELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM3RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM3RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDNUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUN0RSxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELFNBQVM7UUFDUCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsNkJBQTZCLENBQUMsS0FBSztJQUNqRCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDM0MsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELE1BQU0sT0FBTyxrQkFBa0I7SUFDN0IsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksdUJBQXVCLENBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzlDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUNsQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2IsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hFLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksdUJBQXVCLENBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQzFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxxQkFBcUIsQ0FDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFDMUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQ2xCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsS0FBSztJQUMvQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM1RCxPQUFPLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzdELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM1RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzVELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxnQ0FBZ0MsQ0FBQyxLQUFLO0lBQ3BELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8scUJBQXFCO0lBQ2hDLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUM1QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM5QztRQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsRUFBRTtZQUNULEtBQUssQ0FBQztnQkFDSixJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDakQsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDZCxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLElBQUksdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNyRCxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNkLE1BQU07WUFDUjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELFNBQVM7UUFDUCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsUUFBUSxDQUFDLEVBQUU7WUFDVCxLQUFLLENBQUM7Z0JBQ0osT0FBTyxxQkFBcUIsQ0FBQztZQUMvQixLQUFLLENBQUM7Z0JBQ0osT0FBTyx5QkFBeUIsQ0FBQztZQUNuQztnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsUUFBUSxDQUFDLEVBQUU7WUFDVCxLQUFLLENBQUM7Z0JBQ0osT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDeEQsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQztZQUNMLEtBQUssQ0FBQztnQkFDSixPQUFPLElBQUksdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM1RCxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFDO1lBQ0w7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSw4QkFBOEIsQ0FBQyxLQUFLO0lBQ2xELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLHFCQUFxQixDQUFDLENBQUM7WUFDMUIsTUFBTSxVQUFVLEdBQUcsNEJBQTRCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdELE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUNyQjtRQUNELEtBQUsseUJBQXlCLENBQUMsQ0FBQztZQUM5QixNQUFNLFVBQVUsR0FBRyxnQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakUsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3JCO1FBQ0Q7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNsRDtBQUNILENBQUM7QUFFRCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxZQUFZO1FBQ1YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtRQUNWLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzNELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxLQUFLO0lBQ2hELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRCxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLHVCQUF1QjtJQUNsQyxZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxjQUFjO1FBQ1osTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM5RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtRQUNWLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDM0QsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsZ0NBQWdDLENBQUMsS0FBSztJQUNwRCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNwRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRCxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSwwQkFBMEIsQ0FDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDOUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQ2xCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDYixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksMEJBQTBCLENBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQzFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsOEJBQThCLENBQUMsS0FBSztJQUNsRCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4QyxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLDBCQUEwQjtJQUNyQyxZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM3RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDNUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDUCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM1RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsbUNBQW1DLENBQUMsS0FBSztJQUN2RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1QyxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLDBCQUEwQjtJQUNyQyxZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSwrQkFBK0IsQ0FDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDOUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQ2xCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDYixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksK0JBQStCLENBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQzFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsbUNBQW1DLENBQUMsS0FBSztJQUN2RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4QyxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLCtCQUErQjtJQUMxQyxZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuRSxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzdELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM1RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUN0RSxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsd0NBQXdDLENBQUMsS0FBSztJQUM1RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzlELE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLDRCQUE0QixDQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUM5QyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FDbEIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNiLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSw0QkFBNEIsQ0FDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFDMUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQ2xCLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTTtRQUNKLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzNELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxnQ0FBZ0MsQ0FBQyxLQUFLO0lBQ3BELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8sNEJBQTRCO0lBQ3ZDLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUNiLG1DQUFtQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ2hFLENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM3RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDNUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUscUNBQXFDLENBQUMsS0FBSztJQUN6RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMzQyxNQUFNLGNBQWMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLFFBQVE7SUFDbkIsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQ2IsbUNBQW1DLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDaEUsQ0FBQztTQUNIO1FBQ0QsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25FLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEUsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM3RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtRQUNWLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDL0QsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDdEUsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGVBQWU7UUFDYixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ3JFLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM1RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzNELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxLQUFLO0lBQ3JDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUM5RCxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQUN2QixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FDYixtQ0FBbUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUNoRSxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRUQsYUFBYTtRQUNYLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDNUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzVELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhO1FBQ1gsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUFDLEtBQUs7SUFDekMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sY0FBYyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLHdCQUF3QixDQUFDLEtBQUs7SUFDNUMsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3JDO1NBQU07UUFDTCxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQztBQUVELE1BQU0sT0FBTyxNQUFNO0lBQ2pCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsS0FBSztJQUNuQyxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUFDLEtBQUs7SUFDeEMsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2pDO1NBQU07UUFDTCxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQztBQUVELE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixNQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQ2IsaUNBQWlDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDOUQsQ0FBQztTQUNIO1FBQ0QsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUNiLCtCQUErQixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzVELENBQUM7U0FDSDtRQUNELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0QsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxZQUFZO1FBQ1YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELFNBQVM7UUFDUCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNoRSxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsS0FBSztJQUMxQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsTUFBTSxhQUFhLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoRCxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLHlCQUF5QixDQUFDLEtBQUs7SUFDN0MsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RDO1NBQU07UUFDTCxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQztBQUVELE1BQU0sT0FBTyxPQUFPO0lBQ2xCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxLQUFLO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxPQUFPO0lBQ2xCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxLQUFLO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxRQUFRO0lBQ25CLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxLQUFLO0lBQ3JDLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDekMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxNQUFNO0lBQ2pCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsS0FBSztJQUNuQyxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLE9BQU8sS0FBSztJQUNoQixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDNUIsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELEdBQUc7UUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsS0FBSztJQUNsQyxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDdEIsQ0FBQztBQUVELE1BQU0sT0FBTyxRQUFRO0lBQ25CLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBSztJQUNyQyxJQUFJLEtBQUssRUFBRTtRQUNULE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCO1NBQU07UUFDTCxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQztBQUVELE1BQU0sT0FBTyxVQUFVO0lBQ3JCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUM1QixlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDN0M7UUFDRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlELGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDM0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksT0FBTyxDQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ3BCLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxFQUN0QixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUM3QixFQUNELEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsS0FBSztJQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUMvRDtJQUNELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN0QixDQUFDO0FBRUQsTUFBTSxPQUFPLFFBQVE7SUFDbkIsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUQsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBSztJQUNyQyxPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFBWSxNQUFNLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzRCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzVELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDOUQsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLEtBQUs7SUFDdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxLQUFLO0lBQzVDLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxLQUFLO0lBQzVDLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxNQUFNO0lBQ2pCLFlBQVksTUFBTSxFQUFFLEVBQUMsUUFBUSxHQUFHLElBQUksRUFBQyxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSztRQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUM1QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM5QztRQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsRUFBRTtZQUNULEtBQUssQ0FBQztnQkFDSixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkUsTUFBTTtZQUNSLEtBQUssQ0FBQztnQkFDSixJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdDLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTTtZQUNSLEtBQUssQ0FBQztnQkFDSixJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdDLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsRUFBRTtZQUNULEtBQUssQ0FBQztnQkFDSixPQUFPLFdBQVcsQ0FBQztZQUNyQixLQUFLLENBQUM7Z0JBQ0osT0FBTyxpQkFBaUIsQ0FBQztZQUMzQixLQUFLLENBQUM7Z0JBQ0osT0FBTyxpQkFBaUIsQ0FBQztZQUMzQjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsUUFBUSxDQUFDLEVBQUU7WUFDVCxLQUFLLENBQUM7Z0JBQ0osT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUNyRSxLQUFLLENBQUM7Z0JBQ0osT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3BELFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUM7WUFDTCxLQUFLLENBQUM7Z0JBQ0osT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3BELFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUM7WUFDTDtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxLQUFLO0lBQ25DLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLFdBQVcsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDckI7UUFDRCxLQUFLLGlCQUFpQixDQUFDLENBQUM7WUFDdEIsTUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUNyQjtRQUNELEtBQUssaUJBQWlCLENBQUMsQ0FBQztZQUN0QixNQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3JCO1FBQ0Q7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNsRDtBQUNILENBQUM7QUFFRCxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUFZLE1BQU0sRUFBRSxFQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUMsR0FBRyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDekIsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM3RCxRQUFRLEVBQUUsS0FBSzthQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDNUIsT0FBTyxDQUFDLENBQUM7U0FDVjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBQztRQUNQLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3pCLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQzVELFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxLQUFLO0lBQ3RDLE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLENBQUMifQ==