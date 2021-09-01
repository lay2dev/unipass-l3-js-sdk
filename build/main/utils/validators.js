"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = exports.ValidateTransaction = exports.ValidateInner = exports.ValidateAction = exports.ValidateTarget = void 0;
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
function ValidateAction(raw, { debugPath = 'action' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['register_email', 'pubkey', 'recovery_email', 'quick_login'], []);
}
exports.ValidateAction = ValidateAction;
function ValidateInner(raw, { debugPath = 'inner' } = {}) {
    assertObjectWithKeys(debugPath, raw, ['type', 'nonce', 'action'], []);
    ValidateAction(raw.action);
}
exports.ValidateInner = ValidateInner;
function ValidateTransaction(transaction, { debugPath = 'transaction' } = {}) {
    assertObjectWithKeys(debugPath, transaction, ['inner', 'sig'], []);
    ValidateInner(transaction.inner);
}
exports.ValidateTransaction = ValidateTransaction;
exports.validators = {
    ValidateTransaction,
    ValidateInner,
    ValidateAction,
    ValidateTarget,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQVMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsTUFBYztJQUNyRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFNBQVMsb0JBQW9CLENBQUMsQ0FBQztLQUNuRDtBQUNILENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUMzQixTQUFpQixFQUNqQixNQUFjLEVBQ2QsWUFBc0IsRUFDdEIsWUFBWSxHQUFHLEVBQUU7SUFFakIsWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hELE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDM0MsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ2hFLE1BQU0sWUFBWSxHQUFHLEdBQUcsU0FBUyxnREFBZ0QsWUFBWTtTQUMxRixJQUFJLEVBQUU7U0FDTixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixZQUFZO1NBQzVDLElBQUksRUFBRTtTQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUM1RCxJQUNFLFlBQVksQ0FBQyxNQUFNLEdBQUcsY0FBYztRQUNwQyxZQUFZLENBQUMsTUFBTSxHQUFHLGFBQWEsRUFDbkM7UUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsSUFBSSxvQkFBb0IsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUM1QyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUNyQyxDQUFDO0lBQ0YsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLG9CQUFvQixDQUFDLE1BQU0sS0FBSyxjQUFjLEVBQUU7UUFDeEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNuRSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9CO0FBQ0gsQ0FBQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxNQUFXLEVBQUUsRUFBRSxTQUFTLEdBQUcsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN2RSxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFGRCx3Q0FFQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxTQUFTLEdBQUcsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNwRSxvQkFBb0IsQ0FDbEIsU0FBUyxFQUNULEdBQUcsRUFDSCxDQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsRUFDN0QsRUFBRSxDQUNILENBQUM7QUFDSixDQUFDO0FBUEQsd0NBT0M7QUFFRCxTQUFnQixhQUFhLENBQUMsR0FBUSxFQUFFLEVBQUUsU0FBUyxHQUFHLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDbEUsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBSEQsc0NBR0M7QUFFRCxTQUFnQixtQkFBbUIsQ0FDakMsV0FBZ0IsRUFDaEIsRUFBRSxTQUFTLEdBQUcsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUVsQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLGFBQWEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQU5ELGtEQU1DO0FBRVksUUFBQSxVQUFVLEdBQUc7SUFDeEIsbUJBQW1CO0lBQ25CLGFBQWE7SUFDYixjQUFjO0lBQ2QsY0FBYztDQUNmLENBQUMifQ==