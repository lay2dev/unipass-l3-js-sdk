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
            e: '0x11',
            n: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
        },
    },
    registerEmail: 'johnz@lay2.dev',
};
ava_1.default('test Transaction getSignMessage validate', async (t) => {
    const data = new sign_message_1.SignMessage(rawData);
    const signMessage = await data.sign();
    console.log(signMessage);
    t.is(signMessage.length, 748);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2UvbWVzc2FnZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLGlEQUE2QztBQUU3QyxNQUFNLE9BQU8sR0FBRztJQUNkLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxXQUFXO1FBQ2pCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxNQUFNO1lBQ1QsQ0FBQyxFQUFFLDhDQUE4QztTQUNsRDtLQUNGO0lBQ0QsYUFBYSxFQUFFLGdCQUFnQjtDQUNoQyxDQUFDO0FBRUYsYUFBSSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMzRCxNQUFNLElBQUksR0FBRyxJQUFJLDBCQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDLENBQUMifQ==