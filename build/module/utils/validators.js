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
            case 'register':
                assertObjectWithKeys(debugPath, raw, ['register_email', 'pubkey', 'quick_login', 'recovery_email'], []);
                ValidatePubkey(raw.pubkey);
                ValidateRecoveryEmail(raw.recovery_email);
                break;
            case 'add_key':
                assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
                ValidatePubkey(raw.pubkey);
                break;
            case 'delete_key':
                assertObjectWithKeys(debugPath, raw, ['pubkey'], []);
                ValidatePubkey(raw.pubkey);
                break;
            case 'update_recovery_email':
                assertObjectWithKeys(debugPath, raw, ['recovery_email'], []);
                ValidateRecoveryEmail(raw.recovery_email);
                break;
            case 'update_quick_login':
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsTUFBYztJQUNyRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFNBQVMsb0JBQW9CLENBQUMsQ0FBQztLQUNuRDtBQUNILENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUMzQixTQUFpQixFQUNqQixNQUFjLEVBQ2QsWUFBc0IsRUFDdEIsWUFBWSxHQUFHLEVBQUU7SUFFakIsWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hELE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDM0MsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ2hFLE1BQU0sWUFBWSxHQUFHLEdBQUcsU0FBUyxnREFBZ0QsWUFBWTtTQUMxRixJQUFJLEVBQUU7U0FDTixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixZQUFZO1NBQzVDLElBQUksRUFBRTtTQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUM1RCxJQUNFLFlBQVksQ0FBQyxNQUFNLEdBQUcsY0FBYztRQUNwQyxZQUFZLENBQUMsTUFBTSxHQUFHLGFBQWEsRUFDbkM7UUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsSUFBSSxvQkFBb0IsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUM1QyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUNyQyxDQUFDO0lBQ0YsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLG9CQUFvQixDQUFDLE1BQU0sS0FBSyxjQUFjLEVBQUU7UUFDeEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNuRSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9CO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsTUFBVyxFQUFFLEVBQUUsU0FBUyxHQUFHLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdkUsb0JBQW9CLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBQ0QsTUFBTSxVQUFVLGNBQWMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxTQUFTLEdBQUcsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNwRSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDbEIsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzFEO1NBQU0sSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO1FBQ3hCLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN6RDtTQUFNLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRTtRQUN4QixvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDekQ7U0FBTTtRQUNMLG9CQUFvQixDQUNsQixTQUFTLEVBQ1QsR0FBRyxFQUNILENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFDeEMsRUFBRSxDQUNILENBQUM7S0FDSDtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUscUJBQXFCLENBQUMsR0FBUSxFQUFFLEVBQUUsU0FBUyxHQUFHLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDM0Usb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQzVCLEdBQVEsRUFDUixFQUFFLFNBQVMsR0FBRyxRQUFRLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUU7SUFFNUMsSUFBSSxNQUFNLEVBQUU7UUFDVixRQUFRLE1BQU0sRUFBRTtZQUNkLEtBQUssVUFBVTtnQkFDYixvQkFBb0IsQ0FDbEIsU0FBUyxFQUNULEdBQUcsRUFDSCxDQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsRUFDN0QsRUFBRSxDQUNILENBQUM7Z0JBQ0YsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0IscUJBQXFCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMxQyxNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDckQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0IsTUFBTTtZQUNSLEtBQUssWUFBWTtnQkFDZixvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3JELGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzNCLE1BQU07WUFDUixLQUFLLHVCQUF1QjtnQkFDMUIsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzdELHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDMUMsTUFBTTtZQUNSLEtBQUssb0JBQW9CO2dCQUN2QixvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFELE1BQU07WUFDUjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3BDO0tBQ0Y7U0FBTTtRQUNMLG9CQUFvQixDQUNsQixTQUFTLEVBQ1QsR0FBRyxFQUNILENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUM3RCxFQUFFLENBQ0gsQ0FBQztRQUNGLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IscUJBQXFCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzNDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQUMsR0FBUSxFQUFFLEVBQUUsU0FBUyxHQUFHLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDbEUsb0JBQW9CLENBQ2xCLFNBQVMsRUFDVCxHQUFHLEVBQ0gsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFDdkMsRUFBRSxDQUNILENBQUM7SUFDRixjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsR0FBUSxFQUFFLEVBQUUsU0FBUyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDdEUsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUNELE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxHQUFRLEVBQUUsRUFBRSxTQUFTLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUN0RSxvQkFBb0IsQ0FDbEIsU0FBUyxFQUNULEdBQUcsRUFDSCxDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUMsRUFDbEQsRUFBRSxDQUNILENBQUM7SUFDRixjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFDRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsR0FBUSxFQUFFLEVBQUUsU0FBUyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDdkUsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQ2pDLFdBQWdCLEVBQ2hCLEVBQUUsU0FBUyxHQUFHLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFFbEMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuRSxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUc7SUFDeEIsbUJBQW1CO0lBQ25CLGFBQWE7SUFDYixrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2QsY0FBYztDQUNmLENBQUMifQ==