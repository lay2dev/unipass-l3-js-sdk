import { transaction, ResponseInfo, UniTokenModel } from '.';

export class RawTransaction implements UniTokenModel {
  constructor(public readonly transactionResult: any) {}

  raw(): ResponseInfo {
    return this.transactionResult;
  }

  transform(): object | string {
    if (typeof this.transactionResult.result == 'string') {
      return this.transactionResult.result;
    }
    return transaction.TransformRawTransaction(this.transactionResult.result);
  }

  serializeJson(): object | string {
    if (typeof this.transactionResult.result == 'string') {
      return this.transactionResult.result;
    }
    return transaction.TransformRawTransaction(this.transactionResult.result);
  }
}
