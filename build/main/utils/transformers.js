"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = exports.TransformTransaction = exports.TransformSign = exports.TransformInner = exports.TransformAction = exports.transformRecoveryEmailInner = exports.transformPubkey = exports.TransformRsaPubkey = exports.TransformRawTransaction = exports.TransformRowTransaction = exports.TransformPendingState = exports.TransformRecoveryEmail = exports.TransformTxStatus = exports.TransformInnerRaw = exports.TransformRowAction = void 0;
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
// raw transaction
function TransformRawTransaction(rawTransaction, { debugPath = 'raw_transaction' } = {}) {
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
            localKeys: invokeSerializeJson,
            recoveryEmail: toInvoke(TransformRecoveryEmail),
            pendingState: toInvoke(TransformPendingState),
        });
        return [formateTransaction];
    }
    else if (rawTransaction[0].username) {
        formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            localKeys: invokeSerializeJson,
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
function TransformAction(target, { validation = true, debugPath = 'action' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        register_email: invokeSerializeJson,
        quick_login: invokeSerializeJson,
        pubkey: toInvoke(transformPubkey),
        recovery_email: toInvoke(transformRecoveryEmailInner),
    });
    if (validation) {
        validators_1.validators.ValidateAction(formatAction, {
            debugPath: `(transformed) ${debugPath}`,
        });
    }
    return formatAction;
}
exports.TransformAction = TransformAction;
function TransformInner(target, { validation = true, debugPath = 'inner' } = {}) {
    const formatInner = transformObject(debugPath, target, {
        type: invokeSerializeJson,
        nonce: invokeSerializeJson,
        username: invokeSerializeJson,
        action: toInvoke(TransformAction),
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEM7QUFFMUMsU0FBUyxtQkFBbUIsQ0FBQyxTQUFpQixFQUFFLEtBQVU7SUFDeEQsSUFBSSxLQUFLLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLFlBQVksUUFBUSxFQUFFO1FBQ3RFLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxlQUFlLENBQ3RCLFNBQWlCLEVBQ2pCLE1BQVcsRUFDWCxJQUFTLEVBQ1QsUUFBa0I7SUFFbEIsTUFBTSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLFNBQVMscUJBQXFCLENBQUMsQ0FBQztLQUNoRTtJQUNELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVsQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDbEQsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQ3JDLENBQUM7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