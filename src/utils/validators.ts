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

export function ValidateAction(raw: any, { debugPath = 'action' } = {}) {
  assertObjectWithKeys(
    debugPath,
    raw,
    ['register_email', 'pubkey', 'recovery_email', 'quick_login'],
    []
  );
}

export function ValidateInner(raw: any, { debugPath = 'inner' } = {}) {
  assertObjectWithKeys(debugPath, raw, ['type', 'nonce', 'action'], []);
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
  ValidateAction,
  ValidateTarget,
};
