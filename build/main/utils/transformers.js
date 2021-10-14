"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = exports.TransformTransaction = exports.TransformSign = exports.TransformInner = exports.TransformInnerTypeData = exports.TransformActionUpdateQuickLogin = exports.TransformActionUpdateRecoveryEmail = exports.TransformActionDeleteKey = exports.TransformActionAddKey = exports.TransformActionRegister = exports.transformRecoveryEmailInner = exports.transformPubkey = exports.TransformRsaPubkey = exports.TransformRawTransaction = exports.TransformRowTransaction = exports.TransformPendingState = exports.TransformLocalKey = exports.TransformRecoveryEmail = exports.TransformTxStatus = exports.TransformInnerRaw = exports.TransformRowAction = void 0;
const interface_1 = require("../interface");
const validators_1 = require("./validators");
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
function TransformRowAction(target, { debugPath = 'row_action' } = {}) {
    const formatAction = transformRawObject(debugPath, target, {
        registerEmail: invokeSerializeJson,
        pubkey: invokeSerializeJson,
        recoveryEmail: invokeSerializeJson,
        quickLogin: invokeSerializeJson,
    });
    return formatAction;
}
exports.TransformRowAction = TransformRowAction;
function TransformInnerRaw(target, { debugPath = 'raw' } = {}) {
    const formatRowInner = transformRawObject(debugPath, target, {
        nonce: invokeSerializeJson,
        type: invokeSerializeJson,
        action: toInvoke(TransformRowAction),
    });
    return formatRowInner;
}
exports.TransformInnerRaw = TransformInnerRaw;
function TransformTxStatus(target, { debugPath = 'raw' } = {}) {
    const formatRow = transformRawObject(debugPath, target, {
        ckbTxHash: invokeSerializeJson,
        status: invokeSerializeJson,
    });
    return formatRow;
}
exports.TransformTxStatus = TransformTxStatus;
function TransformRecoveryEmail(target, { debugPath = 'raw' } = {}) {
    const formatRecoveryEmail = transformRawObject(debugPath, target, {
        threshold: invokeSerializeJson,
        firstN: invokeSerializeJson,
        emails: invokeSerializeJson,
    });
    return formatRecoveryEmail;
}
exports.TransformRecoveryEmail = TransformRecoveryEmail;
function TransformLocalKey(rawTransaction, { debugPath = 'LocalKey' } = {}) {
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
exports.TransformLocalKey = TransformLocalKey;
function TransformPendingState(target, { debugPath = 'raw' } = {}) {
    const formatRecoveryEmail = transformRawObject(debugPath, target, {
        pendingKey: invokeSerializeJson,
        replaceOld: invokeSerializeJson,
        timeCell: invokeSerializeJson,
    });
    return formatRecoveryEmail;
}
exports.TransformPendingState = TransformPendingState;
function toTxRowArray(array) {
    const data = array.map((item, i) => {
        return TransformRowTransaction(item);
    });
    return data;
}
function TransformRowTransaction(rawTransaction, { debugPath = 'raw' } = {}) {
    const formateTransaction = transformRawObject(debugPath, rawTransaction, {
        transactionInner: toInvoke(TransformInnerRaw),
        txStatus: toInvoke(TransformTxStatus),
    });
    return formateTransaction;
}
exports.TransformRowTransaction = TransformRowTransaction;
function toInvokeArray(invokeFunction) {
    return function (debugPath, array) {
        return array.map((item, i) => {
            return invokeFunction(`${debugPath}[${i}]`, item);
        });
    };
}
// raw transaction
function TransformRawTransaction(rawTransaction, { debugPath = 'raw_transaction' } = {}) {
    let formateTransaction = {};
    if (rawTransaction.tx_status) {
        formateTransaction = TransformRowTransaction(rawTransaction);
    }
    else if (rawTransaction.length == 0) {
        return [];
    }
    else if (rawTransaction[0].commit_status) {
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
exports.TransformRawTransaction = TransformRawTransaction;
function TransformRsaPubkey(target, { debugPath = 'action' } = {}) {
    const rsaPubkey = transformObject(debugPath, target, {
        e: invokeSerializeJson,
        n: invokeSerializeJson,
    });
    return rsaPubkey;
}
exports.TransformRsaPubkey = TransformRsaPubkey;
function transformPubkey(target, { debugPath = 'pubkey' } = {}) {
    const pubkey = transformObject(debugPath, target, {
        rsa_pubkey: toInvoke(TransformRsaPubkey),
        secp256k1: invokeSerializeJson,
        secp256r1: invokeSerializeJson,
    }, true);
    return pubkey;
}
exports.transformPubkey = transformPubkey;
function transformRecoveryEmailInner(target, { debugPath = 'recovery' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        threshold: invokeSerializeJson,
        first_n: invokeSerializeJson,
        emails: invokeSerializeJson,
    });
    return formatAction;
}
exports.transformRecoveryEmailInner = transformRecoveryEmailInner;
function TransformActionRegister(target, { debugPath = 'RegisterAction' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        register_email: invokeSerializeJson,
        quick_login: invokeSerializeJson,
        pubkey: toInvoke(transformPubkey),
        recovery_email: toInvoke(transformRecoveryEmailInner),
        source: invokeSerializeJson,
    });
    return formatAction;
}
exports.TransformActionRegister = TransformActionRegister;
function TransformActionAddKey(target, { debugPath = 'AddKeyAction' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        pubkey: toInvoke(transformPubkey),
    });
    return formatAction;
}
exports.TransformActionAddKey = TransformActionAddKey;
function TransformActionDeleteKey(target, { debugPath = 'deleteKeyAction' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        pubkey: toInvoke(transformPubkey),
    });
    return formatAction;
}
exports.TransformActionDeleteKey = TransformActionDeleteKey;
function TransformActionUpdateRecoveryEmail(target, { debugPath = 'action_update_recovery_email' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        recovery_email: toInvoke(transformRecoveryEmailInner),
    });
    return formatAction;
}
exports.TransformActionUpdateRecoveryEmail = TransformActionUpdateRecoveryEmail;
function TransformActionUpdateQuickLogin(target, { debugPath = 'action_update_quick_login' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        quick_login: invokeSerializeJson,
    });
    return formatAction;
}
exports.TransformActionUpdateQuickLogin = TransformActionUpdateQuickLogin;
function TransformInnerTypeData(type) {
    // todo type checkout
    let data;
    switch (type) {
        case interface_1.RpcActionType.REGISTER:
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionRegister),
            };
            break;
        case interface_1.RpcActionType.ADD_KEY:
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionAddKey),
            };
            break;
        case interface_1.RpcActionType.DEL_KEY:
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionDeleteKey),
            };
            break;
        case interface_1.RpcActionType.UPDATE_RECOVERY_EMAIL:
            data = {
                type: invokeSerializeJson,
                nonce: invokeSerializeJson,
                username: invokeSerializeJson,
                action: toInvoke(TransformActionUpdateRecoveryEmail),
            };
            break;
        case interface_1.RpcActionType.UPDATE_QUICK_LOGIN:
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
exports.TransformInnerTypeData = TransformInnerTypeData;
function TransformInner(target, { validation = true, debugPath = 'inner' } = {}) {
    // todo type checkout
    const data = TransformInnerTypeData(target.type);
    const formatInner = transformObject(debugPath, target, data);
    if (validation) {
        validators_1.validators.ValidateInner(formatInner, {
            debugPath: `(transformed) ${debugPath}`,
        });
    }
    return formatInner;
}
exports.TransformInner = TransformInner;
function TransformSign(target, { validation = true, debugPath = 'sign' } = {}) {
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
                validators_1.validators.ValidatSignAddKey2(formatSign, {
                    debugPath: `(transformed) ${debugPath}`,
                });
            }
            else {
                // register
                validators_1.validators.ValidatSignRegister(formatSign, {
                    debugPath: `(transformed) ${debugPath}`,
                });
            }
        }
        else {
            // add key 1
            validators_1.validators.ValidatSignAddKey1(formatSign, {
                debugPath: `(transformed) ${debugPath}`,
            });
        }
    }
    return formatSign;
}
exports.TransformSign = TransformSign;
function TransformTransaction(transaction, { validation = true, debugPath = 'transaction' } = {}) {
    const formateTransaction = transformObject(debugPath, transaction, {
        inner: toInvoke(TransformInner),
        sig: toInvoke(TransformSign),
    });
    if (validation) {
        validators_1.validators.ValidateTransaction(formateTransaction, {
            debugPath: `(transformed) ${debugPath}`,
        });
    }
    return formateTransaction;
}
exports.TransformTransaction = TransformTransaction;
exports.transaction = {
    TransformTransaction,
    TransformRawTransaction,
    TransformInner,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBNkM7QUFDN0MsNkNBQTBDO0FBRTFDLFNBQVMsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxLQUFVO0lBQ3hELElBQUksS0FBSyxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxZQUFZLFFBQVEsRUFBRTtRQUN0RSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUN0QixTQUFpQixFQUNqQixNQUFXLEVBQ1gsSUFBUyxFQUNULFFBQWtCO0lBRWxCLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sQ0FBQyxFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxTQUFTLHFCQUFxQixDQUFDLENBQUM7S0FDaEU7SUFDRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFbEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDM0MsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQ2xELEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FB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