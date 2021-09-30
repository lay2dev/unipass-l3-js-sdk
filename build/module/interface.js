export var ActionType;
(function (ActionType) {
    ActionType[ActionType["REGISTER"] = 0] = "REGISTER";
    ActionType[ActionType["ADD_LOCAL_KEY"] = 1] = "ADD_LOCAL_KEY";
    ActionType[ActionType["QUICK_ADD_LOCAL_KEY"] = 2] = "QUICK_ADD_LOCAL_KEY";
    ActionType[ActionType["DEL_LOCAL_KEY"] = 3] = "DEL_LOCAL_KEY";
    ActionType[ActionType["UPDATE_QUICK_LOGIN"] = 4] = "UPDATE_QUICK_LOGIN";
    ActionType[ActionType["UPDATE_RECOVERY_EMAIL"] = 5] = "UPDATE_RECOVERY_EMAIL";
    ActionType[ActionType["START_RECOVERY"] = 6] = "START_RECOVERY";
    ActionType[ActionType["CANCEL_RECOVERY"] = 7] = "CANCEL_RECOVERY";
    ActionType[ActionType["COMPLETE_RECOVERY"] = 8] = "COMPLETE_RECOVERY";
})(ActionType || (ActionType = {}));
export var RpcActionType;
(function (RpcActionType) {
    RpcActionType["REGISTER"] = "register";
    RpcActionType["ADD_KEY"] = "add_key";
    RpcActionType["DEL_KEY"] = "update_quick_login";
    RpcActionType["UPDATE_QUICK_LOGIN"] = "update_recovery_email";
    RpcActionType["UPDATE_RECOVERY_EMAIL"] = "update_recovery_email";
})(RpcActionType || (RpcActionType = {}));
export var KeyType;
(function (KeyType) {
    KeyType[KeyType["RSA"] = 0] = "RSA";
    KeyType[KeyType["Secp256K1"] = 1] = "Secp256K1";
    KeyType[KeyType["Secp256R1"] = 2] = "Secp256R1";
})(KeyType || (KeyType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQU4sSUFBWSxVQVVYO0FBVkQsV0FBWSxVQUFVO0lBQ3BCLG1EQUFZLENBQUE7SUFDWiw2REFBYSxDQUFBO0lBQ2IseUVBQW1CLENBQUE7SUFDbkIsNkRBQWEsQ0FBQTtJQUNiLHVFQUFrQixDQUFBO0lBQ2xCLDZFQUFxQixDQUFBO0lBQ3JCLCtEQUFjLENBQUE7SUFDZCxpRUFBZSxDQUFBO0lBQ2YscUVBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVZXLFVBQVUsS0FBVixVQUFVLFFBVXJCO0FBRUQsTUFBTSxDQUFOLElBQVksYUFNWDtBQU5ELFdBQVksYUFBYTtJQUN2QixzQ0FBcUIsQ0FBQTtJQUNyQixvQ0FBbUIsQ0FBQTtJQUNuQiwrQ0FBOEIsQ0FBQTtJQUM5Qiw2REFBNEMsQ0FBQTtJQUM1QyxnRUFBK0MsQ0FBQTtBQUNqRCxDQUFDLEVBTlcsYUFBYSxLQUFiLGFBQWEsUUFNeEI7QUFFRCxNQUFNLENBQU4sSUFBWSxPQUlYO0FBSkQsV0FBWSxPQUFPO0lBQ2pCLG1DQUFHLENBQUE7SUFDSCwrQ0FBUyxDQUFBO0lBQ1QsK0NBQVMsQ0FBQTtBQUNYLENBQUMsRUFKVyxPQUFPLEtBQVAsT0FBTyxRQUlsQiJ9