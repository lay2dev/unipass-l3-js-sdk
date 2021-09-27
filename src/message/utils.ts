export enum ActionType {
  REGISTER = 0,
  ADD_LOCAL_KEY,
  QUICK_ADD_LOCAL_KEY,
  DEL_LOCAL_KEY,
  UPDATE_QUICK_LOGIN,
  UPDATE_RECOVERY_EMAIL,
  START_RECOVERY,
  CANCEL_RECOVERY,
  COMPLETE_RECOVERY,
}

enum KeyType {
  RSA,
  Secp256K1,
  Secp256R1,
}

interface PubKey {
  keyType: number;
  key;
}

import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';

declare global {
  interface String {
    hexToBuffer(): Buffer;
  }
}

String.prototype.hexToBuffer = function () {
  const d = String(this);
  return Buffer.from(d.replace('0x', ''), 'hex');
};

// // secp256k1签名逻辑, 此处nodejs写法, 前端使用时替换为： https://github.com/lay2dev/pw-core/blob/7dc6d9915f4eb05818c4d3fb61c40111d6c155e0/src/signers/eth-signer.ts#L45
// export function k1PersonalSign(hash: string, privateKey: string) {
//   const personalHash = hashPersonalMessage(hash.hexToBuffer());
//   const sig = ecsign(personalHash, privateKey.hexToBuffer());
//   return toRpcSig(sig.v, sig.r, sig.s);
// }

// // rsa sign, 此处nodejs写法，前端使用subtleCrypto.sign()
// export function rsaSign(hash: string, key: NodeRSA) {
//   const sig = key.sign(hash.hexToBuffer(), 'hex');
//   return sig;
// }
