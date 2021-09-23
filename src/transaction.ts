import { RawTransaction, RPC, Sign, TransactionParams, UniTokenModel } from '.';
import { validators, transaction } from './utils';

export class Transaction implements UniTokenModel {
  constructor(public inner: any, public sig?: Sign) {}

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

  async sendTransaction(rpc: RPC) {
    const transformData = this.transform();
    const data = await rpc.send_up_transaction(transformData);
    console.log('-----data------');
    console.log(data);
    if (data) {
      const rawResponse = data as RawTransaction;
      return rawResponse.transform();
    }
    throw new Error(`TxHashError: txhash error ${data}`);
  }
}
