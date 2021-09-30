import { RpcActionType } from '../interface';
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
export function ValidateTarget(target, { debugPath = 'target' } = {}) {
    assertObjectWithKeys(debugPath, target, ['to', 'amount'], []);
}
export function ValidatePubkey(raw, { debugPath = 'action' } = {}) {
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
export function ValidateRecoveryEmail(raw, { debugPath = 'action' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['threshold', 'first_n', 'emails'], []);
}
export function ValidateAction(raw, { debugPath = 'action', action = null } = {}) {
    if (action) {
        switch (action) {
            case RpcActionType.REGISTER:
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
            case RpcActionType.ADD_KEY:
                assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
                ValidatePubkey(raw.pubkey);
                break;
            case RpcActionType.DEL_KEY:
                assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
                ValidatePubkey(raw.pubkey);
                break;
            case RpcActionType.UPDATE_RECOVERY_EMAIL:
                assertObjectWithKeys(debugPath, raw, ['recovery_email'], []);
                ValidateRecoveryEmail(raw.recovery_email);
                break;
            case RpcActionType.UPDATE_QUICK_LOGIN:
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
export function ValidateInner(raw, { debugPath = 'inner' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['type', 'nonce', 'action', 'username'], []);
    ValidateAction(raw.action, { action: raw.type, debugPath: 'action' });
}
export function ValidatSignAddKey1(raw, { debugPath = 'sign' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['signature', 'oldkey_signature'], []);
    ValidateAction(raw.action);
}
export function ValidatSignAddKey2(raw, { debugPath = 'sign' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['signature', 'email_header', 'unipass_signature'], []);
    ValidateAction(raw.action);
}
export function ValidatSignRegister(raw, { debugPath = 'sign' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['signature', 'email_header'], []);
    ValidateAction(raw.action);
}
export function ValidateTransaction(transaction, { debugPath = 'transaction' } = {}) {
    assertObjectWithKeys(debugPath, transaction, ['inner', 'sig'], []);
    ValidateInner(transaction.inner);
}
export const validators = {
    ValidateTransaction,
    ValidateInner,
    ValidatSignAddKey1,
    ValidatSignAddKey2,
    ValidatSignRegister,
    ValidateAction,
    ValidateTarget,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFN0MsU0FBUyxZQUFZLENBQUMsU0FBaUIsRUFBRSxNQUFjO0lBQ3JELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLENBQUMsRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsU0FBUyxvQkFBb0IsQ0FBQyxDQUFDO0tBQ25EO0FBQ0gsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQzNCLFNBQWlCLEVBQ2pCLE1BQWMsRUFDZCxZQUFzQixFQUN0QixZQUFZLEdBQUcsRUFBRTtJQUVqQixZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEQsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUMzQyxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDaEUsTUFBTSxZQUFZLEdBQUcsR0FBRyxTQUFTLGdEQUFnRCxZQUFZO1NBQzFGLElBQUksRUFBRTtTQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLFlBQVk7U0FDNUMsSUFBSSxFQUFFO1NBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQzVELElBQ0UsWUFBWSxDQUFDLE1BQU0sR0FBRyxjQUFjO1FBQ3BDLFlBQVksQ0FBQyxNQUFNLEdBQUcsYUFBYSxFQUNuQztRQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7S0FD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