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
      commit_status: 'committed',
      local_keys: [
        {
          secp256k1: '0x68514d4a157aa662e79682184be0b94a42f6b5b4',
        },
        {
          rsa_pubkey: {
            e: 65537,
            n: '0xb96f3a23b4dc3e5bbddde8e9f6bc5ad6e309f24efd5c1e3f763108121995ff847e52db6dcf310fb0360f9d9cafea6a034ad38bbaa4bdecd599b0d8d5196c496cbe212dc31fc94f62b50aa56140b1cad9a37715a3b117773fe7652e582b78facc700d21057d99b60a8809b5694448bbbe16398baa8dfcc6977fdf4c17e046182ef3e9ea94326ced855f8181fa582815fdc563b40f987459fe30fa5b35b6954a1d7c33c0925fe9f092ebf41460b17b57c46a1dd841da5fa54c7471f53579e7cb7e7c2b69255ebe0b2da8a335f0e85b508fd5e2b5ca568128a7fa815a111dbf8d75ba640a502684833da1093481a980b2eb3e005b7952382dbbba4190010d909715',
          },
        },
      ],
      nonce: '0x2',
      quick_login: false,
      recovery_email: null,
      register_email:
        '0xea196b650027e538de43667b4b312746f35145f00afed5bef9a6368c2c309988',
      username:
        '0x2a1eb676171606ea0c6ffad366ddee63cd2c2c8fa2ac99da0334862f4290c140',
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
  const formateData = data.transform() as UserInfoResult[];
  console.log(formateData, userInfoRawData);

  t.is(formateData[0].registerEmail, userInfoRawData.result[0].register_email);
});

// test('test rawTransaction stringRawData ', async (t) => {
//   const data = new RawTransaction(stringRawData);
//   const formateData = data.transform();
//   console.log(formateData);
//   t.is(formateData, stringRawData.result);
// });
