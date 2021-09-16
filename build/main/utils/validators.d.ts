export declare function ValidateTarget(target: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidatePubkey(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateRecoveryEmail(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateAction(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateInner(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidatSignAddKey1(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidatSignAddKey2(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidatSignRegister(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateTransaction(transaction: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare const validators: {
    ValidateTransaction: typeof ValidateTransaction;
    ValidateInner: typeof ValidateInner;
    ValidatSignAddKey1: typeof ValidatSignAddKey1;
    ValidatSignAddKey2: typeof ValidatSignAddKey2;
    ValidatSignRegister: typeof ValidatSignRegister;
    ValidateAction: typeof ValidateAction;
    ValidateTarget: typeof ValidateTarget;
};
