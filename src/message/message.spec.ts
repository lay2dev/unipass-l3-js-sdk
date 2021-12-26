import test from 'ava';
import { SignMessage } from '.';
import { ActionType, ChainId, KeyType } from '..';
const NodeRSA = require('node-rsa');
const rsaKey = new NodeRSA(
  `-----BEGIN PRIVATE KEY-----
  MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6HH82NIk1cm+OGE1mvNewjM4wJjwmI4lfctbY+6+5LGw9qfJ6jQX0/na8eSBQPnhooiTIqxNHKTarP5q9Ca4wih9ns4qOT6o9U00fsx4fgTLNArdVAETuhpbxgnfCnMZ/H7ktoacKVQQYArU1GGiWCSAgB47QOBW6dJlXlfPFSe29nIEPc+mm+UXW2xq/iZfxY9f92ALvMw84hoQv7CmpkAi1qw/8n+DD03ruxBZz0FI7fxgqY/vrKXqFu/0n7H2jAokTGKZHGUHwPNvLrDJ0P7Y1+h2/C1Y8n40EiEf+TutSWfhTUwnU5Rz82m4IMThSqxrj6QN2QXJ49wB56XObAgMBAAECggEAQaED8RL0oZ7RnNuQC98i9lSo7wzEoDRe4IRIJCsY6+Uw5EvWQIYTaDIFn+/cx79HyaoH66V8PldXumrK/8d2oBJNAc4r2YRZRZfm9fs9b6GpTucazEQ0iqJ2fwLhhYSwcKq4q9E57OhO8cKesPMDCol8RR81KtLkQqSUYHD2DgcpINaL1SFZNn9RcrOs53Ma1b27WOt+TivUDOLsAt9AvtVuzr5S2jUjnLVvNngGbmamotfuhDYAV9SzeYiwFOpfPnsw+4Lq7egWVXGfUZcR962xxzjvDaGuNUsif8rcTMxKl9aywYWfPNMUByeCmspbf+eWqp11VHWevrDVfyxQEQKBgQD5Ba6uzKb25dS3lkU3acigKHFKk5JXtSdraO0cEEcYHCqVJFBUBW3zZ0eMFQkFY4WJFJDGIy11A9w3LVvd3PbT2Hm/H5zXgzIAhCGS4YLmcBVn3Zrg8HHdlYxknUaJ57JjQceAtQ/RcidMdcGdx6IX+4sOTv99qEpyXT8Yn0OZ6wKBgQC/U4jEfXD8qMGGpcZFqoFl7Wsgfb37RkBGv7WTxSbvwTmAQqTRTjZSQSWH0oiPqnxu9LYtVr9JIh8P6T3TbeoO31O1DqbPYclmWQx4v9HkOygDdtIpHGt91kmktnGfbi0DSUdaAwzLhmPWAiRokOy5wFdVsdEagvS+cz5/UBLxEQKBgQDelXCtN6op2AcJzhyySjCUz3FsWnmdQgQpItGFmxsg9tQtGRdf8rZzsSYnlQnKMknC3IoHQJw6Eqg8/aM2rXJGqyEvb39OtyrzgSdNVZsehKLtgwwT8Xeluy2RJW9OhrZRuBMt/SlVafashjj44d8GFsYVlRETbWCV1rk2Ne1D3wKBgEsscTJy7y/2xoM3I15ADjOUQ2EyxrCx+5NQw/FZp2DQlN02UjgC+Qj8m9hv+kQogle+Qs4xpVsA0x+XTzmBmFNboDIlnZkiHNXf6yyOgdOhAqnJx+1rQzjgN3NGVAKGcZ0275gIVsCo/xUZJmEHgFvDnQ0IntZB2hPyh/3R4n9hAoGBAIZZHGa9X8PzspJUjyuvn2k/HQIj8hsymtCJPbzTc4NSqlIj2EfrN07WhoaT81bfZ4NGMgIE/2UCbk4iUJNJUJrg8UHQscIXJajd4pBESbVcPgPH2nbNpW5qKDrL5fWA4AGjoWqeGnnb1aUPMllS1rbjVdnb3RzVblre6V4lGNaD
  -----END PRIVATE KEY-----`
);
rsaKey.setOptions({ signingScheme: 'pkcs1-sha256' });

const rawData = {
  chainId: 1,
  action: 0,
  username:
    '0xe88e6cc723d239c8817fce42a8aad67782eef2a02b153e89b9909fe1fbc386b1',
  pubKey:
    '0x000100018c91c4e5ff680db92830f928a1ec760e374e9974f413cd1822ee08981add388d80206e19198ae36367a02ccd70cb3ed7b10aa8c4613bb2ac24dd9489f94e14e56cd2ee2185c78677ed7f342c0110c8f15fbf62a369b2d9d3bdbb03d157127abc550703f202f2c9143ba4a924c07943af0c83ce01edffa7158d992b1dd669fde99a8eac7cc8cd1830490ae8aba220352f4547565f3d565e169cfe8cc8a34d1883d11b54a369e99a06f4b8a5df65defa6f9d2947c2c9e75e0d7faa65b41827096769708d8c51489b3c8b9f9e647f2804e072f6c345f6dd34531f648d237cdf1f77f870b95ab979698ff302a6c51fd6ac7fc6350a74e4fc4ac0444ac0eee693deb7',
  keyType: 0,
  registerEmail:
    '0xa5479138e3c60ddca59afbba6d8689fa959dcb9eba2089bc2b99d22cd0b5d308',
};

test('test Transaction getSignMessage validate', async (t) => {
  console.log(rawData);
  const data = new SignMessage(rawData);
  const hash = await data.messageHash();
  const sig = rsaKey.sign(hash.hexToBuffer(), 'hex');
  console.log('hash', hash);
  console.log('rsaSig', sig);
  t.is(hash.length, 748);
});
