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
    result[key] = (f as any)(`${debugPath}.${key}`, value);
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
    result[key] = (f as any)(`${debugPath}.${key}`, value);
  }
  return result;
}

function toInvoke(transform) {
  return function (debugPath, value) {
    return transform(value, {
      validation: false,
      debugPath,
    });
  };
}
export function TransformRowAction(
  target: any,
  { debugPath = 'row_action' } = {}
) {
  const formatAction = transformRawObject(debugPath, target, {
    registerEmail: invokeSerializeJson,
    pubkey: invokeSerializeJson,
    recoveryEmail: invokeSerializeJson,
    quickLogin: invokeSerializeJson,
  });
  return formatAction;
}

export function TransformInnerRaw(target: any, { debugPath = 'raw' } = {}) {
  const formatRowInner = transformRawObject(debugPath, target, {
    nonce: invokeSerializeJson,
    type: invokeSerializeJson,
    action: toInvoke(TransformRowAction),
  });
  return formatRowInner;
}

export function TransformTxStatus(target: any, { debugPath = 'raw' } = {}) {
  const formatRow = transformRawObject(debugPath, target, {
    ckbTxHash: invokeSerializeJson,
    status: invokeSerializeJson,
  });
  return formatRow;
}

export function TransformRecoveryEmail(
  target: any,
  { debugPath = 'raw' } = {}
) {
  const formatRecoveryEmail = transformRawObject(debugPath, target, {
    threshold: invokeSerializeJson,
    firstN: invokeSerializeJson,
    emails: invokeSerializeJson,
  });
  return formatRecoveryEmail;
}

export function TransformPendingState(target: any, { debugPath = 'raw' } = {}) {
  const formatRecoveryEmail = transformRawObject(debugPath, target, {
    pendingKey: invokeSerializeJson,
    replaceOld: invokeSerializeJson,
    timeCell: invokeSerializeJson,
  });
  return formatRecoveryEmail;
}

// raw transaction
export function TransformRawTransaction(
  rawTransaction: any,
  { debugPath = 'raw_transaction' } = {}
) {
  let formateTransaction = {};
  if (rawTransaction.tx_status) {
    formateTransaction = transformRawObject(debugPath, rawTransaction, {
      transactionInner: toInvoke(TransformInnerRaw),
      txStatus: toInvoke(TransformTxStatus),
    });
  } else {
    formateTransaction = transformRawObject(debugPath, rawTransaction, {
      registerEmail: invokeSerializeJson,
      quickLogin: invokeSerializeJson,
      localKeys: invokeSerializeJson,
      recoveryEmail: toInvoke(TransformTxStatus),
      pendingState: toInvoke(TransformPendingState),
    });
  }
  return formateTransaction;
}

export function TransformAction(
  target: any,
  { validation = true, debugPath = 'action' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    register_email: invokeSerializeJson,
    pubkey: invokeSerializeJson,
    recovery_email: invokeSerializeJson,
    quick_login: invokeSerializeJson,
  });
  if (validation) {
    validators.ValidateAction(formatAction, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }
  return formatAction;
}
export function TransformInner(
  target: any,
  { validation = true, debugPath = 'inner' } = {}
) {
  const formatInner = transformObject(debugPath, target, {
    type: invokeSerializeJson,
    nonce: invokeSerializeJson,
    action: toInvoke(TransformAction),
  });
  if (validation) {
    validators.ValidateInner(formatInner, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }
  return formatInner;
}
export function TransformTransaction(
  transaction: any,
  { validation = true, debugPath = 'transaction' } = {}
) {
  const formateTransaction = transformObject(debugPath, transaction, {
    inner: toInvoke(TransformInner),
    sig: invokeSerializeJson,
  });

  if (validation) {
    validators.ValidateTransaction(formateTransaction, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }

  return formateTransaction;
}

export const transaction = {
  TransformTransaction,
  TransformRawTransaction,
  TransformInner,
};
