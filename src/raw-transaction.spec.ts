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
  jsonrpc: '2.0',
  result: [
    {
      local_keys: [
        {
          rsa_pubkey: {
            e: 65537,
            n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
          },
        },
      ],
      nonce: '0x1',
      quick_login: false,
      recovery_email: {
        emails: [
          '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
        ],
        first_n: 1,
        threshold: 1,
      },
      register_email:
        '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
      username:
        '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
    },
  ],
  id: 4627112,
};

interface stringResult {
  result: string;
}

const stringRawData = { jsonrpc: '2.0', result: '0x2cb4', id: 2 };

// test('test rawTransaction tx txRawData', async (t) => {
//   const data = new RawTransaction(txRawData);
//   const formateData = data.transform() as TransactionResult;
//   console.log(formateData);
//   t.is(formateData.txStatus.ckbTxHash, txRawData.result.tx_status.ckb_tx_hash);
// });

// test('test rawTransaction historyTxRawData ', async (t) => {
//   const data = new RawTransaction(historyTxRawStringData);
//   const formateData = data.transform() as TransactionResult[];
//   console.log(formateData);
//   t.is(
//     formateData[0].txStatus.ckbTxHash,
//     historyTxRawStringData.result[0].tx_status.ckb_tx_hash
//   );
// });

test('test rawTransaction userInfoRawData ', async (t) => {
  const data = new RawTransaction(userInfoRawData);
  const formateData = data.transform() as UserInfoResult;
  console.log(formateData);
  t.is(formateData.registerEmail, userInfoRawData.result[0].register_email);
});

// test('test rawTransaction stringRawData ', async (t) => {
//   const data = new RawTransaction(stringRawData);
//   const formateData = data.transform();
//   console.log(formateData);
//   t.is(formateData, stringRawData.result);
// });
