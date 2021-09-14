import test from 'ava';
import { Transaction } from '.';

const rawData = {
  nonce: '0x1',
  type: 'register',
  username: 'aven',
  pubkey: {
    type: 'RsaPubkey',
    value: {
      e: '0x11',
      n: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
    },
  },
  action: {
    registerEmail: 'johnz@lay2.dev',
    pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
    recoveryEmail: null,
    quickLogin: false,
  },
};
const sig = '0x11011';

// const uri = 'https://testnet.ckb.dev';
// const rpc = new RPC(uri);

// test('test Transaction formateData', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const formateData = data.transform();
//   const type = (formateData as TransactionParams).inner.type;
//   t.is(type, rawData.type);
// });

// test('test Transaction serializeJson', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const jsonData = data.serializeJson();
//   t.is(jsonData.inner.action.registerEmail, rawData.action.registerEmail);
// });

// test('test Transaction validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const transaction = data.validate();
//   t.is(transaction.inner.action.registerEmail, rawData.action.registerEmail);
// });

// test('test Transaction sendTransaction validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   await data.sendTransaction(rpc);
//   t.is(true, true);
// });

// test('test Transaction getSignMessage validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const signMessage = await data.getRegisterSignMessageByRSA();
//   console.log(signMessage);
//   t.is(true, true);
// });
