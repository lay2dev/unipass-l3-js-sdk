import test from 'ava';
import { TransactionResult, UserInfoResult } from './interface';
import { RawTransaction } from './raw-transaction';

const txRawData = {
  id: 2,
  jsonrpc: '2.0',
  result: {
    transaction_inner: {
      nonce: '0x1',
      type: 'register',
      action: {
        register_email: 'johnz@lay2.dev',
        pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
        recovery_email: null,
        quick_login: true,
      },
    },
    tx_status: {
      ckb_tx_hash:
        '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
      status: 'pending',
    },
  },
};

const historyTxRawStringData = {
  id: 2,
  jsonrpc: '2.0',
  result: [
    {
      transaction_inner: {
        nonce: '0x1',
        type: 'register',
        action: {
          register_email: 'johnz@lay2.dev',
          pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
          recovery_email: null,
          quick_login: true,
        },
      },
      tx_status: {
        ckb_tx_hash:
          '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
        status: 'pending',
      },
    },
    {
      transaction_inner: {
        nonce: '0x1',
        type: 'register',
        action: {
          register_email: 'johnz@lay2.dev',
          pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
          recovery_email: null,
          quick_login: true,
        },
      },
      tx_status: {
        ckb_tx_hash:
          '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
        status: 'pending',
      },
    },
  ],
};

const userInfoRawData = {
  id: 2,
  jsonrpc: '2.0',
  result: {
    register_email: 'johnz@lay2.dev',
    quick_login: false,
    local_keys: [
      '01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
      '02f376bdc2590c720d0d0c32cbebf9bb4c7cddc09b880c4a85ad86f625ff614bf3cf50c16a18f0a954c14104c729698a976246d6403010b107d9c02f4b4711f577',
      '03000800000100010027235838be9d2044c72aabcfeab3ca368ea10988d700b49e7aef7810fce9a83742ec43e5e7b935ac08e4bbb8b72056722a6fff64d59eb6ac31813d827df4807f64c9c5179eba3624286aa3cdfb2da75ef644c1f88589567bc7f0ba84841be9d847c46c48861be9b478dd79c5a8465e85bc8ce817bfd3e6e3cc65e68d12858a0ff3abe7b4833ccdd5c2f0f4bb086d3042c9ef69ace4afd41f427f16377ac31c25c207916457394a9242499576b7f62502f203783edc1e7ad071a0012f1e880a74c9c6c44b3b46abbeb7979029d0effab8b92575e6385caec73df68ee8c0d9887636183d338193ee93981f93651b13ec763482ea62ada18833f8e0e887157815c3',
    ],
    recovery_email: {
      threshold: 1,
      first_n: 1,
      emails: ['johnz@lay2.dev'],
    },
    pending_state: {
      pending_key: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
      replace_old: false,
      time_cell:
        '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    },
  },
};

interface stringResult {
  result: string;
}

const stringRawData = { jsonrpc: '2.0', result: '0x2cb4', id: 2 };

test('test rawTransaction tx txRawData', async (t) => {
  const data = new RawTransaction(txRawData);
  const formateData = data.transform() as TransactionResult;
  console.log(formateData);
  t.is(formateData.txStatus.ckbTxHash, txRawData.result.tx_status.ckb_tx_hash);
});

test('test rawTransaction historyTxRawData ', async (t) => {
  const data = new RawTransaction(historyTxRawStringData);
  const formateData = data.transform() as TransactionResult[];
  console.log(formateData);
  t.is(
    formateData[0].txStatus.ckbTxHash,
    historyTxRawStringData.result[0].tx_status.ckb_tx_hash
  );
});

test('test rawTransaction userInfoRawData ', async (t) => {
  const data = new RawTransaction(userInfoRawData);
  const formateData = data.transform() as UserInfoResult;
  console.log(formateData);
  t.is(formateData.registerEmail, userInfoRawData.result.register_email);
});

test('test rawTransaction stringRawData ', async (t) => {
  const data = new RawTransaction(stringRawData);
  const formateData = data.transform();
  console.log(formateData);
  t.is(formateData, stringRawData.result);
});
