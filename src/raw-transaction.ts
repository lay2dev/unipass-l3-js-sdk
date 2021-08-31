import { transaction, ResponseInfo, UniTokenModel } from '.';

export class RawTransaction implements UniTokenModel {
  constructor(public readonly transactionResult: any) {}

  raw(): ResponseInfo {
    return this.transactionResult;
  }

  transform(): object {
    if (typeof this.transactionResult.result == 'string') {
      return {
        result: this.transactionResult.result,
      };
    }
    return transaction.TransformRawTransaction(this.transactionResult.result);
  }

  serializeJson(): object {
    if (typeof this.transactionResult.result == 'string') {
      return {
        result: this.transactionResult.result,
      };
    }
    return transaction.TransformRawTransaction(this.transactionResult.result);
  }
}
