import { Builder } from '.';
import { Amount, AmountUnit } from '../amount';
import { Targets } from '../interface';
import { Transaction } from '../transaction';

export class UniTokenBuilder extends Builder {
  constructor(
    private from: string,
    private typeId: string,
    private nonce: string,
    protected targets: Targets[],
    protected fee = Amount.ZERO
  ) {
    super();
  }
  build(): Transaction {
    let totalAmount = Amount.ZERO;
    for (let item of this.targets) {
      const amount = new Amount(item.amount, AmountUnit.ckb);
      item.amount = amount.toHexString();
      totalAmount = totalAmount.add(amount);
    }

    const raw = {
      totalAmount: totalAmount.toHexString(),
      typeId: this.typeId,
      from: this.from,
      nonce: this.nonce,
      targets: this.targets,
      fee: this.fee.toHexString(),
    };

    const tx = new Transaction(raw);

    return tx;
  }
}
