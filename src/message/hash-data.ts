import { SDKActionType, registerInner, sha256HashData } from '..';

import { soliditySha3 } from 'web3-utils';
import { ActionType } from './utils';
const source = 'unipass-wallet';

export class HashData {
  constructor(private inner: registerInner, private backend?: boolean) {}
  hash(): string {
    if (!this.inner.pubKey) {
      throw new Error(`SignMessageError: not find pubKey `);
    }

    if (this.inner.action == SDKActionType.REGISTER) {
      if (!this.inner.registerEmail) {
        throw new Error(`SignMessageError: not find registerEmail `);
      }
      const hash: string = soliditySha3(
        { v: ActionType.REGISTER, t: 'uint8' },
        { v: sha256HashData(this.inner.username), t: 'bytes32' },
        { v: sha256HashData(this.inner.registerEmail), t: 'bytes32' },
        { v: source, t: 'string' }
      )!;
      return hash;
    } else if (this.inner.action == SDKActionType.ADD_LOCAL_KEY) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }
      return '0x';
    } else if (this.inner.action == SDKActionType.DEL_KEY) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }
      return '0x';
    } else if (this.inner.action == 'update_recovery_email') {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }
      return '0x';
    } else if (this.inner.action == SDKActionType.UPDATE_QUICK_LOGIN) {
      if (!this.inner.nonce) {
        throw new Error(`SignMessageError: not find nonce `);
      }
      if (!this.inner.nonce.startsWith('0x')) {
        throw new Error(`SignMessageError: nonce not hex data`);
      }
      return '0x';
    } else {
      throw new Error(`SignMessageError: action error`);
    }
  }
}
