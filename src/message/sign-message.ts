import {
  SDKActionType,
  ArrayBufferReader,
  hashData,
  registerInner,
  StringReader,
  toArrayBuffer,
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

function initPubkey(pubKey: string, keyType: string, backend?: boolean) {
  const pubkeyBuffer = Buffer.from(pubKey.replace('0x', ''), 'hex');
  const e = backend
    ? pubkeyBuffer.slice(4, 8).readUInt32LE()
    : new DataView(toArrayBuffer(pubkeyBuffer.slice(4, 8))).getUint32(0, true);
  const n = toArrayBuffer(pubkeyBuffer.slice(8).reverse());
  const rsa = new Rsa(new Uint32Array([e]).reverse().buffer, n);
  const pubkey = new RsaPubkey(rsa);
  return pubkey;
}

export class SignMessage {
  constructor(private inner: registerInner, private backend?: boolean) {}
  messageHash(): string {
    if (!this.inner.pubKey) {
      throw new Error(`SignMessageError: not find pubKey `);
    }
    const pubkey = initPubkey(
      this.inner.pubKey,
      this.inner.keyType,
      this.backend
    );

    if (this.inner.action == SDKActionType.REGISTER) {
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
    } else if (this.inner.action == SDKActionType.ADD_KEY) {
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
    } else if (this.inner.action == SDKActionType.DEL_KEY) {
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
    } else if (this.inner.action == SDKActionType.UPDATE_QUICK_LOGIN) {
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
