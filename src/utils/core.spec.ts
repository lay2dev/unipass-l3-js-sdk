import test from 'ava';
import { ArrayBufferReader } from '../reader';
import { core } from './core';

const rawData = {
  typeId: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  from: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a' + '0'.repeat(24),
  nonce: '0x01',
  fee: '0x12',
  totalAmount: '0x12',
  targets: [
    {
      to: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a' + '0'.repeat(24),
      amount: '0x12',
    },
  ],
};

test('test core data-=-----', async (t) => {
  const data = core.SerializeInnerTransaction(rawData);
  console.log('data------', data.byteLength);
  const reader = new ArrayBufferReader(data);
  console.log('data---reader---', reader.serializeJson());
  t.is(true, true);
});
