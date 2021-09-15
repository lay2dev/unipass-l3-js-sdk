import test from 'ava';
import { SignMessage } from './sign-message';

const rawData = {
  action: 'register',
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

test('test Transaction getSignMessage validate', async (t) => {
  const data = new SignMessage(rawData);
  const signMessage = await data.sign();
  t.is(signMessage.length, 748);
});
