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
    console.log('------------');
    console.log(rawTransaction);
    let formateTransaction = {};
    if (rawTransaction.tx_status) {
        formateTransaction = TransformRowTransaction(rawTransaction);
    }
    else if (rawTransaction[0].pending_state) {
        formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            localKeys: invokeSerializeJson,
            recoveryEmail: toInvoke(TransformRecoveryEmail),
            pendingState: toInvoke(TransformPendingState),
        });
    }
    else if (rawTransaction[0].username) {
        formateTransaction = transformRawObject(debugPath, rawTransaction[0], {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            localKeys: invokeSerializeJson,
            recoveryEmail: toInvoke(TransformRecoveryEmail),
        });
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