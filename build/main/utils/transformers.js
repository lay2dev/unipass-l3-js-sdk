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
    let formateTransaction = null;
    if (rawTransaction.hash) {
        formateTransaction = transformRawObject(debugPath, rawTransaction, {
            txStatus: invokeSerializeJson,
        });
    }
    else {
        formateTransaction = transformRawObject(debugPath, rawTransaction, {
            transactionInner: toInvoke(TransformInnerRaw),
            txStatus: toInvoke(TransformTxStatus),
        });
    }
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