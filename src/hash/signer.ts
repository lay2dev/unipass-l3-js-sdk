import { ArrayBufferReader, Reader, SerializeRegisterChildTxInner } from '..';

interface pubkey {
  type: string;
  value: any;
}

export class RecoveryEmail {
  constructor(
    public threshold: number,
    public first_n: number,
    public emails: ArrayBuffer[]
  ) {}
}
export class RegisterInner {
  constructor(
    public username: Reader,
    public register_email: Reader,
    public pubkey: pubkey,
    public recoveryEmail: RecoveryEmail,
    public source: ArrayBuffer = new ArrayBuffer(0)
  ) {}
  serialize() {
    return (
      new Reader(SerializeRegisterChildTxInner(this)) as ArrayBufferReader
    ).serializeJson();
  }
}

export class Rsa {
  constructor(public e: ArrayBuffer, public n: ArrayBuffer) {}
}

export class RsaPubkey implements pubkey {
  public type: string;
  public value: Rsa;
  constructor(rsa: Rsa) {
    this.type = 'RsaPubkey';
    this.value = rsa;
  }
}
