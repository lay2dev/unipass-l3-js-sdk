import { ArrayBufferReader, Reader, registerInner, StringReader } from '..';
import {
  RecoveryEmail,
  RegisterInner,
  Rsa,
  RsaPubkey,
} from './sign-message-base';
import { createHash } from 'crypto';
export function hashData(data: string) {
  const messageHash = createHash('SHA256')
    .update(data)
    .digest('hex')
    .toString();

  return `0x${messageHash}`;
}
export class SignMessage {
  constructor(private inner: registerInner) {}
  sign(): string {
    if (this.inner.action == 'register') {
      const rsa = new Rsa(
        new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer,
        this.inner.pubkey.value.n
      );
      const inner = new RegisterInner(
        new StringReader(hashData(this.inner.username)).toArrayBuffer(32),
        new StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(32),
        new RsaPubkey(rsa),
        new RecoveryEmail(1, 1, [
          new StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(
            32
          ),
        ])
      );
      const message = (inner.serialize() as ArrayBufferReader).serializeJson();
      console.log(message);
      return message;
    } else {
      throw new Error(`SignError: action  error `);
    }
  }
}
