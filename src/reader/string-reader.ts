import { ArrayBufferReader } from '..';

export class StringReader {
  constructor(public input: string) {}
  static fromRawString(string) {
    const buffer = new ArrayBuffer(string.length);
    const view = new DataView(buffer);

    for (let i = 0; i < string.length; i++) {
      const c = string.charCodeAt(i);
      if (c > 0xff) {
        throw new Error('fromRawString can only accept UTF-8 raw string!');
      }
      view.setUint8(i, c);
    }
    return new ArrayBufferReader(buffer);
  }

  length(): any {
    if (!this.input.startsWith('0x') || this.input.length % 2 != 0) {
      return this.input.length / 2;
    }
    return this.input.length / 2 - 1;
  }

  indexAt(i: number): any {
    try {
      return parseInt(this.input.substr(2 + i * 2, 2), 16);
    } catch (e) {
      return 0;
    }
  }

  toArrayBuffer(length: number): ArrayBuffer {
    if (!length) {
      length = this.length();
    }

    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    for (let i = 0; i < length; i++) {
      view.setUint8(i, this.indexAt(i));
    }
    return buffer;
  }

  serializeJson(): string {
    return this.input;
  }
}
