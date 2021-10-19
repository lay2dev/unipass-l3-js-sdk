import { RpcActionType } from '../interface';
import { validators } from './validators';

function invokeSerializeJson(debugPath: string, value: any) {
  if (value instanceof Object && value.serializeJson instanceof Function) {
    value = value.serializeJson.call(value);
    return value;
  }
  return value;
}

function transformObject(
  debugPath: string,
  object: any,
  keys: any,
  hintNull?: boolean
) {
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
    if (hintNull) {
      if (value) result[key] = (f as any)(`${debugPath}.${key}`, value);
    } else {
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
  if (!target) {
    return null;
  }
  const formatRecoveryEmail = transformRawObject(debugPath, target, {
    threshold: invokeSerializeJson,
    firstN: invokeSerializeJson,
    emails: invokeSerializeJson,
  });
  return formatRecoveryEmail;
}

export function TransformLocalKey(
  rawTransaction: any,
  { debugPath = 'LocalKey' } = {}
) {
  let formatLocalKey;
  if (rawTransaction.rsa_pubkey) {
    formatLocalKey = transformRawObject(debugPath, rawTransaction, {
      rsaPubkey: invokeSerializeJson,
    });
  }
  if (rawTransaction.secp256k1) {
    formatLocalKey = transformRawObject(debugPath, rawTransaction, {
      secp256k1: invokeSerializeJson,
    });
  }
  if (rawTransaction.secp256r1) {
    formatLocalKey = transformRawObject(debugPath, rawTransaction, {
      secp256r1: invokeSerializeJson,
    });
  }
  return formatLocalKey;
}

export function TransformPendingState(target: any, { debugPath = 'raw' } = {}) {
  const formatRecoveryEmail = transformRawObject(debugPath, target, {
    pendingKey: invokeSerializeJson,
    replaceOld: invokeSerializeJson,
    timeCell: invokeSerializeJson,
  });
  return formatRecoveryEmail;
}

function toTxRowArray(array: any[]) {
  const data = array.map((item, i) => {
    return TransformRowTransaction(item);
  });
  return data;
}

export function TransformRowTransaction(
  rawTransaction: any,
  { debugPath = 'raw' } = {}
) {
  let formateTransaction = null;
  if (rawTransaction.hash) {
    formateTransaction = transformRawObject(debugPath, rawTransaction, {
      txStatus: invokeSerializeJson,
    });
  } else {
    formateTransaction = transformRawObject(debugPath, rawTransaction, {
      transactionInner: toInvoke(TransformInnerRaw),
      txStatus: toInvoke(TransformTxStatus),
    });
  }

  return formateTransaction;
}

function toInvokeArray(invokeFunction) {
  return function (debugPath, array) {
    return array.map((item, i) => {
      return invokeFunction(`${debugPath}[${i}]`, item);
    });
  };
}

// raw transaction
export function TransformRawTransaction(
  rawTransaction: any,
  { debugPath = 'raw_transaction' } = {}
) {
  let formateTransaction = {};

  if (rawTransaction.tx_status) {
    formateTransaction = TransformRowTransaction(rawTransaction);
  } else if (rawTransaction.length == 0) {
    return [];
  } else if (rawTransaction[0].commit_status) {
    formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
      registerEmail: invokeSerializeJson,
      quickLogin: invokeSerializeJson,
      localKeys: toInvokeArray(toInvoke(TransformLocalKey)),
      nonce: invokeSerializeJson,
      username: invokeSerializeJson,
      recoveryEmail: toInvoke(TransformRecoveryEmail),
      // pendingState: toInvoke(TransformPendingState),
      commitStatus: invokeSerializeJson,
    });
    return [formateTransaction];
  } else if (rawTransaction[0].username) {
    formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
      registerEmail: invokeSerializeJson,
      quickLogin: invokeSerializeJson,
      nonce: invokeSerializeJson,
      username: invokeSerializeJson,
      localKeys: toInvokeArray(toInvoke(TransformLocalKey)),
      recoveryEmail: toInvoke(TransformRecoveryEmail),
    });
    return [formateTransaction];
  } else {
    formateTransaction = toTxRowArray(rawTransaction);
  }
  return formateTransaction;
}

export function TransformRsaPubkey(target: any, { debugPath = 'action' } = {}) {
  const rsaPubkey = transformObject(debugPath, target, {
    e: invokeSerializeJson,
    n: invokeSerializeJson,
  });
  return rsaPubkey;
}
export function transformPubkey(target: any, { debugPath = 'pubkey' } = {}) {
  const pubkey = transformObject(
    debugPath,
    target,
    {
      rsa_pubkey: toInvoke(TransformRsaPubkey),
      secp256k1: invokeSerializeJson,
      secp256r1: invokeSerializeJson,
    },
    true
  );
  return pubkey;
}

