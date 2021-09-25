import { Reader } from '..';
import {
  SerializeAddLocalKeyChildTxInner,
  SerializeDeleteLocalKeyChildTxInner,
  SerializeRegisterChildTxInner,
  SerializeUpdateQuickLoginChildTxInner,
  SerializeUpdateRecoveryEmailChildTxInner,
} from './unipass-v3-jss/witness';
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
    public recovery_email: RecoveryEmail,
    public source: ArrayBuffer = new ArrayBuffer(0)
  ) {}
  serialize() {
    return new Reader(SerializeRegisterChildTxInner(this));
  }
}

export class addLocalKeyInner {
  constructor(
    public username: Reader,
    public nonce: Reader,
    public pubkey: pubkey
  ) {}
  serialize() {
    return new Reader(SerializeAddLocalKeyChildTxInner(this));
  }
}

export class deleteLocalKeyInner {
  constructor(
    public username: Reader,
    public nonce: Reader,
    public pubkey: pubkey
  ) {}
  serialize() {
    return new Reader(SerializeDeleteLocalKeyChildTxInner(this));
  }
}

export class updateQuickLoginInner {
  constructor(
    public username: Reader,
    public nonce: Reader,
    public quick_login: number
  ) {}
  serialize() {
    return new Reader(SerializeUpdateQuickLoginChildTxInner(this));
  }
}

export class UpdateRecoveryEmailInner {
  constructor(
    public username: Reader,
    public nonce: Reader,
    public recovery_email: RecoveryEmail | null
  ) {}
  serialize() {
    return new Reader(SerializeUpdateRecoveryEmailChildTxInner(this));
  }
}
