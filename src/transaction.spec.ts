import test from 'ava';
import { Transaction, TransactionParams } from '.';

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
const sig = '0x11011';

test('test Transaction formateData', async (t) => {
  const data = new Transaction(rawData, sig);
  const formateData = data.transform();
  const type = (formateData as TransactionParams).inner.type;
  t.is(type, rawData.type);
});

test('test Transaction serializeJson', async (t) => {
  const data = new Transaction(rawData, sig);
  const jsonData = data.serializeJson();
  t.is(jsonData.inner.action.registerEmail, rawData.action.registerEmail);
});

test('test Transaction validate', async (t) => {
  const data = new Transaction(rawData, sig);
  const transaction = data.validate();
  t.is(transaction.inner.action.registerEmail, rawData.action.registerEmail);
});
