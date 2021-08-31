import {
  ArrayBufferReader,
  Message,
  RPC,
  Transaction,
  TransactionInner,
} from '..';
import { sst } from '../utils';
export class Signer {
  constructor() {}

  public toMessages(tx: Transaction): Message[] {
    tx.validateRaw();
    const uniData = tx.serializeJson().inner as TransactionInner;
    const data = new ArrayBufferReader(sst.SerializeInnerTransaction(uniData));
    const message = data.serializeJson();
    console.log('message', data.toString());
    return [{ message }];
  }
}