export function transformRecoveryEmailInner(
  target: any,
  { debugPath = 'recovery' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    threshold: invokeSerializeJson,
    first_n: invokeSerializeJson,
    emails: invokeSerializeJson,
  });

  return formatAction;
}

export function TransformActionRegister(
  target: any,
  { debugPath = 'RegisterAction' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    register_email: invokeSerializeJson,
    quick_login: invokeSerializeJson,
    pubkey: toInvoke(transformPubkey),
    recovery_email: toInvoke(transformRecoveryEmailInner),
    source: invokeSerializeJson,
  });
  return formatAction;
}

export function TransformActionAddKey(
  target: any,
  { debugPath = 'AddKeyAction' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    pubkey: toInvoke(transformPubkey),
  });
  return formatAction;
}

export function TransformActionDeleteKey(
  target: any,
  { debugPath = 'deleteKeyAction' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    pubkey: toInvoke(transformPubkey),
  });
  return formatAction;
}

export function TransformActionUpdateRecoveryEmail(
  target: any,
  { debugPath = 'action_update_recovery_email' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    recovery_email: toInvoke(transformRecoveryEmailInner),
  });
  return formatAction;
}

export function TransformActionUpdateQuickLogin(
  target: any,
  { debugPath = 'action_update_quick_login' } = {}
) {
  const formatAction = transformObject(debugPath, target, {
    quick_login: invokeSerializeJson,
  });
  return formatAction;
}

export function TransformInnerTypeData(type: string) {
  // todo type checkout
  let data: any;
  switch (type) {
    case RpcActionType.REGISTER:
      data = {
        type: invokeSerializeJson,
        nonce: invokeSerializeJson,
        username: invokeSerializeJson,
        action: toInvoke(TransformActionRegister),
      };
      break;
    case RpcActionType.ADD_KEY:
      data = {
        type: invokeSerializeJson,
        nonce: invokeSerializeJson,
        username: invokeSerializeJson,
        action: toInvoke(TransformActionAddKey),
      };
      break;
    case RpcActionType.DEL_KEY:
      data = {
        type: invokeSerializeJson,
        nonce: invokeSerializeJson,
        username: invokeSerializeJson,
        action: toInvoke(TransformActionDeleteKey),
      };
      break;
    case RpcActionType.UPDATE_RECOVERY_EMAIL:
      data = {
        type: invokeSerializeJson,
        nonce: invokeSerializeJson,
        username: invokeSerializeJson,
        action: toInvoke(TransformActionUpdateRecoveryEmail),
      };
      break;
    case RpcActionType.UPDATE_QUICK_LOGIN:
      data = {
        type: invokeSerializeJson,
        nonce: invokeSerializeJson,
        username: invokeSerializeJson,
        action: toInvoke(TransformActionUpdateQuickLogin),
      };
      break;
    default:
      throw new Error('invalid type ');
  }
  return data;
}

export function TransformInner(
  target: any,
  { validation = true, debugPath = 'inner' } = {}
) {
  // todo type checkout

  const data = TransformInnerTypeData(target.type);
  const formatInner = transformObject(debugPath, target, data);
  if (validation) {
    validators.ValidateInner(formatInner, {
      debugPath: `(transformed) ${debugPath}`,
    });
  }
  return formatInner;
}

export function TransformSign(
  target: any,
  { validation = true, debugPath = 'sign' } = {}
) {
  // todo  way
  let formatSign;
  if (target.emailHeader) {
    if (target.unipassSignature) {
      // add key 2
      formatSign = transformObject(debugPath, target, {
        signature: invokeSerializeJson,
        email_header: invokeSerializeJson,
        unipass_signature: invokeSerializeJson,
      });
    } else {
      // register
      formatSign = transformObject(debugPath, target, {
        signature: invokeSerializeJson,
        email_header: invokeSerializeJson,
      });
    }
  } else {
    // add key 1
    formatSign = transformObject(debugPath, target, {
      signature: invokeSerializeJson,
      oldkey_signature: invokeSerializeJson,
    });
  }

  if (validation) {
    if (target.emailHeader) {
      if (target.unipassSignature) {
        // add key 2
        validators.ValidatSignAddKey2(formatSign, {
          debugPath: `(transformed) ${debugPath}`,
        });
      } else {
        // register
        validators.ValidatSignRegister(formatSign, {
          debugPath: `(transformed) ${debugPath}`,
        });
      }
    } else {
      // add key 1
      validators.ValidatSignAddKey1(formatSign, {
        debugPath: `(transformed) ${debugPath}`,
      });
    }
  }

  return formatSign;
}
export function TransformTransaction(
  transaction: any,
  { validation = true, debugPath = 'transaction' } = {}
) {
  const formateTransaction = transformObject(debugPath, transaction, {
    inner: toInvoke(TransformInner),
    sig: toInvoke(TransformSign),
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
