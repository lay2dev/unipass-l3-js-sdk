import test from 'ava';
import { RPC } from '.';

const uri = 'https://testnet.ckb.dev';
const rpc = new RPC(uri);

test('test aggregator rpc get_token_info', async (t) => {
  const data = await rpc.get_token_info(['sss']);
  t.is(true, true);
});

test('test aggregator rpc get_token_balance', async (t) => {
  const data = await rpc.get_token_balance(['sss']);
  t.is(true, true);
});

test('test aggregator rpc get_ut_transaction_by_hash', async (t) => {
  const data = await rpc.get_ut_transaction_by_hash(['sss']);
  t.is(true, true);
});

test('test aggregator rpc get_ut_token_nonce', async (t) => {
  const data = await rpc.get_ut_token_nonce(['sss']);
  t.is(true, true);
});

test('test aggregator rpc send_ut_transaction', async (t) => {
  const data = await rpc.send_ut_transaction(['sss']);
  t.is(true, true);
});

test('test  rpc get_transactions', async (t) => {
  const data = await rpc.get_transaction([
    '0x302633eb50d5c5ea331f1bd573f31ff3d24579a78df8b9acae6e6532a0589990',
  ]);
  t.is(true, true);
});

test('test rawTransaction', async (t) => {
  const data = await rpc.get_transaction(
    '0x302633eb50d5c5ea331f1bd573f31ff3d24579a78df8b9acae6e6532a0589990'
  );
  const tr = data.raw();
  t.is(true, true);
});
