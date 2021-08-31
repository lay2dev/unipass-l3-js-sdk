import { Amount, Transaction } from '..';

export abstract class Builder {
  protected constructor() {}

  abstract build(): Transaction;
}
