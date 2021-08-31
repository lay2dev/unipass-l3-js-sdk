import { HexStringReader } from '../reader';

function dataLengthError(actual, required) {
  throw new Error(
    `Invalid data length! Required: ${required}, actual: ${actual}`
  );
}

function assertDataLength(actual, required) {
  if (actual !== required) {
    dataLengthError(actual, required);
  }
}

function assertArrayBuffer(value: string, length?: number) {
  const reader = new HexStringReader(value);
  if (reader instanceof Object && reader.toArrayBuffer instanceof Function) {
    return reader.toArrayBuffer(length);
  }
  if (!(reader instanceof ArrayBuffer)) {
    throw new Error(
      'Provided value must be an ArrayBuffer or can be transformed into ArrayBuffer!'
    );
  }
  return reader.toArrayBuffer(length);
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
    throw new Error(
      `Item count not enough! Required: ${expectedFieldCount}, actual: ${itemCount}`
    );
  } else if (!compatible && itemCount > expectedFieldCount) {
    throw new Error(
      `Item count is more than required! Required: ${expectedFieldCount}, actual: ${itemCount}`
    );
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
      throw new Error(
        `Offset index ${i}: ${offsets[i]} is larger than offset index ${
          i + 1
        }: ${offsets[i + 1]}`
      );
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

class AccountValue {
  public view: DataView;
  constructor(reader, { validate = true } = {}) {
    this.view = new DataView(assertArrayBuffer(reader));
    if (validate) {
      this.validate();
    }
  }

  getAmount() {
    return new Uint128(this.view.buffer.slice(0, 0 + Uint128.size()), {
      validate: false,
    });
  }

  getNonce() {
    return new Uint64(
      this.view.buffer.slice(
        0 + Uint128.size(),
        0 + Uint128.size() + Uint64.size()
      ),
      { validate: false }
    );
  }

  validate(compatible = false) {
    assertDataLength(this.view.byteLength, AccountValue.size());
    this.getAmount().validate(compatible);
    this.getNonce().validate(compatible);
  }
  static size() {
    return 0 + Uint128.size() + Uint64.size();
  }
}

function SerializeAccountValue(value) {
  const array = new Uint8Array(0 + Uint128.size() + Uint64.size());
  const view = new DataView(array.buffer);
  array.set(new Uint8Array(SerializeUint128(value.amount)), 0);
  array.set(new Uint8Array(SerializeUint64(value.nonce)), 0 + Uint128.size());
  return array.buffer;
}

class Target {
  public view: DataView;
  constructor(reader, { validate = true } = {}) {
    this.view = new DataView(assertArrayBuffer(reader));
    if (validate) {
      this.validate();
    }
  }

  getTo() {
    return new Byte32(this.view.buffer.slice(0, 0 + Byte32.size()), {
      validate: false,
    });
  }

  getAmount() {
    return new Uint128(
      this.view.buffer.slice(
        0 + Byte32.size(),
        0 + Byte32.size() + Uint128.size()
      ),
      { validate: false }
    );
  }

  validate(compatible = false) {
    assertDataLength(this.view.byteLength, Target.size());
    this.getTo().validate(compatible);
    this.getAmount().validate(compatible);
  }
  static size() {
    return 0 + Byte32.size() + Uint128.size();
  }
}

function SerializeTarget(value) {
  const array = new Uint8Array(0 + Byte32.size() + Uint128.size());
  const view = new DataView(array.buffer);
  array.set(new Uint8Array(SerializeByte32(value.to)), 0);
  array.set(new Uint8Array(SerializeUint128(value.amount)), 0 + Byte32.size());
  return array.buffer;
}

class Targets {
  public view: DataView;
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
    const requiredByteLength = this.length() * Target.size() + 4;
    assertDataLength(this.view.byteLength, requiredByteLength);
    for (let i = 0; i < 0; i++) {
      const item = this.indexAt(i);
      item.validate(compatible);
    }
  }

  indexAt(i) {
    return new Target(
      this.view.buffer.slice(
        4 + i * Target.size(),
        4 + (i + 1) * Target.size()
      ),
      { validate: false }
    );
  }

  length() {
    return this.view.getUint32(0, true);
  }
}

function SerializeTargets(value) {
  const array = new Uint8Array(4 + Target.size() * value.length);
  new DataView(array.buffer).setUint32(0, value.length, true);
  for (let i = 0; i < value.length; i++) {
    const itemBuffer = SerializeTarget(value[i]);
    array.set(new Uint8Array(itemBuffer), 4 + i * Target.size());
  }
  return array.buffer;
}

