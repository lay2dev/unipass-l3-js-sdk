import test from 'ava';
import { TokenInfoResult, TransactionResult } from './interface';
import { RawTransaction } from './raw-transaction';

const txRawData = {
  id: 2,
  jsonrpc: '2.0',
  result: {
    transaction: {
      type_id:
        '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      from: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a',
      nonce: '0x1',
      total_amount: '0x11011',
      fee: '0x123',
      targets: [
        {
          to: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a',
          amount: '0x11011',
        },
      ],
    },
    tx_status: {
      ckb_tx_hash:
        '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
      status: 'pending',
    },
  },
};

const tokenInfoRawData = {
  id: 2,
  jsonrpc: '2.0',
  result: {
    symbol: 'SHIB',
    name: 'SHIB Token',
    decimal: 8,
    issuer:
      '0x356813898f184ef0f4c887604a87156da5a93893258c26185288eb1f2cd9cc60',
    total_supply: '0xde0b6b3a7640000',
  },
};

interface stringResult {
  result: string;
}

const stringRawData = { jsonrpc: '2.0', result: '0x2cb4', id: 2 };

test('test rawTransaction tx formateData', async (t) => {
  const data = new RawTransaction(txRawData);
  const formateData = data.transform() as TransactionResult;
  t.is(formateData.txStatus.ckbTxHash, txRawData.result.tx_status.ckb_tx_hash);
});

test('test rawTransaction tokenInfoRawData ', async (t) => {
  const data = new RawTransaction(tokenInfoRawData);
  const formateData = data.transform() as TokenInfoResult;
  t.is(formateData.totalSupply, tokenInfoRawData.result.total_supply);
});

test('test rawTransaction stringRawData ', async (t) => {
  const data = new RawTransaction(stringRawData);
  const formateData = data.transform() as stringResult;
  t.is(formateData.result, stringRawData.result);
});
