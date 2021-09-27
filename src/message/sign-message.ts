import { ActionType, HashRawData, sha256HashData } from '..';

import { soliditySha3 } from 'web3-utils';
const source = 'unipass-wallet';

export class SignMessage {
  constructor(private inner: HashRawData, private backend?: boolean) {}
  messageHash(): string {
    if (!this.inner.pubKey) {
      throw new Error(`SignMessageError: not find pubKey `);
    }

    if (this.inner.action == ActionType.REGISTER) {
      if (!this.inner.registerEmail) {
        throw new Error(`SignMessageError: not find registerEmail `);
      }

      const hash: string = soliditySha3(
        { v: this.inner.action, t: 'uint8' },
        { v: sha256HashData(this.inner.username), t: 'bytes32' },
        { v: sha256HashData(this.inner.registerEmail), t: 'bytes32' },
        { v: source, t: 'string' }
      )!;

      return hash;
    } else if (
      this.inner.action == ActionType.ADD_LOCAL_KEY ||
      this.inner.action == ActionType.QUICK_ADD_LOCAL_KEY
    ) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const hash: string = soliditySha3(
        { v: this.inner.action, t: 'uint8' },
        { v: sha256HashData(this.inner.registerEmail), t: 'bytes32' },
        { v: sha256HashData(this.inner.username), t: 'bytes32' },
        { v: sha256HashData(this.inner.nonce), t: 'uint' },
        { v: this.inner.keyType, t: 'uint' },
        { v: sha256HashData(this.inner.pubKey), t: 'bytes' }
      )!;

      return hash;
    } else if (this.inner.action == ActionType.DEL_LOCAL_KEY) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const hash: string = soliditySha3(
        { v: this.inner.action, t: 'uint8' },
        { v: sha256HashData(this.inner.registerEmail), t: 'bytes32' },
        { v: sha256HashData(this.inner.username), t: 'bytes32' },
        { v: sha256HashData(this.inner.nonce), t: 'uint' },
        { v: this.inner.keyType, t: 'uint' },
        { v: sha256HashData(this.inner.pubKey), t: 'bytes' }
      )!;

      return hash;
    } else if (this.inner.action == ActionType.UPDATE_RECOVERY_EMAIL) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const hash: string = soliditySha3(
        { v: this.inner.action, t: 'uint8' },
        { v: sha256HashData(this.inner.registerEmail), t: 'bytes32' },
        { v: sha256HashData(this.inner.username), t: 'bytes32' },
        { v: sha256HashData(this.inner.nonce), t: 'uint' },
        { v: this.inner.keyType, t: 'uint' },
        { v: sha256HashData(this.inner.pubKey), t: 'bytes' }
      )!;

      return hash;
    } else if (this.inner.action == ActionType.UPDATE_QUICK_LOGIN) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }

      const hash: string = soliditySha3(
        { v: this.inner.action, t: 'uint8' },
        { v: sha256HashData(this.inner.registerEmail), t: 'bytes32' },
        { v: sha256HashData(this.inner.username), t: 'bytes32' },
        { v: sha256HashData(this.inner.nonce), t: 'uint' },
        { v: Number(this.inner.quickLogin), t: 'bool' }
      )!;

      return hash;
    } else {
      throw new Error(`SignMessageError: action error`);
    }
  }
}
