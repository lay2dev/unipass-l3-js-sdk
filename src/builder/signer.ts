import {
  ArrayBufferReader,
  Message,
  RPC,
  Transaction,
  TransactionInner,
} from '..';
import { core } from '../utils';
export class Signer {
  constructor() {}

  public toMessages(tx: Transaction): Message[] {
    tx.validateRaw();
    const uniData = tx.serializeJson().inner as TransactionInner;
    const data = new ArrayBufferReader(core.SerializeInnerTransaction(uniData));
    const message = data.serializeJson();
    console.log('message', data.toString());
    return [{ message }];
  }
}
