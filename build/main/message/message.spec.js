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
    pubkey: {
        type: 'RsaPubkey',
        value: {
            e: 'AQAB',
            n: 'nz8MOIXWsX_VOpO_bqVpU3lK7AzBhf3t_49PMN8PToYwY6xHJSHDI2rwvUmIPkbqUrYUmimWRwQU7SdRICGyIu3IFKQ',
        },
    },
    registerEmail: 's@qq.com',
};
ava_1.default('test Transaction getSignMessage validate', async (t) => {
    const data = new sign_message_1.SignMessage(rawData);
    const signMessage = await data.sign();
    console.log(signMessage);
    t.is(signMessage.length, 748);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2UvbWVzc2FnZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLGlEQUE2QztBQUU3QyxNQUFNLE9BQU8sR0FBRztJQUNkLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxXQUFXO1FBQ2pCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxNQUFNO1lBQ1QsQ0FBQyxFQUFFLDZGQUE2RjtTQUNqRztLQUNGO0lBQ0QsYUFBYSxFQUFFLFVBQVU7Q0FDMUIsQ0FBQztBQUVGLGFBQUksQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDM0QsTUFBTSxJQUFJLEdBQUcsSUFBSSwwQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQyxDQUFDIn0=