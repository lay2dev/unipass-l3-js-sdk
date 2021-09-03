import { Hasher } from '.';
import keccak from 'keccak';
import { ArrayBufferReader, HexStringReader } from '../reader';

export class Keccak256Hasher extends Hasher {
  constructor() {
    super(keccak('keccak256'));
  }

  update(
    data: string | ArrayBuffer | ArrayBufferReader | HexStringReader
  ): Hasher {
    let array: Buffer;
    if (data instanceof ArrayBufferReader || data instanceof HexStringReader) {
      /** Reader type params not enter this branch, it's weired */
      array = Buffer.from(data.serializeJson().replace('0x', ''));
    } else if (data instanceof ArrayBuffer) {
      array = Buffer.from(new Uint8Array(data));
    } else if (typeof data === 'string') {
      array = Buffer.from(data);
    } else {
      array = Buffer.from(
        new Uint8Array(new ArrayBufferReader(data).toArrayBuffer())
      );
    }
    this.h.update(array);
    return this;
  }

  digest(): HexStringReader {
    const hex = '0x' + this.h.digest('hex').toString();
    return new HexStringReader(hex);
  }

  reset(): void {
    this.h = keccak('keccak256');
  }
}
