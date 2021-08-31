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

class Action {
  public view: DataView;
  constructor(reader, { validate = true } = {}) {
    this.view = new DataView(assertArrayBuffer(reader));
    if (validate) {
      this.validate();
    }
  }

  registerEmail() {
    return new Byte32(this.view.buffer.slice(0, 0 + Byte32.size()), {
      validate: false,
    });
  }
  getPubkey() {
    return new Byte32(this.view.buffer.slice(0, 0 + Byte32.size()), {
      validate: false,
    });
  }

  getRecoveryEmail() {
    return new Uint128(
      this.view.buffer.slice(
        0 + Byte32.size(),
        0 + Byte32.size() + Uint128.size()
      ),
      { validate: false }
    );
  }

  quickLogin() {
    return new Uint128(
      this.view.buffer.slice(
        0 + Byte32.size(),
        0 + Byte32.size() + Uint128.size()
      ),
      { validate: false }
    );
  }

  validate(compatible = false) {
    assertDataLength(this.view.byteLength, Action.size());
    this.registerEmail().validate(compatible);
    this.getPubkey().validate(compatible);
    this.getRecoveryEmail().validate(compatible);
    this.quickLogin().validate(compatible);
  }
  static size() {
    return 0 + Byte32.size() + Uint128.size();
  }
}

function SerializeAction(value) {
  const array = new Uint8Array(4 + Action.size() * value.length);
  array.set(new Uint8Array(SerializeByte32(value.registerEmail)), 0);
  array.set(new Uint8Array(SerializeUint128(value.pubkey)), 0 + Byte32.size());
  array.set(
    new Uint8Array(SerializeByte32(value.recoveryEmail)),
    0 + Byte32.size()
  );
  array.set(
    new Uint8Array(SerializeBytes(value.quickLogin)),
    0 + Byte32.size()
  );
  return array.buffer;
}

export function SerializeInnerTransaction(value: any) {
  console.log('======>', value);
  const buffers = [];
  buffers.push(SerializeByte32(value.type));
  buffers.push(SerializeUint32(value.nonce));
  buffers.push(SerializeAction(value.action));
  return serializeTable(buffers);
}

export function SerializeUint32(value) {
  const buffer = assertArrayBuffer(value);
  assertDataLength(buffer.byteLength, 4);
  return buffer;
}

export function SerializeBytes(value) {
  const item = assertArrayBuffer(value);
  const array = new Uint8Array(4 + item.byteLength);
  new DataView(array.buffer).setUint32(0, item.byteLength, true);
  array.set(new Uint8Array(item), 4);
  return array.buffer;
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

export const core = {
  SerializeInnerTransaction,
};
