import test from 'ava';
import { UniPassBuilder } from '.';
import { Amount } from '../amount';
import { RPC } from '../rpc';
import { Signer } from './signer';
const rawData = {
  type: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  nonce: '0x01',
  action: {
    registerEmail: 'johnz@lay2.dev',
    pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
    recoveryEmail: null,
    quickLogin: true,
  },
};
const sig =
  '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8';

const uri = 'https://testnet.ckb.dev';
const rpc = new RPC(uri);
test('test test builder return data', async (t) => {
  const build = new UniPassBuilder(rawData.type, rawData.nonce, rawData.action);
  const tx = build.build();
  const signer = new Signer().toMessages(tx);
  if (signer) {
    const message = signer[0];
    // todo  sign
    console.log(message);
  }
  tx.setSig(sig);
  const txHash = await tx.sendTransaction(rpc);
  tx.setSig(txHash);
  t.is(true, true);
});
