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
export function ValidateAction(raw, { debugPath = 'action' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['register_email', 'pubkey', 'recovery_email', 'quick_login'], []);
}
export function ValidateInner(raw, { debugPath = 'inner' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['type', 'nonce', 'action'], []);
    ValidateAction(raw.action);
}
export function ValidateTransaction(transaction, { debugPath = 'transaction' } = {}) {
    assertObjectWithKeys(debugPath, transaction, ['inner', 'sig'], []);
    ValidateInner(transaction.inner);
}
export const validators = {
    ValidateTransaction,
    ValidateInner,
    ValidateAction,
    ValidateTarget,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsTUFBYztJQUNyRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFNBQVMsb0JBQW9CLENBQUMsQ0FBQztLQUNuRDtBQUNILENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUMzQixTQUFpQixFQUNqQixNQUFjLEVBQ2QsWUFBc0IsRUFDdEIsWUFBWSxHQUFHLEVBQUU7SUFFakIsWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hELE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDM0MsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ2hFLE1BQU0sWUFBWSxHQUFHLEdBQUcsU0FBUyxnREFBZ0QsWUFBWTtTQUMxRixJQUFJLEVBQUU7U0FDTixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixZQUFZO1NBQzVDLElBQUksRUFBRTtTQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUM1RCxJQUNFLFlBQVksQ0FBQyxNQUFNLEdBQUcsY0FBYztRQUNwQyxZQUFZLENBQUMsTUFBTSxHQUFHLGFBQWEsRUFDbkM7UUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsSUFBSSxvQkFBb0IsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUM1QyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUNyQyxDQUFDO0lBQ0YsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLG9CQUFvQixDQUFDLE1BQU0sS0FBSyxjQUFjLEVBQUU7UUFDeEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNuRSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9CO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsTUFBVyxFQUFFLEVBQUUsU0FBUyxHQUFHLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdkUsb0JBQW9CLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxTQUFTLEdBQUcsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNwRSxvQkFBb0IsQ0FDbEIsU0FBUyxFQUNULEdBQUcsRUFDSCxDQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsRUFDN0QsRUFBRSxDQUNILENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxHQUFRLEVBQUUsRUFBRSxTQUFTLEdBQUcsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRSxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0RSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQ2pDLFdBQWdCLEVBQ2hCLEVBQUUsU0FBUyxHQUFHLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFFbEMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuRSxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUc7SUFDeEIsbUJBQW1CO0lBQ25CLGFBQWE7SUFDYixjQUFjO0lBQ2QsY0FBYztDQUNmLENBQUMifQ==