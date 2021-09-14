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
  } else if ((!compatible) && itemCount > expectedFieldCount) {
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
    } else {
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
      dataLengthError(this.view.byteLength, ">4")
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
  } else {
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
    } else {
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

