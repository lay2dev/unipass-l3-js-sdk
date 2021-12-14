import test from 'ava';
import { RPC, RpcActionType, Transaction, TransactionParams } from '.';

const rawDataRegister = {
  type: 'register',
  nonce: '0x1',
  username:
    '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
  action: {
    oriUsername: 'zz@qq.com',
    // source: 'unipass-wallet',
    registerEmail:
      '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
    quickLogin: false,
    pubkey: {
      rsaPubkey: {
        e: 65537,
        n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
      },
    },
    recoveryEmail: {
      threshold: 1,
      firstN: 1,
      emails: [
        '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
      ],
    },
  },
};
const rawDataAddKey = {
  type: 'add_key',
  nonce: '0x2',
  username:
    '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
  action: {
    pubkey: {
      rsaPubkey: {
        e: 65537,
        n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
      },
    },
  },
};

const rawDataDeleteKey = {
  type: 'delete_key',
  nonce: '0x2',
  username:
    '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
  action: {
    pubkey: {
      rsaPubkey: {
        e: 65537,
        n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
      },
    },
  },
};

const rawUpdateRecoveryEmail = {
  type: 'update_recovery_email',
  nonce: '0x2',
  username:
    '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
  action: {
    recoveryEmail: {
      threshold: 1,
      firstN: 1,
      emails: [
        '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
      ],
    },
  },
};

const rawUpdateQuickLogin = {
  type: 'update_quick_login',
  nonce: '0x1',
  username:
    '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
  action: {
    registerEmail:
      '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
    quickLogin: false,
    pubkey: {
      rsaPubkey: {
        e: 65537,
        n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
      },
    },
    recoveryEmail: {
      threshold: 1,
      firstN: 1,
      emails: [
        '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
      ],
    },
  },
};

const rawRecovery = {
  type: RpcActionType.START_RECOVERY_1,
  nonce: '0x2',
  username:
    '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
  action: {
    pubkey: {
      rsaPubkey: {
        e: 65537,
        n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
      },
    },
    replace: true,
  },
};

const sig = {
  signature:
    '0xb369f79cf1c75b9616139e5a902c1784aa92a4b714c830eb73c508663559ba54f5e76777cdf7c1d087d5f8681d7cea9eca70d7cc3918bd82cb6755b3c73ac993e901ccea773150cf50b79e372a67b9d04253b1d3fd2eeb8ebf41ad825a25b42f87a0931f05275a1a9cae319f832503df83441132da9d8313b467b6227e95cae0b81e6d94f1335bff0d19a1071296d7c6b98068fe19c8a283958b0298bb8f7ffe1dd51bb0c0e5f04d6c2b5d76324eed8048aafedc9aa5621e057f4996308e4f0bd02dbf4b92ec1239c7c9cb90d688f6019956400c7bf179eb7d1ab06a21d8747007489025ec77c225ecd4827bb78d6bbc9cbb7db3d2bc7a8e5dd53fdb4a3d919f',
  adminSignature:
    '0xb369f79cf1c75b9616139e5a902c1784aa92a4b714c830eb73c508663559ba54f5e76777cdf7c1d087d5f8681d7cea9eca70d7cc3918bd82cb6755b3c73ac993e901ccea773150cf50b79e372a67b9d04253b1d3fd2eeb8ebf41ad825a25b42f87a0931f05275a1a9cae319f832503df83441132da9d8313b467b6227e95cae0b81e6d94f1335bff0d19a1071296d7c6b98068fe19c8a283958b0298bb8f7ffe1dd51bb0c0e5f04d6c2b5d76324eed8048aafedc9aa5621e057f4996308e4f0bd02dbf4b92ec1239c7c9cb90d688f6019956400c7bf179eb7d1ab06a21d8747007489025ec77c225ecd4827bb78d6bbc9cbb7db3d2bc7a8e5dd53fdb4a3d919f',
};

const uri = 'http://112.124.64.189:3030';
const rpc = new RPC(uri);

// test('test Transaction formateData', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const formateData = data.transform();
//   const type = (formateData as TransactionParams).inner.type;
//   t.is(type, rawData.type);
// });

// test('test Transaction serializeJson', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const jsonData = data.serializeJson();
//   t.is(jsonData.inner.type, rawData.type);
// });

// test('test Transaction validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const transaction = data.validate();
//   t.is(transaction.inner.action.registerEmail, rawData.action.registerEmail);
// });

test('test Transaction sendTransaction validate', async (t) => {
  const data = new Transaction(rawDataRegister, sig);
  console.log((data.transform() as TransactionParams).sig);
  console.log((data.transform() as TransactionParams).inner);
  // const ckbTxHash = await data.sendTransaction(rpc);
  // console.log(ckbTxHash);
  t.is(true, true);
});
