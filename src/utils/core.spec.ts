import test from 'ava';
import { ArrayBufferReader } from '../reader';
import { core } from './core';

const rawData = {
  nonce: '0x1',
  type: 'register',
  action: {
    registerEmail: 'johnz@lay2.dev',
    pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
    recoveryEmail: null,
    quickLogin: true,
  },
};

test('test core data-=-----', async (t) => {
  const data = core.SerializeInnerTransaction(rawData);
  const reader = new ArrayBufferReader(data);
  console.log('data---reader---', reader.serializeJson());
  t.is(true, true);
});
