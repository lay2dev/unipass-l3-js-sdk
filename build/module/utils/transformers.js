import { validators } from './validators';
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
    console.log('[TransformRowTransaction]', rawTransaction);
    const formateTransaction = transformRawObject(debugPath, rawTransaction, {
        transactionInner: toInvoke(TransformInnerRaw),
        txStatus: toInvoke(TransformTxStatus),
    });
    console.log('formateTransaction', formateTransaction);
    return formateTransaction;
}
// raw transaction
export function TransformRawTransaction(rawTransaction, { debugPath = 'raw_transaction' } = {}) {
    let formateTransaction = {};
    if (rawTransaction.tx_status) {
        formateTransaction = TransformRowTransaction(rawTransaction);
    }
    else if (rawTransaction.register_email) {
        formateTransaction = transformRawObject(debugPath, rawTransaction, {
            registerEmail: invokeSerializeJson,
            quickLogin: invokeSerializeJson,
            localKeys: invokeSerializeJson,
            recoveryEmail: toInvoke(TransformRecoveryEmail),
            pendingState: toInvoke(TransformPendingState),
        });
    }
    else {
        formateTransaction = toTxRowArray(rawTransaction);
    }
    return formateTransaction;
}
export function TransformAction(target, { validation = true, debugPath = 'action' } = {}) {
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
export function TransformInner(target, { validation = true, debugPath = 'inner' } = {}) {
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
export function TransformTransaction(transaction, { validation = true, debugPath = 'transaction' } = {}) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLFNBQVMsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxLQUFVO0lBQ3hELElBQUksS0FBSyxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxZQUFZLFFBQVEsRUFBRTtRQUN0RSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLFNBQWlCLEVBQUUsTUFBVyxFQUFFLElBQVM7SUFDaEUsTUFBTSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLFNBQVMscUJBQXFCLENBQUMsQ0FBQztLQUNoRTtJQUNELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVsQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDbEQsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFD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