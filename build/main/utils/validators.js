"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = exports.ValidateTransaction = exports.ValidatSignRegister = exports.ValidatSignAddKey2 = exports.ValidatSignAddKey1 = exports.ValidateInner = exports.ValidateAction = exports.ValidateRecoveryEmail = exports.ValidatePubkey = exports.ValidateTarget = void 0;
const interface_1 = require("../interface");
function assertObject(debugPath, object) {
    if (!(object instanceof Object)) {
        throw new Error(`${debugPath} is not an object!`);
    }
}
function assertObjectWithKeys(debugPath, object, expectedKeys, optionalKeys = []) {
    assertObject(debugPath, object);
    const providedKeys = Object.keys(object).sort();
    const requiredLength = expectedKeys.length;
    const maximalLength = expectedKeys.length + optionalKeys.length;
    const errorMessage = `${debugPath} does not have correct keys! Required keys: [${expectedKeys
        .sort()
        .join(', ')}], optional keys: [${optionalKeys
        .sort()
        .join(', ')}], actual keys: [${providedKeys.join(', ')}]`;
    if (providedKeys.length < requiredLength ||
        providedKeys.length > maximalLength) {
        throw new Error(errorMessage);
    }
    let optionalProvidedKeys = providedKeys.filter((key) => !expectedKeys.includes(key));
    if (providedKeys.length - optionalProvidedKeys.length !== requiredLength) {
        throw new Error(errorMessage);
    }
    if (optionalProvidedKeys.find((key) => !optionalKeys.includes(key))) {
        throw new Error(errorMessage);
    }
}
function ValidateTarget(target, { debugPath = 'target' } = {}) {
    assertObjectWithKeys(debugPath, target, ['to', 'amount'], []);
}
exports.ValidateTarget = ValidateTarget;
function ValidatePubkey(raw, { debugPath = 'action' } = {}) {
    if (raw.rsa_pubkey) {
        assertObjectWithKeys(debugPath, raw, ['rsa_pubkey'], []);
    }
    else if (raw.secp256k1) {
        assertObjectWithKeys(debugPath, raw, ['secp256k1'], []);
    }
    else if (raw.secp256r1) {
        assertObjectWithKeys(debugPath, raw, ['secp256r1'], []);
    }
    else {
        assertObjectWithKeys(debugPath, raw, ['rsa_pubkey', 'secp256k1', 'secp256r1'], []);
    }
}
exports.ValidatePubkey = ValidatePubkey;
function ValidateRecoveryEmail(raw, { debugPath = 'action' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['threshold', 'first_n', 'emails'], []);
}
exports.ValidateRecoveryEmail = ValidateRecoveryEmail;
function ValidateAction(raw, { debugPath = 'action', action = null } = {}) {
    if (action) {
        switch (action) {
            case interface_1.RpcActionType.REGISTER:
                assertObjectWithKeys(debugPath, raw, [
                    'ori_username',
                    'register_email',
                    'pubkey',
                    'quick_login',
                    'recovery_email',
                    'source',
                ], []);
                ValidatePubkey(raw.pubkey);
                ValidateRecoveryEmail(raw.recovery_email);
                break;
            case interface_1.RpcActionType.ADD_KEY:
                assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
                ValidatePubkey(raw.pubkey);
                break;
            case interface_1.RpcActionType.DEL_KEY:
                assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
                ValidatePubkey(raw.pubkey);
                break;
            case interface_1.RpcActionType.UPDATE_RECOVERY_EMAIL:
                assertObjectWithKeys(debugPath, raw, ['recovery_email'], []);
                ValidateRecoveryEmail(raw.recovery_email);
                break;
            case interface_1.RpcActionType.UPDATE_QUICK_LOGIN:
                assertObjectWithKeys(debugPath, raw, ['quick_login'], []);
                break;
            case interface_1.RpcActionType.START_RECOVERY_1:
            case interface_1.RpcActionType.START_RECOVERY_2:
            case interface_1.RpcActionType.CANCEL_RECOVERY:
            case interface_1.RpcActionType.FINISH_RECOVERY:
                assertObjectWithKeys(debugPath, raw, ['pubkey', 'replace_old'], []);
                ValidatePubkey(raw.pubkey);
                break;
            default:
                throw new Error('invalid type ');
        }
    }
    else {
        assertObjectWithKeys(debugPath, raw, ['register_email', 'pubkey', 'quick_login', 'recovery_email'], []);
        ValidatePubkey(raw.pubkey);
        ValidateRecoveryEmail(raw.recovery_email);
    }
}
exports.ValidateAction = ValidateAction;
function ValidateInner(raw, { debugPath = 'inner' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['type', 'nonce', 'action', 'username'], []);
    ValidateAction(raw.action, { action: raw.type, debugPath: 'action' });
}
exports.ValidateInner = ValidateInner;
function ValidatSignAddKey1(raw, { debugPath = 'sign' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['signature', 'oldkey_signature'], []);
    ValidateAction(raw.action);
}
exports.ValidatSignAddKey1 = ValidatSignAddKey1;
function ValidatSignAddKey2(raw, { debugPath = 'sign' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['signature', 'email_header', 'unipass_signature'], []);
    ValidateAction(raw.action);
}
exports.ValidatSignAddKey2 = ValidatSignAddKey2;
function ValidatSignRegister(raw, { debugPath = 'sign' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['signature', 'email_header'], []);
    ValidateAction(raw.action);
}
exports.ValidatSignRegister = ValidatSignRegister;
function ValidateTransaction(transaction, { debugPath = 'transaction' } = {}) {
    assertObjectWithKeys(debugPath, transaction, ['inner', 'sig'], []);
    ValidateInner(transaction.inner);
}
exports.ValidateTransaction = ValidateTransaction;
exports.validators = {
    ValidateTransaction,
    ValidateInner,
    ValidatSignAddKey1,
    ValidatSignAddKey2,
    ValidatSignRegister,
    ValidateAction,
    ValidateTarget,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUE2QztBQUU3QyxTQUFTLFlBQVksQ0FBQyxTQUFpQixFQUFFLE1BQWM7SUFDckQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sQ0FBQyxFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxTQUFTLG9CQUFvQixDQUFDLENBQUM7S0FDbkQ7QUFDSCxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FDM0IsU0FBaUIsRUFDakIsTUFBYyxFQUNkLFlBQXNCLEVBQ3RCLFlBQVksR0FBRyxFQUFFO0lBRWpCLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoRCxNQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQzNDLE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUNoRSxNQUFNLFlBQVksR0FBRyxHQUFHLFNBQVMsZ0RBQWdELFlBQVk7U0FDMUYsSUFBSSxFQUFFO1NBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsWUFBWTtTQUM1QyxJQUFJLEVBQUU7U0FDTixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDNUQsSUFDRSxZQUFZLENBQUMsTUFBTSxHQUFHLGNBQWM7UUFDcEMsWUFBWSxDQUFDLE1BQU0sR0FBRyxhQUFhLEVBQ25DO1FBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUksb0JBQW9CLEdBQUcs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