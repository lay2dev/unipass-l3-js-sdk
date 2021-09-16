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
        quickLogin: false,
    },
};
const sig = {
    emailHeader: 'johnz',
    signature: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
};
const uri = 'https://testnet.ckb.dev';
const rpc = new _1.RPC(uri);
ava_1.default('test Transaction formateData', async (t) => {
    const data = new _1.Transaction(rawData, sig);
    const formateData = data.transform();
    console.log(formateData);
    const type = formateData.inner.type;
    t.is(type, rawData.type);
});
// test('test Transaction serializeJson', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const jsonData = data.serializeJson();
//   t.is(jsonData.inner.action.registerEmail, rawData.action.registerEmail);
// });
// test('test Transaction validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const transaction = data.validate();
//   t.is(transaction.inner.action.registerEmail, rawData.action.registerEmail);
// });
// test('test Transaction sendTransaction validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   await data.sendTransaction(rpc);
//   t.is(true, true);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLHdCQUF3RDtBQUV4RCxNQUFNLE9BQU8sR0FBRztJQUNkLEtBQUssRUFBRSxLQUFLO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsTUFBTSxFQUFFO1FBQ04sYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixNQUFNLEVBQUUsOENBQThDO1FBQ3RELGFBQWEsRUFBRSxJQUFJO1FBQ25CLFVBQVUsRUFBRSxLQUFLO0tBQ2xCO0NBQ0YsQ0FBQztBQUNGLE1BQU0sR0FBRyxHQUFHO0lBQ1YsV0FBVyxFQUFFLE9BQU87SUFDcEIsU0FBUyxFQUFFLDhDQUE4QztDQUMxRCxDQUFDO0FBRUYsTUFBTSxHQUFHLEdBQUcseUJBQXlCLENBQUM7QUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxNQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFekIsYUFBSSxDQUFDLDhCQUE4QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLGNBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLEdBQUksV0FBaUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzNELENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQztBQUVILHdEQUF3RDtBQUN4RCxnREFBZ0Q7QUFDaEQsMkNBQTJDO0FBQzNDLDZFQUE2RTtBQUM3RSxNQUFNO0FBRU4sbURBQW1EO0FBQ25ELGdEQUFnRDtBQUNoRCx5Q0FBeUM7QUFDekMsZ0ZBQWdGO0FBQ2hGLE1BQU07QUFFTixtRUFBbUU7QUFDbkUsZ0RBQWdEO0FBQ2hELHFDQUFxQztBQUNyQyxzQkFBc0I7QUFDdEIsTUFBTSJ9