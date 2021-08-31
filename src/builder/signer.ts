import {
  ArrayBufferReader,
  Message,
  RPC,
  Transaction,
  UniTransaction,
} from '..';
import { sst } from '../utils';
export class Signer {
  constructor() {}

  public toMessages(tx: Transaction): Message[] {
    tx.validateRaw();
    const uniData = tx.serializeJson().raw as UniTransaction;
    for (let item of uniData.targets) {
      item.to = item.to + '0'.repeat(24);
    }
    uniData.from = uniData.from + '0'.repeat(24);

    const data = new ArrayBufferReader(
      sst.SerializeRawLedgerTransaction(uniData)
    );
    const message = data.serializeJson();

    console.log('message', data.toString());
    return [{ message }];
  }
}
