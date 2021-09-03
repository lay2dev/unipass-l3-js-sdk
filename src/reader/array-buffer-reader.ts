export class ArrayBufferReader {
  public view: DataView;
  constructor(public input: ArrayBuffer) {
    this.view = new DataView(input);
  }
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

  length(): number {
    return this.view.byteLength;
  }

  indexAt(i: number): number {
    return this.view.getUint8(i);
  }

  toArrayBuffer(): ArrayBuffer {
    return this.view.buffer;
  }

  serializeJson(): string {
    return (
      '0x' +
      Array.prototype.map
        .call(new Uint8Array(this.view.buffer), (x) =>
          ('00' + x.toString(16)).slice(-2)
        )
        .join('')
    );
  }
}
