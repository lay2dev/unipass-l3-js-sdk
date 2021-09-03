import {
  ArrayBufferReader,
  RawTransaction,
  ResponseInfo,
  RPC,
  TransactionParams,
  UniTokenModel,
} from '.';
import { validators, transaction, userInfo } from './utils';

export class Transaction implements UniTokenModel {
  constructor(public inner: any, public sig?: string) {}

  validate(): Transaction {
    const data = this.transform() as TransactionParams;
    validators.ValidateInner(data.inner);
    return this;
  }

  validateRaw(): Transaction {
    const data = transaction.TransformInner(this.inner);
    validators.ValidateInner(data);
    return this;
  }

  setSig(sig) {
    this.sig = sig;
  }

  transform(): object {
    return transaction.TransformTransaction(
      this.serializeJson()
    ) as TransactionParams;
  }

  serializeJson(): TransactionParams {
    return {
      inner: this.inner,
      sig: this.sig,
    };
  }

  getSignMessage(): string {
    this.validateRaw();

    const signData = {
      registerEmail: this.inner.action.registerEmail,
      pubkey: this.inner.action.pubkey,
      quickLogin: this.inner.action.quickLogin,
      recoveryEmail: this.inner.action.recoveryEmail,
      nonce: this.inner.nonce,
    };

    const signMessage = new ArrayBufferReader(
      userInfo.SerializeUserInfo(signData)
    );

    return signMessage.serializeJson();
  }

  async sendTransaction(rpc: RPC) {
    const transformData = this.transform();
    const data = await rpc.send_up_transaction(transformData);
    if (data) {
      const rawResponse = data as RawTransaction;
      return rawResponse.transform();
    }
    throw new Error(`TxHashError: txhash error ${data}`);
  }
}
