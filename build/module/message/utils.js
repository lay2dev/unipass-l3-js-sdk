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
var KeyType;
(function (KeyType) {
    KeyType[KeyType["RSA"] = 0] = "RSA";
    KeyType[KeyType["Secp256K1"] = 1] = "Secp256K1";
    KeyType[KeyType["Secp256R1"] = 2] = "Secp256R1";
})(KeyType || (KeyType = {}));
String.prototype.hexToBuffer = function () {
    const d = String(this);
    return Buffer.from(d.replace('0x', ''), 'hex');
};
// // secp256k1签名逻辑, 此处nodejs写法, 前端使用时替换为： https://github.com/lay2dev/pw-core/blob/7dc6d9915f4eb05818c4d3fb61c40111d6c155e0/src/signers/eth-signer.ts#L45
// export function k1PersonalSign(hash: string, privateKey: string) {
//   const personalHash = hashPersonalMessage(hash.hexToBuffer());
//   const sig = ecsign(personalHash, privateKey.hexToBuffer());
//   return toRpcSig(sig.v, sig.r, sig.s);
// }
// // rsa sign, 此处nodejs写法，前端使用subtleCrypto.sign()
// export function rsaSign(hash: string, key: NodeRSA) {
//   const sig = key.sign(hash.hexToBuffer(), 'hex');
//   return sig;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWVzc2FnZS91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQU4sSUFBWSxVQVVYO0FBVkQsV0FBWSxVQUFVO0lBQ3BCLG1EQUFZLENBQUE7SUFDWiw2REFBYSxDQUFBO0lBQ2IseUVBQW1CLENBQUE7SUFDbkIsNkRBQWEsQ0FBQTtJQUNiLHVFQUFrQixDQUFBO0lBQ2xCLDZFQUFxQixDQUFBO0lBQ3JCLCtEQUFjLENBQUE7SUFDZCxpRUFBZSxDQUFBO0lBQ2YscUVBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVZXLFVBQVUsS0FBVixVQUFVLFFBVXJCO0FBRUQsSUFBSyxPQUlKO0FBSkQsV0FBSyxPQUFPO0lBQ1YsbUNBQUcsQ0FBQTtJQUNILCtDQUFTLENBQUE7SUFDVCwrQ0FBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpJLE9BQU8sS0FBUCxPQUFPLFFBSVg7QUFlRCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRztJQUM3QixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pELENBQUMsQ0FBQztBQUVGLHlKQUF5SjtBQUN6SixxRUFBcUU7QUFDckUsa0VBQWtFO0FBQ2xFLGdFQUFnRTtBQUNoRSwwQ0FBMEM7QUFDMUMsSUFBSTtBQUVKLGtEQUFrRDtBQUNsRCx3REFBd0Q7QUFDeEQscURBQXFEO0FBQ3JELGdCQUFnQjtBQUNoQixJQUFJIn0=