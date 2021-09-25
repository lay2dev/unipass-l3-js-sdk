"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const sign_message_1 = require("./sign-message");
const rawData = {
    action: 'register',
    username: 'aven',
    pubkey: null,
    nonce: '0x1',
    quickLogin: true,
    recoveryEmail: 'hi.ellen@qq.com',
    registerEmail: 'hi.ellen@qq.com',
    keyType: 'RsaPubkey',
    pubKey: '0x000800000100010084c6bd6a19cf9b7de289a0a8fe7e4cef0505c713698beb278cb362bb51f707a6d1e8a6ab248f58962710795194bbad2d139eba7bdb17363988b6cf3430b731aabd423b55f8474012252f617eaff5856e8b9cc61a2254b06276654b8dadac624ebb782c9c4df8590686ba3ca25e481d6212c783c9ff26bcb7eaf5fbbe02279b776a731f15e284672a7590512a8919f70d782a86087869d68174bfdbb5d8940772f3d59a6006e7ebed945cb5360840bf3b0a0e590f08a67ccf97bdaf514cd972fc97176fcc6f997f094487c42caf302afd78e9f705f65c5f2b3f8a81cf5ce94274b7ccf8cd5e5dd331af1eeadcdbb92e20ca2c6778e5280aa71a7e9d670ea59495',
};
ava_1.default('test Transaction getSignMessage validate', async (t) => {
    console.log(rawData);
    const data = new sign_message_1.SignMessage(rawData);
    const signMessage = await data.messageHash();
    console.log(signMessage);
    t.is(signMessage.length, 748);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2UvbWVzc2FnZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLGlEQUE2QztBQUc3QyxNQUFNLE9BQU8sR0FBRztJQUNkLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLEtBQUs7SUFDWixVQUFVLEVBQUUsSUFBSTtJQUNoQixhQUFhLEVBQUUsaUJBQWlCO0lBQ2hDLGFBQWEsRUFBRSxpQkFBaUI7SUFDaEMsT0FBTyxFQUFFLFdBQVc7SUFDcEIsTUFBTSxFQUNKLG9oQkFBb2hCO0NBQ3ZoQixDQUFDO0FBRUYsYUFBSSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksMEJBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUMsQ0FBQyJ9