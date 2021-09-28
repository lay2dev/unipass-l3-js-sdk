import { validators } from './validators';
function invokeSerializeJson(debugPath, value) {
    if (value instanceof Object && value.serializeJson instanceof Function) {
        value = value.serializeJson.call(value);
        return value;
    }
    return value;
}
function transformObject(debugPath, object, keys, hintNull) {
    object = invokeSerializeJson(debugPath, object);
    if (!(object instanceof Object)) {
        throw new Error(`Transformed ${debugPath} is not an object1!`);
    }
    const result = {};
    for (const [key, f] of Object.entries(keys)) {
        let value = object[key];
        if (!value) {
            const camelKey = key.replace(/(_[a-z])/g, (group) => group.toUpperCase().replace('_', ''));
            value = object[camelKey];
        }
        if (hintNull) {
            if (value)
                result[key] = f(`${debugPath}.${key}`, value);
        }
        else {
            result[key] = f(`${debugPath}.${key}`, value);
        }
    }
    return result;
}
function transformRawObject(debugPath, object, keys) {
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
        result[key] = f(`${debugPath}.${key}`, value);
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
export function TransformRowAction(target, { debugPath = 'row_action' } = {}) {
    const formatAction = transformRawObject(debugPath, target, {
        registerEmail: invokeSerializeJson,
        pubkey: invokeSerializeJson,
        recoveryEmail: invokeSerializeJson,
        quickLogin: invokeSerializeJson,
    });
    return formatAction;
}
export function TransformInnerRaw(target, { debugPath = 'raw' } = {}) {
    const formatRowInner = transformRawObject(debugPath, target, {
        nonce: invokeSerializeJson,
        type: invokeSerializeJson,
        action: toInvoke(TransformRowAction),
    });
    return formatRowInner;
}
export function TransformTxStatus(target, { debugPath = 'raw' } = {}) {
    const formatRow = transformRawObject(debugPath, target, {
        ckbTxHash: invokeSerializeJson,
        status: invokeSerializeJson,
    });
    return formatRow;
}
export function TransformRecoveryEmail(target, { debugPath = 'raw' } = {}) {
    const formatRecoveryEmail = transformRawObject(debugPath, target, {
        threshold: invokeSerializeJson,
        firstN: invokeSerializeJson,
        emails: invokeSerializeJson,
    });
    return formatRecoveryEmail;
}
export function TransformLocalKey(rawTransaction, { debugPath = 'LocalKey' } = {}) {
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
export function TransformPendingState(target, { debugPath = 'raw' } = {}) {
    const formatRecoveryEmail = transformRawObject(debugPath, target, {
        pendingKey: invokeSerializeJson,
        replaceOld: invokeSerializeJson,
        timeCell: invokeSerializeJson,
    });
    return formatRecoveryEmail;
}
function toTxRowArray(array) {
    const data = array.map((item, i) => {
        return TransformRowTransaction(item);
    });
    return data;
}
export function TransformRowTransaction(rawTransaction, { debugPath = 'raw' } = {}) {
    const formateTransaction = transformRawObject(debugPath, rawTransaction, {
        transactionInner: toInvoke(TransformInnerRaw),
        txStatus: toInvoke(TransformTxStatus),
    });
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
export function TransformRawTransaction(rawTransaction, { debugPath = 'raw_transaction' } = {}) {
    let formateTransaction = {};
    if (rawTransaction.tx_status) {
        formateTransaction = TransformRowTransaction(rawTransaction);
    }
    else if (rawTransaction.length == 0) {
        return [];
    }
    else if (rawTransaction[0].pending_state) {
        formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            localKeys: toInvokeArray(toInvoke(TransformLocalKey)),
            nonce: invokeSerializeJson,
            username: invokeSerializeJson,
            recoveryEmail: toInvoke(TransformRecoveryEmail),
            pendingState: toInvoke(TransformPendingState),
        });
        return [formateTransaction];
    }
    else if (rawTransaction[0].username) {
        formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            nonce: invokeSerializeJson,
            username: invokeSerializeJson,
            localKeys: toInvokeArray(toInvoke(TransformLocalKey)),
            recoveryEmail: toInvoke(TransformRecoveryEmail),
        });
        return [formateTransaction];
    }
    else {
        formateTransaction = toTxRowArray(rawTransaction);
    }
    return formateTransaction;
}
export function TransformRsaPubkey(target, { debugPath = 'action' } = {}) {
    const rsaPubkey = transformObject(debugPath, target, {
        e: invokeSerializeJson,
        n: invokeSerializeJson,
    });
    return rsaPubkey;
}
export function transformPubkey(target, { debugPath = 'pubkey' } = {}) {
    const pubkey = transformObject(debugPath, target, {
        rsa_pubkey: toInvoke(TransformRsaPubkey),
        secp256k1: invokeSerializeJson,
        secp256r1: invokeSerializeJson,
    }, true);
    return pubkey;
}
export function transformRecoveryEmailInner(target, { debugPath = 'recovery' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        threshold: invokeSerializeJson,
        first_n: invokeSerializeJson,
        emails: invokeSerializeJson,
    });
    return formatAction;
}
export function TransformActionRegister(target, { debugPath = 'RegisterAction' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        register_email: invokeSerializeJson,
        quick_login: invokeSerializeJson,
        pubkey: toInvoke(transformPubkey),
        recovery_email: toInvoke(transformRecoveryEmailInner),
        source: invokeSerializeJson,
    });
    return formatAction;
}
export function TransformActionAddKey(target, { debugPath = 'AddKeyAction' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        pubkey: toInvoke(transformPubkey),
    });
    return formatAction;
}
export function TransformActionDeleteKey(target, { debugPath = 'deleteKeyAction' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        pubkey: toInvoke(transformPubkey),
    });
    return formatAction;
}
export function TransformActionUpdateRecoveryEmail(target, { debugPath = 'action_update_recovery_email' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        recovery_email: toInvoke(transformRecoveryEmailInner),
    });
    return formatAction;
}
export function TransformActionUpdateQuickLogin(target, { debugPath = 'action_update_quick_login' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        quick_login: invokeSerializeJson,
    });
    return formatAction;
}
export function TransformInnerTypeData(type) {
    // todo type checkout
    let data;
    switch (type) {
        case 'register':
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionRegister),
            };
            break;
        case 'add_key':
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionAddKey),
            };
            break;
        case 'delete_key':
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionDeleteKey),
            };
            break;
        case 'update_recovery_email':
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionUpdateRecoveryEmail),
            };
            break;
        case 'update_quick_login':
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
export function TransformInner(target, { validation = true, debugPath = 'inner' } = {}) {
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
export function TransformSign(target, { validation = true, debugPath = 'sign' } = {}) {
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
        }
        else {
            // register
            formatSign = transformObject(debugPath, target, {
                signature: invokeSerializeJson,
                email_header: invokeSerializeJson,
            });
        }
    }
    else {
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
            }
            else {
                // register
                validators.ValidatSignRegister(formatSign, {
                    debugPath: `(transformed) ${debugPath}`,
                });
            }
        }
        else {
            // add key 1
            validators.ValidatSignAddKey1(formatSign, {
                debugPath: `(transformed) ${debugPath}`,
            });
        }
    }
    return formatSign;
}
export function TransformTransaction(transaction, { validation = true, debugPath = 'transaction' } = {}) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLFNBQVMsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxLQUFVO0lBQ3hELElBQUksS0FBSyxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxZQUFZLFFBQVEsRUFBRTtRQUN0RSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUN0QixTQUFpQixFQUNqQixNQUFXLEVBQ1gsSUFBUyxFQUNULFFBQWtCO0lBRWxCLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sQ0FBQyxFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxTQUFTLHFCQUFxQixDQUFDLENBQUM7S0FDaEU7SUFDRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFbEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDM0MsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQ2xELEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxF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