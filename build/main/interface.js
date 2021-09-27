"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyType = exports.ActionType = void 0;
var ActionType;
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
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var KeyType;
(function (KeyType) {
    KeyType[KeyType["RSA"] = 0] = "RSA";
    KeyType[KeyType["Secp256K1"] = 1] = "Secp256K1";
    KeyType[KeyType["Secp256R1"] = 2] = "Secp256R1";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLFVBVVg7QUFWRCxXQUFZLFVBQVU7SUFDcEIsbURBQVksQ0FBQTtJQUNaLDZEQUFhLENBQUE7SUFDYix5RUFBbUIsQ0FBQTtJQUNuQiw2REFBYSxDQUFBO0lBQ2IsdUVBQWtCLENBQUE7SUFDbEIsNkVBQXFCLENBQUE7SUFDckIsK0RBQWMsQ0FBQTtJQUNkLGlFQUFlLENBQUE7SUFDZixxRUFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBVlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFVckI7QUFFRCxJQUFZLE9BSVg7QUFKRCxXQUFZLE9BQU87SUFDakIsbUNBQUcsQ0FBQTtJQUNILCtDQUFTLENBQUE7SUFDVCwrQ0FBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQUlsQiJ9