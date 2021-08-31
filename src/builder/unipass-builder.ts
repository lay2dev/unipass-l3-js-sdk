import { Builder } from '.';
import { Amount, AmountUnit } from '../amount';
import { Action, Targets } from '../interface';
import { Transaction } from '../transaction';

export class UniPassBuilder extends Builder {
  constructor(
    private type: string,
    private nonce: string,
    protected action: Action
  ) {
    super();
  }
  build(): Transaction {
    const inner = {
      nonce: this.nonce,
      type: this.type,
      action: this.action,
    };
    console.log(inner);
    const tx = new Transaction(inner);

    return tx;
  }
}
