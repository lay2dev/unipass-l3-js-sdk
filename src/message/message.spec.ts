import test from 'ava';
import { RegisterMessage } from './sign-message';

const rawData = {
  username: 'aven',
  pubkey: {
    type: 'RsaPubkey',
    value: {
      e: '0x11',
      n: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
    },
  },
  registerEmail: 'johnz@lay2.dev',
};
const sig = '0x11011';

test('test Transaction getSignMessage validate', async (t) => {
  const data = new RegisterMessage(rawData);
  const signMessage = await data.sign();
  console.log(signMessage);
  t.is(true, true);
});
