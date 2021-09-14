import {
  RecoveryEmail,
  registerInner,
  RegisterInner,
  Rsa,
  RsaPubkey,
  StringReader,
} from '..';

export class RegisterMessage {
  constructor(private inner: registerInner) {}
  sign(): string {
    const rsa = new Rsa(
      new StringReader(this.inner.pubkey.value.e).toArrayBuffer(4),
      new StringReader(this.inner.pubkey.value.n).toArrayBuffer(256)
    );

    const inner = new RegisterInner(
      new StringReader(this.inner.username).toArrayBuffer(32),
      new StringReader(this.inner.registerEmail).toArrayBuffer(32),
      new RsaPubkey(rsa),
      new RecoveryEmail(1, 1, [
        new StringReader(this.inner.registerEmail).toArrayBuffer(32),
      ])
    );
    console.log(inner);
    const message = inner.serialize();
    console.log('---message------', message);
    return message;
  }
}
