export var ActionType;
(function (ActionType) {
    ActionType[ActionType["REGISTER"] = 0] = "REGISTER";
    ActionType[ActionType["ADD_LOCAL_KEY"] = 1] = "ADD_LOCAL_KEY";
    ActionType[ActionType["QUICK_ADD_LOCAL_KEY"] = 2] = "QUICK_ADD_LOCAL_KEY";
    ActionType[ActionType["DEL_LOCAL_KEY"] = 3] = "DEL_LOCAL_KEY";
    ActionType[ActionType["UPDATE_QUICK_LOGIN"] = 4] = "UPDATE_QUICK_LOGIN";
    ActionType[ActionType["UPDATE_RECOVERY_EMAIL"] = 5] = "UPDATE_RECOVERY_EMAIL";
    ActionType[ActionType["START_RECOVERY_1"] = 6] = "START_RECOVERY_1";
    ActionType[ActionType["START_RECOVERY_2"] = 7] = "START_RECOVERY_2";
    ActionType[ActionType["COMPLETE_RECOVERY"] = 8] = "COMPLETE_RECOVERY";
    ActionType[ActionType["CANCEL_RECOVERY"] = 9] = "CANCEL_RECOVERY";
})(ActionType || (ActionType = {}));
export var RpcActionType;
(function (RpcActionType) {
    RpcActionType["REGISTER"] = "register";
    RpcActionType["ADD_KEY"] = "add_key";
    RpcActionType["DEL_KEY"] = "delete_key";
    RpcActionType["RECOVERY_ADD"] = "recovery_add_key";
    RpcActionType["RECOVERY_REPLACE"] = "recovery_replace";
    RpcActionType["UPDATE_QUICK_LOGIN"] = "update_quick_login";
    RpcActionType["UPDATE_RECOVERY_EMAIL"] = "update_recovery_email";
    RpcActionType["START_RECOVERY_1"] = "start_recovery_1";
    RpcActionType["START_RECOVERY_2"] = "start_recovery_2";
    RpcActionType["FINISH_RECOVERY"] = "finish_recovery";
    RpcActionType["CANCEL_RECOVERY"] = "cancel_recovery";
})(RpcActionType || (RpcActionType = {}));
export var KeyType;
(function (KeyType) {
    KeyType[KeyType["RSA"] = 0] = "RSA";
    KeyType[KeyType["Secp256K1"] = 1] = "Secp256K1";
    KeyType[KeyType["Secp256R1"] = 2] = "Secp256R1";
})(KeyType || (KeyType = {}));
export var ChainId;
(function (ChainId) {
    ChainId[ChainId["devNet"] = 0] = "devNet";
    ChainId[ChainId["mainNet"] = 1] = "mainNet";
})(ChainId || (ChainId = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQU4sSUFBWSxVQVdYO0FBWEQsV0FBWSxVQUFVO0lBQ3BCLG1EQUFZLENBQUE7SUFDWiw2REFBYSxDQUFBO0lBQ2IseUVBQW1CLENBQUE7SUFDbkIsNkRBQWEsQ0FBQTtJQUNiLHVFQUFrQixDQUFBO0lBQ2xCLDZFQUFxQixDQUFBO0lBQ3JCLG1FQUFnQixDQUFBO0lBQ2hCLG1FQUFnQixDQUFBO0lBQ2hCLHFFQUFpQixDQUFBO0lBQ2pCLGlFQUFlLENBQUE7QUFDakIsQ0FBQyxFQVhXLFVBQVUsS0FBVixVQUFVLFFBV3JCO0FBRUQsTUFBTSxDQUFOLElBQVksYUFZWDtBQVpELFdBQVksYUFBYTtJQUN2QixzQ0FBcUIsQ0FBQTtJQUNyQixvQ0FBbUIsQ0FBQTtJQUNuQix1Q0FBc0IsQ0FBQTtJQUN0QixrREFBaUMsQ0FBQTtJQUNqQyxzREFBcUMsQ0FBQTtJQUNyQywwREFBeUMsQ0FBQTtJQUN6QyxnRUFBK0MsQ0FBQTtJQUMvQyxzREFBcUMsQ0FBQTtJQUNyQyxzREFBcUMsQ0FBQTtJQUNyQyxvREFBbUMsQ0FBQTtJQUNuQyxvREFBbUMsQ0FBQTtBQUNyQyxDQUFDLEVBWlcsYUFBYSxLQUFiLGFBQWEsUUFZeEI7QUFFRCxNQUFNLENBQU4sSUFBWSxPQUlYO0FBSkQsV0FBWSxPQUFPO0lBQ2pCLG1DQUFHLENBQUE7SUFDSCwrQ0FBUyxDQUFBO0lBQ1QsK0NBQVMsQ0FBQTtBQUNYLENBQUMsRUFKVyxPQUFPLEtBQVAsT0FBTyxRQUlsQjtBQUVELE1BQU0sQ0FBTixJQUFZLE9BR1g7QUFIRCxXQUFZLE9BQU87SUFDakIseUNBQVUsQ0FBQTtJQUNWLDJDQUFPLENBQUE7QUFDVCxDQUFDLEVBSFcsT0FBTyxLQUFQLE9BQU8sUUFHbEIifQ==