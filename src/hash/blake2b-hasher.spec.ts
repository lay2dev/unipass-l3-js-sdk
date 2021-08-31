import test from 'ava';
import { Blake2bHasher } from '.';

test('test reader  hello', (t) => {
  const hasher = new Blake2bHasher();
  const res = hasher.hash('hello').serializeJson();
  // console.log(res);
  t.is(
    res,
    '0x2da1289373a9f6b7ed21db948f4dc5d942cf4023eaef1d5a2b1a45b9d12d1036'
  );
});
