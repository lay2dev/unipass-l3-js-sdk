import { ArrayBufferReader, HexStringReader } from '..';

export interface HashMethod {
  update(data: string | Uint8Array): HashMethod;
  digest(data?: string | Uint8Array): string | Uint8Array;
  digest(encoding: string): string | Uint8Array;
}

export abstract class Hasher {
  constructor(protected h: HashMethod) {}
  abstract update(
    data: string | ArrayBuffer | HexStringReader | ArrayBufferReader
  ): Hasher;
  abstract digest(): HexStringReader | ArrayBufferReader;
  abstract reset(): void;
  protected setH(h: HashMethod): void {
    this.h = h;
  }
  hash(
    data: string | Uint8Array | HexStringReader | ArrayBufferReader
  ): HexStringReader | ArrayBufferReader {
    return this.update(data).digest();
  }
}
