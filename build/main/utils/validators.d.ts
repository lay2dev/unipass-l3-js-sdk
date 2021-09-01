export declare function ValidateTarget(target: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateAction(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateInner(raw: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare function ValidateTransaction(transaction: any, { debugPath }?: {
    debugPath?: string;
}): void;
export declare const validators: {
    ValidateTransaction: typeof ValidateTransaction;
    ValidateInner: typeof ValidateInner;
    ValidateAction: typeof ValidateAction;
    ValidateTarget: typeof ValidateTarget;
};
