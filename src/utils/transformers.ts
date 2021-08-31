import { validators } from './validators';

function invokeSerializeJson(debugPath: string, value: any) {
  if (value instanceof Object && value.serializeJson instanceof Function) {
    value = value.serializeJson.call(value);
    return value;
  }
  return value;
}

function transformObject(debugPath: string, object: any, keys: any) {
  object = invokeSerializeJson(debugPath, object);
  if (!(object instanceof Object)) {
    throw new Error(`Transformed ${debugPath} is not an object1!`);
  }
  const result = {};

  for (const [key, f] of Object.entries(keys)) {
    let value = object[key];
    if (!value) {
      const camelKey = key.replace(/(_[a-z])/g, (group) =>
        group.toUpperCase().replace('_', '')
      );
      value = object[camelKey];
    }
    if (value) {
      result[key] = (f as any)(`${debugPath}.${key}`, value);
    }
  }
  return result;
}

function transformRawObject(debugPath: string, object: any, keys: any) {
  object = invokeSerializeJson(debugPath, object);
  if (!(object instanceof Object)) {
    throw new Error(`Transformed ${debugPath} is not an object1!`);
  }
  const result = {};

  for (const [key, f] of Object.entries(keys)) {
    let value = object[key];
    if (!value) {
      const camelKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      value = object[camelKey];
    }
    if (value) {
      result[key] = (f as any)(`${debugPath}.${key}`, value);
    }
  }
  return result;
}

function toInvokeArray(invokeFunction) {
  return function (debugPath, array) {
    return array.map((item, i) => {
      return invokeFunction(`${debugPath}[${i}]`, item);
    });
  };
}

function toInvoke(transform) {
  return function (debugPath, value) {
    return transform(value, {
      validation: false,
      debugPath,
    });
  };
}
export function TransformTarget(
  target: any,
  { validation = true, debugPath = 'target' } = {}
) {
  const formatTarget = transformObject(debugPath, target, {
    to: invokeSerializeJson,
    amount: invokeSerializeJson,
  });

  if (validation) {
    validators.ValidateTarget(formatTarget, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }

  return formatTarget;
}

export function Transform(
  target: any,
  { validation = true, debugPath = 'raw' } = {}
) {
  const formatRow = transformObject(debugPath, target, {
    type_id: invokeSerializeJson,
    from: invokeSerializeJson,
    nonce: invokeSerializeJson,
    total_amount: invokeSerializeJson,
    fee: invokeSerializeJson,
    targets: toInvokeArray(toInvoke(TransformTarget)),
  });
  if (validation) {
    validators.ValidateRaw(formatRow, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }
  return formatRow;
}

export function TransformRaw(target: any, { debugPath = 'raw' } = {}) {
  const formatRow = transformRawObject(debugPath, target, {
    typeId: invokeSerializeJson,
    from: invokeSerializeJson,
    nonce: invokeSerializeJson,
    totalAmount: invokeSerializeJson,
    fee: invokeSerializeJson,
    targets: toInvokeArray(toInvoke(TransformTarget)),
  });
  return formatRow;
}

export function TransformTxStatus(target: any, { debugPath = 'raw' } = {}) {
  const formatRow = transformRawObject(debugPath, target, {
    ckbTxHash: invokeSerializeJson,
    status: invokeSerializeJson,
  });
  return formatRow;
}

export function TransformTransaction(
  transaction: any,
  { validation = true, debugPath = 'transaction' } = {}
) {
  const formateTransaction = transformObject(debugPath, transaction, {
    raw: toInvoke(Transform),
    sig: invokeSerializeJson,
  });

  if (validation) {
    validators.ValidateTransaction(formateTransaction, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }

  return formateTransaction;
}

export function TransformRawTransaction(
  rawTransaction: any,
  { debugPath = 'raw_transaction' } = {}
) {
  const formateTransaction = transformRawObject(debugPath, rawTransaction, {
    transaction: toInvoke(TransformRaw),
    txStatus: toInvoke(TransformTxStatus),
    symbol: invokeSerializeJson,
    name: invokeSerializeJson,
    decimal: invokeSerializeJson,
    issuer: invokeSerializeJson,
    totalSupply: invokeSerializeJson,
  });
  return formateTransaction;
}

export const transaction = {
  TransformTransaction,
  TransformRawTransaction,
  Transform,
};