class RawLedgerTransaction {
  public view: DataView;
  constructor(reader, { validate = true } = {}) {
    this.view = new DataView(assertArrayBuffer(reader));
    if (validate) {
      this.validate();
    }
  }

  validate(compatible = false) {
    const offsets = verifyAndExtractOffsets(this.view, 0, true);
    new Byte32(this.view.buffer.slice(offsets[0], offsets[1]), {
      validate: false,
    }).validate();
    new Byte32(this.view.buffer.slice(offsets[1], offsets[2]), {
      validate: false,
    }).validate();
    new Uint64(this.view.buffer.slice(offsets[2], offsets[3]), {
      validate: false,
    }).validate();
    new Uint128(this.view.buffer.slice(offsets[3], offsets[4]), {
      validate: false,
    }).validate();
    new Uint128(this.view.buffer.slice(offsets[4], offsets[5]), {
      validate: false,
    }).validate();
    new Targets(this.view.buffer.slice(offsets[5], offsets[6]), {
      validate: false,
    }).validate();
  }

  getTypeId() {
    const start = 4;
    const offset = this.view.getUint32(start, true);
    const offset_end = this.view.getUint32(start + 4, true);
    return new Byte32(this.view.buffer.slice(offset, offset_end), {
      validate: false,
    });
  }

  getFrom() {
    const start = 8;
    const offset = this.view.getUint32(start, true);
    const offset_end = this.view.getUint32(start + 4, true);
    return new Byte32(this.view.buffer.slice(offset, offset_end), {
      validate: false,
    });
  }

  getNonce() {
    const start = 12;
    const offset = this.view.getUint32(start, true);
    const offset_end = this.view.getUint32(start + 4, true);
    return new Uint64(this.view.buffer.slice(offset, offset_end), {
      validate: false,
    });
  }

  getTotalAmount() {
    const start = 16;
    const offset = this.view.getUint32(start, true);
    const offset_end = this.view.getUint32(start + 4, true);
    return new Uint128(this.view.buffer.slice(offset, offset_end), {
      validate: false,
    });
  }

  getFee() {
    const start = 20;
    const offset = this.view.getUint32(start, true);
    const offset_end = this.view.getUint32(start + 4, true);
    return new Uint128(this.view.buffer.slice(offset, offset_end), {
      validate: false,
    });
  }

  getTargets() {
    const start = 24;
    const offset = this.view.getUint32(start, true);
    const offset_end = this.view.byteLength;
    return new Targets(this.view.buffer.slice(offset, offset_end), {
      validate: false,
    });
  }
}

export function SerializeRawLedgerTransaction(value: any) {
  const buffers = [];
  buffers.push(SerializeByte32(value.typeId));
  buffers.push(SerializeByte32(value.from));
  buffers.push(SerializeUint64(value.nonce));
  buffers.push(SerializeUint128(value.totalAmount));
  buffers.push(SerializeUint128(value.fee));
  buffers.push(SerializeTargets(value.targets));
  return serializeTable(buffers);
}

class Uint64 {
  public view: DataView;
  constructor(reader, { validate = true } = {}) {
    this.view = new DataView(assertArrayBuffer(reader));
    if (validate) {
      this.validate();
    }
  }

  validate(compatible = false) {
    assertDataLength(this.view.byteLength, 8);
  }

  indexAt(i) {
    return this.view.getUint8(i);
  }

  raw() {
    return this.view.buffer;
  }

  static size() {
    return 8;
  }
}

function SerializeUint64(value) {
  const buffer = assertArrayBuffer(value, 8);
  assertDataLength(buffer.byteLength, 8);
  return buffer;
}

class Uint128 {
  public view: DataView;
  constructor(reader, { validate = true } = {}) {
    this.view = new DataView(assertArrayBuffer(reader));
    if (validate) {
      this.validate();
    }
  }

  validate(compatible = false) {
    assertDataLength(this.view.byteLength, 16);
  }

  indexAt(i) {
    return this.view.getUint8(i);
  }

  raw() {
    return this.view.buffer;
  }

  static size() {
    return 16;
  }
}

function SerializeUint128(value) {
  const buffer = assertArrayBuffer(value, 16);
  assertDataLength(buffer.byteLength, 16);
  return buffer;
}

class Byte32 {
  public view: DataView;
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

function SerializeByte32(value) {
  const buffer = assertArrayBuffer(value, 32);
  assertDataLength(buffer.byteLength, 32);
  return buffer;
}

export const sst = {
  SerializeRawLedgerTransaction,
};
