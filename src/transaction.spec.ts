import test from 'ava';
import { Transaction } from '.';

const rawData = {
  typeId: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  from: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a',
  nonce: '0x1',
  totalAmount: '0x11011',
  fee: '0x123',
  targets: [
    {
      to: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a',
      amount: '0x11011',
    },
  ],
};
const sig = '0x11011';
interface TransactionParams {
  raw: {
    typeId: string;
    from: string;
    nonce: string;
    total_amount: string;
    fee: string;
  };
  sig: string;
}

test('test Transaction formateData', async (t) => {
  const data = new Transaction(rawData, sig);
  const formateData = data.transform();
  const total_amount = (formateData as TransactionParams).raw.total_amount;
  t.is(total_amount, rawData.totalAmount);
});

test('test Transaction serializeJson', async (t) => {
  const data = new Transaction(rawData, sig);
  const jsonData = data.serializeJson();
  t.is(jsonData.raw.totalAmount, rawData.totalAmount);
});

test('test Transaction validate', async (t) => {
  const data = new Transaction(rawData, sig);
  const transaction = data.validate();
  t.is(transaction.raw.totalAmount, rawData.totalAmount);
});
