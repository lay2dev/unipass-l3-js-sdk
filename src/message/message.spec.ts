import test from 'ava';
import { SignMessage } from './sign-message';

const rawData = {
  action: 'register',
  username: 'aven',
  pubkey: {
    type: 'RsaPubkey',
    value: {
      e: 'AQAB',
      n: 'nz8MOIXWsX_VOpO_bqVpU3lK7AzBhf3t_49PMN8PToYwY6xHJSHDI2rwvUmIPkbqUrYUmimWRwQU7SdRICGyIu3IFKQ',
    },
  },
  registerEmail: 's@qq.com',
};

test('test Transaction getSignMessage validate', async (t) => {
  const data = new SignMessage(rawData);
  const signMessage = await data.sign();
  console.log(signMessage);
  t.is(signMessage.length, 748);
});
