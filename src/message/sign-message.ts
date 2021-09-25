import {
  ArrayBufferReader,
  hashData,
  pubkey,
  registerInner,
  StringReader,
} from '..';
import {
  addLocalKeyInner,
  deleteLocalKeyInner,
  RecoveryEmail,
  RegisterInner,
  Rsa,
  RsaPubkey,
  updateQuickLoginInner,
  UpdateRecoveryEmailInner,
} from './sign-message-base';

export class SignMessage {
  constructor(private inner: registerInner) {}
  messageHash(): string {
    const rsa = new Rsa(
      new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer,
      this.inner.pubkey.value.n
    );
    const pubkey = new RsaPubkey(rsa);

    if (this.inner.action == 'register') {
      if (!this.inner.registerEmail) {
        throw new Error(`SignMessageError: not find registerEmail `);
      }
      const inner = new RegisterInner(
        new StringReader(hashData(this.inner.username)).toArrayBuffer(32),
        new StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(32),
        pubkey,
        new RecoveryEmail(1, 1, [
          new StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(
            32
          ),
        ])
      );
      const message = (inner.serialize() as ArrayBufferReader).serializeJson();
      return message;
    } else if (this.inner.action == 'add_key') {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const inner = new addLocalKeyInner(
        new StringReader(hashData(this.inner.username)).toArrayBuffer(32),
        new StringReader(this.inner.nonce).toArrayBuffer(4),
        pubkey
      );
      const message = (inner.serialize() as ArrayBufferReader).serializeJson();

      return message;
    } else if (this.inner.action == 'delete_key') {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const inner = new deleteLocalKeyInner(
        new StringReader(hashData(this.inner.username)).toArrayBuffer(32),
        new StringReader(this.inner.nonce).toArrayBuffer(4),
        pubkey
      );
      const message = (inner.serialize() as ArrayBufferReader).serializeJson();

      return message;
    } else if (this.inner.action == 'update_recovery_email') {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const inner = new UpdateRecoveryEmailInner(
        new StringReader(hashData(this.inner.username)).toArrayBuffer(32),
        new StringReader(this.inner.nonce).toArrayBuffer(4),
        new RecoveryEmail(1, 1, [
          new StringReader(hashData(this.inner.recoveryEmail)).toArrayBuffer(
            32
          ),
        ])
      );
      const message = (inner.serialize() as ArrayBufferReader).serializeJson();

      return message;
    } else if (this.inner.action == 'update_quick_login') {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const inner = new updateQuickLoginInner(
        new StringReader(hashData(this.inner.username)).toArrayBuffer(32),
        new StringReader(this.inner.nonce).toArrayBuffer(4),
        Number(this.inner.quickLogin)
      );
      const message = (inner.serialize() as ArrayBufferReader).serializeJson();

      return message;
    } else {
      throw new Error(`SignMessageError: action error`);
    }
  }
}
