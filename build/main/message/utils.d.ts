/// <reference types="node" />
export declare enum ActionType {
    REGISTER = 0,
    ADD_LOCAL_KEY = 1,
    QUICK_ADD_LOCAL_KEY = 2,
    DEL_LOCAL_KEY = 3,
    UPDATE_QUICK_LOGIN = 4,
    UPDATE_RECOVERY_EMAIL = 5,
    START_RECOVERY = 6,
    CANCEL_RECOVERY = 7,
    COMPLETE_RECOVERY = 8
}
declare global {
    interface String {
        hexToBuffer(): Buffer;
    }
}
