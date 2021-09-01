"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = exports.TransformTransaction = exports.TransformInner = exports.TransformAction = exports.TransformRawTransaction = exports.TransformPendingState = exports.TransformRecoveryEmail = exports.TransformTxStatus = exports.TransformInnerRaw = exports.TransformRowAction = void 0;
const validators_1 = require("./validators");
function invokeSerializeJson(debugPath, value) {
    if (value instanceof Object && value.serializeJson instanceof Function) {
        value = value.serializeJson.call(value);
        return value;
    }
    return value;
}
function transformObject(debugPath, object, keys) {
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
        result[key] = f(`${debugPath}.${key}`, value);
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
// raw transaction
function TransformRawTransaction(rawTransaction, { debugPath = 'raw_transaction' } = {}) {
    let formateTransaction = {};
    if (rawTransaction.tx_status) {
        formateTransaction = transformRawObject(debugPath, rawTransaction, {
            transactionInner: toInvoke(TransformInnerRaw),
            txStatus: toInvoke(TransformTxStatus),
        });
    }
    else {
        formateTransaction = transformRawObject(debugPath, rawTransaction, {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            localKeys: invokeSerializeJson,
            recoveryEmail: toInvoke(TransformRecoveryEmail),
            pendingState: toInvoke(TransformPendingState),
        });
    }
    return formateTransaction;
}
exports.TransformRawTransaction = TransformRawTransaction;
function TransformAction(target, { validation = true, debugPath = 'action' } = {}) {
    const formatAction = transformObject(debugPath, target, {
        register_email: invokeSerializeJson,
        pubkey: invokeSerializeJson,
        recovery_email: invokeSerializeJson,
        quick_login: invokeSerializeJson,
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
function TransformTransaction(transaction, { validation = true, debugPath = 'transaction' } = {}) {
    const formateTransaction = transformObject(debugPath, transaction, {
        inner: toInvoke(TransformInner),
        sig: invokeSerializeJson,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEM7QUFFMUMsU0FBUyxtQkFBbUIsQ0FBQyxTQUFpQixFQUFFLEtBQVU7SUFDeEQsSUFBSSxLQUFLLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLFlBQVksUUFBUSxFQUFFO1FBQ3RFLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsU0FBaUIsRUFBRSxNQUFXLEVBQUUsSUFBUztJQUNoRSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLENBQUMsRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsU0FBUyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ2hFO0lBQ0QsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWxCLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzNDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNsRCxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FDckMsQ0FBQztZQUNGLEtBQUssR0FB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