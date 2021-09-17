import test from 'ava';
import { RPC, Transaction, TransactionParams } from '.';

const rawData = {
  type: 'register',
  nonce: '0x1',
  username:
    '0x559d201f1891db7cfc7d52f12563e4717c3736cdc0b833d62f4c9433edabb363',
  action: {
    registerEmail:
      '0xf3b0d96aa6f47732f1f6048f57b632d4590fef07928c57017a877c4df6f04ff3',
    pubkey: {
      rsaPubkey: {
        e: 65537,
        n: '0xca8ac6f64477b3cc4a92883c1a5bf148410ec4b41b7a513b3a1b0ef847657534fda99ebe5891832d89ee47eb17fed6cfbf3d8e600e6f93b5e2775389505b83348040cb1274d2139e919d1e321198627b831c143e7655fc31b64877618aa802005a8e49b057c419d1f40362abb93b4099ccb2cebb7e6fbfb15b6de5d0b7a0c3cd40db23a357c8fde2454ed4d84a6c2034bb3e3e8df7726257760cc2e6b0825ba4c84259f57b8e5ee18f4744836c200c5b6767dda462b4e02bd8b0730e962faad79a2d1aea8a0ee76924c344c10c02c1176554ef533f66d574ef3fcb2185afdb35bc288966e9061c3ccadee97430d5e41d3aee4ce907fe2066a97bca187b9e18d1',
      },
    },
    recoveryEmail: {
      firstN: 1,
      threshold: 1,
      emails: [
        '0xf3b0d96aa6f47732f1f6048f57b632d4590fef07928c57017a877c4df6f04ff3',
      ],
    },
    quickLogin: false,
  },
};
const sig = {
  emailHeader: 'johnz',
  signature: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
};

const uri = 'https://testnet.ckb.dev';
const rpc = new RPC(uri);

test('test Transaction formateData', async (t) => {
  const data = new Transaction(rawData, sig);
  const formateData = data.transform();
  console.log('===========================');
  console.log(JSON.stringify(formateData));
  console.log('===========================');
  const type = (formateData as TransactionParams).inner.type;
  t.is(type, rawData.type);
});

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
