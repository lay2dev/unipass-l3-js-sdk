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
export declare function TransformPendingState(target: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformRowTransaction(rawTransaction: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformRawTransaction(rawTransaction: any, { debugPath }?: {
    debugPath?: string;
}): {};
export declare function TransformAction(target: any, { validation, debugPath }?: {
    validation?: boolean;
    debugPath?: string;
}): {};
export declare function TransformInner(target: any, { validation, debugPath }?: {
    validation?: boolean;
    debugPath?: string;
}): {};
export declare function TransformTransaction(transaction: any, { validation, debugPath }?: {
    validation?: boolean;
    debugPath?: string;
}): {};
export declare const transaction: {
    TransformTransaction: typeof TransformTransaction;
    TransformRawTransaction: typeof TransformRawTransaction;
    TransformInner: typeof TransformInner;
};
