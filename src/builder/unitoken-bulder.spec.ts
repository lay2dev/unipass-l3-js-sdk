import test from 'ava';
import { UniTokenBuilder } from '.';
import { Amount } from '../amount';
import { RPC } from '../rpc';
import { Signer } from './signer';
const rawData = {
  typeId: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  from: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a' + '0'.repeat(24),
  nonce: '0x01',
  fee: '0x1231',
  targets: [
    {
      to: '0xf218d7df3f91877b62d9f8e05b4f9ad86432172a' + '0'.repeat(24),
      amount: '100',
    },
  ],
};
const sig =
  '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8';

const uri = 'https://testnet.ckb.dev';
const rpc = new RPC(uri);
test('test test builder return data', async (t) => {
  const build = new UniTokenBuilder(
    rawData.from,
    rawData.typeId,
    rawData.nonce,
    rawData.targets,
    new Amount('11')
  );
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
