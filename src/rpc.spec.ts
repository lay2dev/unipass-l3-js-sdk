import test from 'ava';
import { hashData, RPC } from '.';

const uri = 'http://112.124.64.189:3030';
const rpc = new RPC(uri);

const raw = {
  inner: {
    nonce: '0x1',
    type: 'register',
    action: {
      register_email: 'johnz@lay2.dev',
      pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
      recovery_email: null,
      quick_login: true,
    },
  },
  sig: '...email boy...',
};

// test('test aggregator rpc get_user_info', async (t) => {
//   const data = await rpc.get_user_info(
//     hashData('aven1'),
//     hashData('751733381@qq.com')
//   );
//   console.log(data);
//   t.is(true, true);
// });

// test('test aggregator rpc get_up_transaction_by_hash', async (t) => {
//   const data = await rpc.get_up_transaction_by_hash(
//     '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'
//   );
//   t.is(true, true);
// });

test('test aggregator rpc get_up_nonce', async (t) => {
  const data = await rpc.get_up_nonce(hashData('aven'));
  t.is(true, true);
});

// test('test aggregator rpc get_up_transaction_history', async (t) => {
//   const data = await rpc.get_up_transaction_history('johnz');
//   t.is(true, true);
// });

// test('test  rpc send_up_transaction', async (t) => {
//   const data = await rpc.send_up_transaction(raw);
//   t.is(true, true);
// });
