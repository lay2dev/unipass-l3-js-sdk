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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBNkM7QUFDN0MsNkNBQTBDO0FBRTFDLFNBQVMsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxLQUFVO0lBQ3hELElBQUksS0FBSyxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxZQUFZLFFBQVEsRUFBRTtRQUN0RSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUN0QixTQUFpQixFQUNqQixNQUFXLEVBQ1gsSUFBUyxFQUNULFFBQWtCO0lBRWxCLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sQ0FBQyxFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxTQUFTLHFCQUFxQixDQUFDLENBQUM7S0FDaEU7SUFDRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFbEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDM0MsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQ2xELEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUNyQyxDQUFDO1lBQ0YsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxLQUFLO2dCQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBSSxDQUFTLENBQUMsR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkU7YUFBTTtZQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBSSxDQUFTLENBQUMsR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEQ7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLFNBQWlCLEVBQUUsTUFBVyxFQUFFLElBQVM7SUFDbkUsTUFBTSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLFNBQVMscUJBQXFCLENBQUMsQ0FBQztLQUNoRTtJQUNELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVsQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzlELEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDMUI7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUksQ0FBUyxDQUFDLEdBQUcsU0FBUyxJQUFJLEdBQUcsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3hEO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLFNBQVM7SUFDekIsT0FBTyxVQUFVLFNBQVMsRUFBRSxLQUFLO1FBQy9CLE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBRTtZQUN0QixVQUFVLEVBQUUsS0FBSztZQUNqQixTQUFTO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUNELFNBQWdCLGtCQUFrQixDQUNoQyxNQUFXLEVBQ1gsRUFBRSxTQUFTLEdBQUcsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUVqQyxNQUFNLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO1FBQ3pELGFBQWEsRUFBRSxtQkFBbUI7UUFDbEMsTUFBTSxFQUFFLG1CQUFtQjtRQUMzQixhQUFhLEVBQUUsbUJBQW1CO1FBQ2xDLFVBQVUsRUFBRSxtQkFBbUI7S0FDaEMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQVhELGdEQVdDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsTUFBVyxFQUFFLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDdkUsTUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRTtRQUMzRCxLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLElBQUksRUFBRSxtQkFBbUI7UUFDekIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztLQUNyQyxDQUFDLENBQUM7SUFDSCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FBUEQsOENBT0M7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFXLEVBQUUsRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRTtJQUN2RSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO1FBQ3RELFNBQVMsRUFBRSxtQkFBbUI7UUFDOUIsTUFBTSxFQUFFLG1CQUFtQjtLQUM1QixDQUFDLENBQUM7SUFDSCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBTkQsOENBTUM7QUFFRCxTQUFnQixzQkFBc0IsQ0FDcEMsTUFBVyxFQUNYLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFFMUIsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxNQUFNLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDaEUsU0FBUyxFQUFFLG1CQUFtQjtRQUM5QixNQUFNLEVBQUUsbUJBQW1CO1FBQzNCLE1BQU0sRUFBRSxtQkFBbUI7S0FDNUIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxtQkFBbUIsQ0FBQztBQUM3QixDQUFDO0FBYkQsd0RBYUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FDL0IsY0FBbUIsRUFDbkIsRUFBRSxTQUFTLEdBQUcsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUUvQixJQUFJLGNBQWMsQ0FBQztJQUNuQixJQUFJLGNBQWMsQ0FBQyxVQUFVLEVBQUU7UUFDN0IsY0FBYyxHQUFHLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7WUFDN0QsU0FBUyxFQUFFLG1CQUFtQjtTQUMvQixDQUFDLENBQUM7S0FDSjtJQUNELElBQUksY0FBYyxDQUFDLFNBQVMsRUFBRTtRQUM1QixjQUFjLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRTtZQUM3RCxTQUFTLEVBQUUsbUJBQW1CO1NBQy9CLENBQUMsQ0FBQztLQUNKO0lBQ0QsSUFBSSxjQUFjLENBQUMsU0FBUyxFQUFFO1FBQzVCLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFO1lBQzdELFNBQVMsRUFBRSxtQkFBbUI7U0FDL0IsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FBckJELDhDQXFCQztBQUVELFNBQWdCLHFCQUFxQixDQUFDLE1BQVcsRUFBRSxFQUFFLFNBQVMsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQzNFLE1BQU0sbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRTtRQUNoRSxVQUFVLEVBQUUsbUJBQW1CO1FBQy9CLFVBQVUsRUFBRSxtQkFBbUI7UUFDL0IsUUFBUSxFQUFFLG1CQUFtQjtLQUM5QixDQUFDLENBQUM7SUFDSCxPQUFPLG1CQUFtQixDQUFDO0FBQzdCLENBQUM7QUFQRCxzREFPQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQVk7SUFDaEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxPQUFPLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBZ0IsdUJBQXVCLENBQ3JDLGNBQW1CLEVBQ25CLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFFMUIsTUFBTSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFO1FBQ3ZFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUM3QyxRQUFRLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixDQUFDO0tBQ3RDLENBQUMsQ0FBQztJQUNILE9BQU8sa0JBQWtCLENBQUM7QUFDNUIsQ0FBQztBQVRELDBEQVNDO0FBRUQsU0FBUyxhQUFhLENBQUMsY0FBYztJQUNuQyxPQUFPLFVBQVUsU0FBUyxFQUFFLEtBQUs7UUFDL0IsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNCLE9BQU8sY0FBYyxDQUFDLEdBQUcsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELGtCQUFrQjtBQUNsQixTQUFnQix1QkFBdUIsQ0FDckMsY0FBbUIsRUFDbkIsRUFBRSxTQUFTLEdBQUcsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBRXRDLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0lBRTVCLElBQUksY0FBYyxDQUFDLFNBQVMsRUFBRTtRQUM1QixrQkFBa0IsR0FBRyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUM5RDtTQUFNLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDckMsT0FBTyxFQUFFLENBQUM7S0FDWDtTQUFNLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRTtRQUMxQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3BFLGFBQWEsRUFBRSxtQkFBbUI7WUFDbEMsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixTQUFTLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3JELEtBQUssRUFBRSxtQkFBbUI7WUFDMUIsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixhQUFhLEVBQUUsUUFBUSxDQUFDLHNCQUFzQixDQUFDO1lBQy9DLGlEQUFpRDtZQUNqRCxZQUFZLEVBQUUsbUJBQW1CO1NBQ2xDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQzdCO1NBQU0sSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO1FBQ3JDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEUsYUFBYSxFQUFFLG1CQUFtQjtZQUNsQyxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLEtBQUssRUFBRSxtQkFBbUI7WUFDMUIsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3JELGFBQWEsRUFBRSxRQUFRLENBQUMsc0JBQXNCLENBQUM7U0FDaEQsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDN0I7U0FBTTtRQUNMLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNuRDtJQUNELE9BQU8sa0JBQWtCLENBQUM7QUFDNUIsQ0FBQztBQXBDRCwwREFvQ0M7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxNQUFXLEVBQUUsRUFBRSxTQUFTLEdBQUcsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUMzRSxNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRTtRQUNuRCxDQUFDLEVBQUUsbUJBQW1CO1FBQ3RCLENBQUMsRUFBRSxtQkFBbUI7S0FDdkIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQU5ELGdEQU1DO0FBQ0QsU0FBZ0IsZUFBZSxDQUFDLE1BQVcsRUFBRSxFQUFFLFNBQVMsR0FBRyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3hFLE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FDNUIsU0FBUyxFQUNULE1BQU0sRUFDTjtRQUNFLFVBQVUsRUFBRSxRQUFRLENBQUMsa0JBQWtCLENBQUM7UUFDeEMsU0FBUyxFQUFFLG1CQUFtQjtRQUM5QixTQUFTLEVBQUUsbUJBQW1CO0tBQy9CLEVBQ0QsSUFBSSxDQUNMLENBQUM7SUFDRixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBWkQsMENBWUM7QUFFRCxTQUFnQiwyQkFBMkIsQ0FDekMsTUFBVyxFQUNYLEVBQUUsU0FBUyxHQUFHLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFFL0IsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDdEQsU0FBUyxFQUFFLG1CQUFtQjtRQUM5QixPQUFPLEVBQUUsbUJBQW1CO1FBQzVCLE1BQU0sRUFBRSxtQkFBbUI7S0FDNUIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQVhELGtFQVdDO0FBRUQsU0FBZ0IsdUJBQXVCLENBQ3JDLE1BQVcsRUFDWCxFQUFFLFNBQVMsR0FBRyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFFckMsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDdEQsY0FBYyxFQUFFLG1CQUFtQjtRQUNuQyxXQUFXLEVBQUUsbUJBQW1CO1FBQ2hDLE1BQU0sRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDO1FBQ2pDLGNBQWMsRUFBRSxRQUFRLENBQUMsMkJBQTJCLENBQUM7UUFDckQsTUFBTSxFQUFFLG1CQUFtQjtLQUM1QixDQUFDLENBQUM7SUFDSCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBWkQsMERBWUM7QUFFRCxTQUFnQixxQkFBcUIsQ0FDbkMsTUFBVyxFQUNYLEVBQUUsU0FBUyxHQUFHLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFFbkMsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDdEQsTUFBTSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUM7S0FDbEMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQVJELHNEQVFDO0FBRUQsU0FBZ0Isd0JBQXdCLENBQ3RDLE1BQVcsRUFDWCxFQUFFLFNBQVMsR0FBRyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFFdEMsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDdEQsTUFBTSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUM7S0FDbEMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQVJELDREQVFDO0FBRUQsU0FBZ0Isa0NBQWtDLENBQ2hELE1BQVcsRUFDWCxFQUFFLFNBQVMsR0FBRyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7SUFFbkQsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDdEQsY0FBYyxFQUFFLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQztLQUN0RCxDQUFDLENBQUM7SUFDSCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBUkQsZ0ZBUUM7QUFFRCxTQUFnQiwrQkFBK0IsQ0FDN0MsTUFBVyxFQUNYLEVBQUUsU0FBUyxHQUFHLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUVoRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRTtRQUN0RCxXQUFXLEVBQUUsbUJBQW1CO0tBQ2pDLENBQUMsQ0FBQztJQUNILE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFSRCwwRUFRQztBQUVELFNBQWdCLHNCQUFzQixDQUFDLElBQVk7SUFDakQscUJBQXFCO0lBQ3JCLElBQUksSUFBUyxDQUFDO0lBQ2QsUUFBUSxJQUFJLEVBQUU7UUFDWixLQUFLLHlCQUFhLENBQUMsUUFBUTtZQUN6QixJQUFJLEdBQUc7Z0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQzthQUMxQyxDQUFDO1lBQ0YsTUFBTTtRQUNSLEtBQUsseUJBQWEsQ0FBQyxPQUFPO1lBQ3hCLElBQUksR0FBRztnQkFDTCxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixNQUFNLEVBQUUsUUFBUSxDQUFDLHFCQUFxQixDQUFDO2FBQ3hDLENBQUM7WUFDRixNQUFNO1FBQ1IsS0FBSyx5QkFBYSxDQUFDLE9BQU87WUFDeEIsSUFBSSxHQUFHO2dCQUNMLElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLE1BQU0sRUFBRSxRQUFRLENBQUMsd0JBQXdCLENBQUM7YUFDM0MsQ0FBQztZQUNGLE1BQU07UUFDUixLQUFLLHlCQUFhLENBQUMscUJBQXFCO1lBQ3RDLElBQUksR0FBRztnQkFDTCxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixNQUFNLEVBQUUsUUFBUSxDQUFDLGtDQUFrQyxDQUFDO2FBQ3JELENBQUM7WUFDRixNQUFNO1FBQ1IsS0FBSyx5QkFBYSxDQUFDLGtCQUFrQjtZQUNuQyxJQUFJLEdBQUc7Z0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsTUFBTSxFQUFFLFFBQVEsQ0FBQywrQkFBK0IsQ0FBQzthQUNsRCxDQUFDO1lBQ0YsTUFBTTtRQUNSO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNwQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWhERCx3REFnREM7QUFFRCxTQUFnQixjQUFjLENBQzVCLE1BQVcsRUFDWCxFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsU0FBUyxHQUFHLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFFL0MscUJBQXFCO0lBRXJCLE1BQU0sSUFBSSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3RCxJQUFJLFVBQVUsRUFBRTtRQUNkLHVCQUFVLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtZQUNwQyxTQUFTLEVBQUUsaUJBQWlCLFNBQVMsRUFBRTtTQUN4QyxDQUFDLENBQUM7S0FDSjtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFkRCx3Q0FjQztBQUVELFNBQWdCLGFBQWEsQ0FDM0IsTUFBVyxFQUNYLEVBQUUsVUFBVSxHQUFHLElBQUksRUFBRSxTQUFTLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUU5QyxZQUFZO0lBQ1osSUFBSSxVQUFVLENBQUM7SUFDZixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDdEIsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7WUFDM0IsWUFBWTtZQUNaLFVBQVUsR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRTtnQkFDOUMsU0FBUyxFQUFFLG1CQUFtQjtnQkFDOUIsWUFBWSxFQUFFLG1CQUFtQjtnQkFDakMsaUJBQWlCLEVBQUUsbUJBQW1CO2FBQ3ZDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxXQUFXO1lBQ1gsVUFBVSxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO2dCQUM5QyxTQUFTLEVBQUUsbUJBQW1CO2dCQUM5QixZQUFZLEVBQUUsbUJBQW1CO2FBQ2xDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7U0FBTTtRQUNMLFlBQVk7UUFDWixVQUFVLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7WUFDOUMsU0FBUyxFQUFFLG1CQUFtQjtZQUM5QixnQkFBZ0IsRUFBRSxtQkFBbUI7U0FDdEMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxJQUFJLFVBQVUsRUFBRTtRQUNkLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUN0QixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDM0IsWUFBWTtnQkFDWix1QkFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRTtvQkFDeEMsU0FBUyxFQUFFLGlCQUFpQixTQUFTLEVBQUU7aUJBQ3hDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLFdBQVc7Z0JBQ1gsdUJBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUU7b0JBQ3pDLFNBQVMsRUFBRSxpQkFBaUIsU0FBUyxFQUFFO2lCQUN4QyxDQUFDLENBQUM7YUFDSjtTQUNGO2FBQU07WUFDTCxZQUFZO1lBQ1osdUJBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hDLFNBQVMsRUFBRSxpQkFBaUIsU0FBUyxFQUFFO2FBQ3hDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7SUFFRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBbkRELHNDQW1EQztBQUNELFNBQWdCLG9CQUFvQixDQUNsQyxXQUFnQixFQUNoQixFQUFFLFVBQVUsR0FBRyxJQUFJLEVBQUUsU0FBUyxHQUFHLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFFckQsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRTtRQUNqRSxLQUFLLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUMvQixHQUFHLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQztLQUM3QixDQUFDLENBQUM7SUFFSCxJQUFJLFVBQVUsRUFBRTtRQUNkLHVCQUFVLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUU7WUFDakQsU0FBUyxFQUFFLGlCQUFpQixTQUFTLEVBQUU7U0FDeEMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPLGtCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFoQkQsb0RBZ0JDO0FBRVksUUFBQSxXQUFXLEdBQUc7SUFDekIsb0JBQW9CO0lBQ3BCLHVCQUF1QjtJQUN2QixjQUFjO0NBQ2YsQ0FBQyJ9