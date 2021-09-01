"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
const rawData = {
    nonce: '0x1',
    type: 'register',
    action: {
        registerEmail: 'johnz@lay2.dev',
        pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
        recoveryEmail: null,
        quickLogin: true,
    },
};
const sig = '0x11011';
const uri = 'https://testnet.ckb.dev';
const rpc = new _1.RPC(uri);
ava_1.default('test Transaction formateData', async (t) => {
    const data = new _1.Transaction(rawData, sig);
    const formateData = data.transform();
    const type = formateData.inner.type;
    t.is(type, rawData.type);
});
ava_1.default('test Transaction serializeJson', async (t) => {
    const data = new _1.Transaction(rawData, sig);
    const jsonData = data.serializeJson();
    t.is(jsonData.inner.action.registerEmail, rawData.action.registerEmail);
});
ava_1.default('test Transaction validate', async (t) => {
    const data = new _1.Transaction(rawData, sig);
    const transaction = data.validate();
    t.is(transaction.inner.action.registerEmail, rawData.action.registerEmail);
});
ava_1.default('test Transaction sendTransaction validate', async (t) => {
    const data = new _1.Transaction(rawData, sig);
    await data.sendTransaction(rpc);
    t.is(true, true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLHdCQUF3RDtBQUV4RCxNQUFNLE9BQU8sR0FBRztJQUNkLEtBQUssRUFBRSxLQUFLO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsTUFBTSxFQUFFO1FBQ04sYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixNQUFNLEVBQUUsOENBQThDO1FBQ3RELGFBQWEsRUFBRSxJQUFJO1FBQ25CLFVBQVUsRUFBRSxJQUFJO0tBQ2pCO0NBQ0YsQ0FBQztBQUNGLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQztBQUV0QixNQUFNLEdBQUcsR0FBRyx5QkFBeUIsQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV6QixhQUFJLENBQUMsOEJBQThCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckMsTUFBTSxJQUFJLEdBQUksV0FBaUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzNELENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakQsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLDJCQUEyQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLGNBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDN0UsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksY0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzQyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUMifQ==