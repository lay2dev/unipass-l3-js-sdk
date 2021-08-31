import {
  RawTransaction,
  ResponseInfo,
  RPC,
  TransactionParams,
  UniTokenModel,
} from '.';
import { validators, transaction } from './utils';
export class Transaction implements UniTokenModel {
  constructor(public raw: any, public sig?: string) {}

  validate(): Transaction {
    const data = this.transform() as TransactionParams;
    validators.ValidateRaw(data.raw);
    return this;
  }

  validateRaw(): Transaction {
    const data = transaction.Transform(this.raw);
    validators.ValidateRaw(data);
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
      raw: this.raw,
      sig: this.sig,
    };
  }

  async sendTransaction(rpc: RPC) {
    const transformData = this.transform();
    const data = await rpc.send_ut_transaction(transformData);
    if (data) {
      const rawResponse = data as RawTransaction;
      const txHash = (rawResponse.transform() as ResponseInfo).result;
      return txHash;
    }
    throw new Error(`TxHashError: txhash error ${data}`);
  }
}
