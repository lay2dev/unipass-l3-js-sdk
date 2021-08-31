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
function assertInteger(debugPath: string, i: string) {
  if (!/^0x[1-9a-fA-F][0-9a-fA-F]*$/.test(i)) {
    throw new Error(`${debugPath} must be a hex integer!`);
  }
}
function assertArray(
  debugPath: string,
  array: any[],
  validateFunction,
  nestedValidation: boolean
) {
  if (!Array.isArray(array)) {
    throw new Error(`${debugPath} is not an array!`);
  }
  if (nestedValidation) {
    for (let i = 0; i < array.length; i++) {
      validateFunction(`${debugPath}[${i}]`, array[i]);
    }
  }
}

function toAssert(validateFunction, nestedValidation: boolean) {
  return function (debugPath: string, value: any) {
    validateFunction(value, {
      nestedValidation: nestedValidation,
      debugPath: debugPath,
    });
  };
}

export function ValidateTarget(
  target: any,
  { nestedValidation = true, debugPath = 'target' } = {}
) {
  assertObjectWithKeys(debugPath, target, ['to', 'amount'], []);
}

function assertCommonTransaction(
  debugPath: string,
  rawTransaction: any,
  nestedValidation: boolean
) {
  assertArray(
    `${debugPath}.targets`,
    rawTransaction.targets,
    toAssert(ValidateTarget, nestedValidation),
    nestedValidation
  );
  assertInteger(`${debugPath}.fee`, rawTransaction.fee);
  assertInteger(`${debugPath}.total_amount`, rawTransaction.total_amount);
}

export function ValidateRaw(
  raw: any,
  { nestedValidation = true, debugPath = 'raw' } = {}
) {
  assertObjectWithKeys(
    debugPath,
    raw,
    ['type_id', 'from', 'nonce', 'total_amount', 'fee', 'targets'],
    []
  );
  assertCommonTransaction(debugPath, raw, nestedValidation);
}

export function ValidateTransaction(
  transaction: any,
  { nestedValidation = true, debugPath = 'transaction' } = {}
) {
  assertObjectWithKeys(debugPath, transaction, ['raw', 'sig'], []);
  ValidateRaw(transaction.raw);
}

export const validators = {
  ValidateTransaction,
  ValidateRaw,
  ValidateTarget,
};
