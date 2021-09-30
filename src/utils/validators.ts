import { RpcActionType } from '../interface';

function assertObject(debugPath: string, object: object) {
  if (!(object instanceof Object)) {
    throw new Error(`${debugPath} is not an object!`);
  }
}

function assertObjectWithKeys(
  debugPath: string,
  object: object,
  expectedKeys: string[],
  optionalKeys = []
) {
  assertObject(debugPath, object);
  const providedKeys = Object.keys(object).sort();
  const requiredLength = expectedKeys.length;
  const maximalLength = expectedKeys.length + optionalKeys.length;
  const errorMessage = `${debugPath} does not have correct keys! Required keys: [${expectedKeys
    .sort()
    .join(', ')}], optional keys: [${optionalKeys
    .sort()
    .join(', ')}], actual keys: [${providedKeys.join(', ')}]`;
  if (
    providedKeys.length < requiredLength ||
    providedKeys.length > maximalLength
  ) {
    throw new Error(errorMessage);
  }
  let optionalProvidedKeys = providedKeys.filter(
    (key) => !expectedKeys.includes(key)
  );
  if (providedKeys.length - optionalProvidedKeys.length !== requiredLength) {
    throw new Error(errorMessage);
  }
  if (optionalProvidedKeys.find((key) => !optionalKeys.includes(key))) {
    throw new Error(errorMessage);
  }
}

export function ValidateTarget(target: any, { debugPath = 'target' } = {}) {
  assertObjectWithKeys(debugPath, target, ['to', 'amount'], []);
}
export function ValidatePubkey(raw: any, { debugPath = 'action' } = {}) {
  if (raw.rsa_pubkey) {
    assertObjectWithKeys(debugPath, raw, ['rsa_pubkey'], []);
  } else if (raw.secp256k1) {
    assertObjectWithKeys(debugPath, raw, ['secp256k1'], []);
  } else if (raw.secp256r1) {
    assertObjectWithKeys(debugPath, raw, ['secp256r1'], []);
  } else {
    assertObjectWithKeys(
      debugPath,
      raw,
      ['rsa_pubkey', 'secp256k1', 'secp256r1'],
      []
    );
  }
}

export function ValidateRecoveryEmail(raw: any, { debugPath = 'action' } = {}) {
  assertObjectWithKeys(debugPath, raw, ['threshold', 'first_n', 'emails'], []);
}

export function ValidateAction(
  raw: any,
  { debugPath = 'action', action = null } = {}
) {
  if (action) {
    switch (action) {
      case RpcActionType.REGISTER:
        assertObjectWithKeys(
          debugPath,
          raw,
          [
            'register_email',
            'pubkey',
            'quick_login',
            'recovery_email',
            'source',
          ],
          []
        );
        ValidatePubkey(raw.pubkey);
        ValidateRecoveryEmail(raw.recovery_email);
        break;
      case RpcActionType.ADD_KEY:
        assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
        ValidatePubkey(raw.pubkey);
        break;
      case RpcActionType.DEL_KEY:
        assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
        ValidatePubkey(raw.pubkey);
        break;
      case RpcActionType.UPDATE_RECOVERY_EMAIL:
        assertObjectWithKeys(debugPath, raw, ['recovery_email'], []);
        ValidateRecoveryEmail(raw.recovery_email);
        break;
      case RpcActionType.UPDATE_QUICK_LOGIN:
        assertObjectWithKeys(debugPath, raw, ['quick_login'], []);
        break;
      default:
        throw new Error('invalid type ');
    }
  } else {
    assertObjectWithKeys(
      debugPath,
      raw,
      ['register_email', 'pubkey', 'quick_login', 'recovery_email'],
      []
    );
    ValidatePubkey(raw.pubkey);
    ValidateRecoveryEmail(raw.recovery_email);
  }
}

export function ValidateInner(raw: any, { debugPath = 'inner' } = {}) {
  assertObjectWithKeys(
    debugPath,
    raw,
    ['type', 'nonce', 'action', 'username'],
    []
  );
  ValidateAction(raw.action, { action: raw.type, debugPath: 'action' });
}

export function ValidatSignAddKey1(raw: any, { debugPath = 'sign' } = {}) {
  assertObjectWithKeys(debugPath, raw, ['signature', 'oldkey_signature'], []);
  ValidateAction(raw.action);
}
export function ValidatSignAddKey2(raw: any, { debugPath = 'sign' } = {}) {
  assertObjectWithKeys(
    debugPath,
    raw,
    ['signature', 'email_header', 'unipass_signature'],
    []
  );
  ValidateAction(raw.action);
}
export function ValidatSignRegister(raw: any, { debugPath = 'sign' } = {}) {
  assertObjectWithKeys(debugPath, raw, ['signature', 'email_header'], []);
  ValidateAction(raw.action);
}

export function ValidateTransaction(
  transaction: any,
  { debugPath = 'transaction' } = {}
) {
  assertObjectWithKeys(debugPath, transaction, ['inner', 'sig'], []);
  ValidateInner(transaction.inner);
}

export const validators = {
  ValidateTransaction,
  ValidateInner,
  ValidatSignAddKey1,
  ValidatSignAddKey2,
  ValidatSignRegister,
  ValidateAction,
  ValidateTarget,
};
