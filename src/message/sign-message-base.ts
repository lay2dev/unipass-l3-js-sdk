import { Reader } from '..';
import {} from './unipass-v3-jss/common';
import { SerializeRegisterChildTxInner } from './unipass-v3-jss/witness';
interface pubkey {
  type: string;
  value: any;
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
    return new Reader(SerializeRegisterChildTxInner(this));
  }
}
