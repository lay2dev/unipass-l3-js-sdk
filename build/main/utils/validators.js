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