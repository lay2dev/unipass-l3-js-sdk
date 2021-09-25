export declare function TransformRowAction(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformInnerRaw(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformTxStatus(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformRecoveryEmail(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformLocalKey(rawTransaction: any, { debugPath }?: {
    debugPath?: string;
}): any;
export declare function TransformPendingState(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformRowTransaction(rawTransaction: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformRawTransaction(rawTransaction: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformRsaPubkey(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function transformPubkey(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function transformRecoveryEmailInner(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformActionRegister(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformActionAddKey(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformActionDeleteKey(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformActionUpdateRecoveryEmail(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformActionUpdateQuickLogin(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformInnerTypeData(type: string): any;
export declare function TransformInner(target: any, { validation, debugPath }?: {
    validation?: boolean;
    debugPath?: string;
}): {};
export declare function TransformSign(target: any, { validation, debugPath }?: {
    validation?: boolean;
    debugPath?: string;
}): any;
export declare function TransformTransaction(transaction: any, { validation, debugPath }?: {
    validation?: boolean;
    debugPath?: string;
}): {};
export declare const transaction: {
    TransformTransaction: typeof TransformTransaction;
    TransformRawTransaction: typeof TransformRawTransaction;
    TransformInner: typeof TransformInner;
};
