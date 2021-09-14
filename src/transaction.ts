import {
  ArrayBufferReader,
  RawTransaction,
  Reader,
  RecoveryEmail,
  RegisterInner,
  RPC,
  Rsa,
  RsaPubkey,
  StringReader,
  TransactionParams,
  UniTokenModel,
} from '.';
import { validators, transaction } from './utils';

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

  testSignMessage(): string {
    this.validateRaw();
    const NodeRSA = require('node-rsa');
    const key = new NodeRSA(
      '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEogIBAAKCAQEA0i4KvHsZ2DjpVMvG9hYCloaxTy+2hIyAvNjIz/mkkbDafqFg\n' +
        'ock0UrjEWmpbzsYryg3PGBwHuXJ6E9rVG3Gf9Vwkrgx64/eGhnlJbslQooaSJJKv\n' +
        'xh6bM1D4BQGqDM6sAeFZXgn4XKsOV5Au5pjC2DxPr2YylN/lf0sQFYd5vy4OPHj8\n' +
        'xSr6nrU/zSamnbqMGJsDmuUqq4NHUas1s9/Z9WzHU22z4SYflCkghe+6YfNJX/Kc\n' +
        'ip9YrKnMu5qxV6XvhH4CUKUQfCBpYknRNsn62QLKqSvcadaIGa/wgH92dKlM3Wv8\n' +
        '1nQi9+sn+MqcCRnwb/w8dq3hynXxcnXDuKt8bwIDAQABAoIBABgcTAL/JCHXtXyS\n' +
        'u8ozECzwWpq44HkoHQSM4cxp2OUVoprwLEOi7yumInA0zz9TIGbXWrBrVr+BUFvC\n' +
        'uLujNzRQU6zbpaVNGdOHSlM5KNTcFxu28A8MJ8WlPi5k2HsLolO85CGThzgqL0UA\n' +
        'N0EguQlRMdrvIFJPtOX7WGb/2YmCq7aShsNagBrePYo5hIts7cdBCsprVv+/NO3r\n' +
        '9fnoEz8EeMmF+oRiPBQzuV2wY/AKPHhK5vPVahZinbDaHzMfRyCR1YgjN+aZGmlR\n' +
        'ZOGxM/k85qoD1gzoQ+gbJovv3oro9EEe9NFQ9EPxUozutgQuVqFDjSXLKIIyFI4f\n' +
        'ocwRqBECgYEA9R27+W6rP2AjnppyrphuZfsdPJO9iLrMorQfUEcKQe1sFE6X24GE\n' +
        'zA0aYRcKab6fT+bzpsPK6gc31PsWtzjtyJJK63RrUCchf1AW+lLvvCuCmXy1aQX7\n' +
        '2Gg+/opfNOPdrgc1/GV1IqiSkQnP5Dcq+8SsfJhjSCfqw6Re1g4aXasCgYEA24Mu\n' +
        'sy86fSfg9L6v7K7146PmLZwXlHyolzqP6vItv4/g1WlC8ffQtdqPEadck5GdgjS1\n' +
        'tOrYC1vNOTeiattH6NdVi8tg6Mqk2PZ8uYAlgqE2Xxy2vOqNOahY81rEtYTTjIOy\n' +
        'XDw5T9LvfVFp5fayc9TZKvLqkHaHaF3qzNnH8E0CgYB8ROjqGquDY/BrFo6R6gH+\n' +
        'fgNilNyAl4Pr8Tn27y1KI16qJPZkeROkh/gZxR6oYdZPIh3hLF6Rq7sopWvs1FXp\n' +
        'XBHTsaA+cLhQ3X/oxWd5lO2Pd2RZrIj0PFXDos+F9wiKlGlQXve17JTyJ3FYmIeY\n' +
        'QSvZt0COcn5ZVdom19uSJQKBgGVsqoI+Wy8C4w0SomSgvppM24jNa5O/OYKOm3q6\n' +
        'JWsyhnb06Oq2TygHcT197+d7S6SiyCZssCAnbZ53V0M6SHKMNEmgUgmdwCdDVIO9\n' +
        'cxd1d5LgyIpncZNndpoSoXshgUGWhC3b4btBQkjL+js4DmI4wZL3pGvVaGFPq7K1\n' +
        'GY2tAoGARugtayfujDrYMiwfrQL4kbh7dOv62cKpeRPB3/YBuFNJ7l7uWo/M/DJT\n' +
        'k/iV4IzeX8o6FzI9GXCj/TwIXLofZi9ENOg6kLSYI6YqmYHG3f0ZNDQfceN5d7j3\n' +
        'pYftxwl9EbsnXUW8tL90UbPB2nI0z6IqJOtg+XOzEH/u7n8EK+I=\n' +
        '-----END RSA PRIVATE KEY-----'
    );

    let keyObject = key.exportKey('components');
    // 因为molecule是小端编码，所以需要使用reverse 方法逆序排序
    let n = new Uint8Array(keyObject.n.slice(1)).reverse();
    let e = new Uint32Array([keyObject.e]).reverse();

    let pubkey = new RsaPubkey(new Rsa(e.buffer, n.buffer));
    let emails = [];
    for (let i = 0; i < 32; i++) {
      emails[i] = new ArrayBuffer(32);
    }
    let inner = new RegisterInner(
      new Reader(new ArrayBuffer(32)),
      new Reader(new ArrayBuffer(32)),
      pubkey,
      new RecoveryEmail(1, 1, emails)
    );
    const message = inner.serialize();
    return message;
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
