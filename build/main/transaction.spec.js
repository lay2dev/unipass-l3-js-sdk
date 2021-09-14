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
    username: 'aven',
    pubkey: {
        type: 'RsaPubkey',
        value: {
            e: '0x11',
            n: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
        },
    },
    action: {
        registerEmail: 'johnz@lay2.dev',
        pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
        recoveryEmail: null,
        quickLogin: true,
    },
};
const sig = '0x11011';
// const uri = 'https://testnet.ckb.dev';
// const rpc = new RPC(uri);
// test('test Transaction formateData', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const formateData = data.transform();
//   const type = (formateData as TransactionParams).inner.type;
//   t.is(type, rawData.type);
// });
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
ava_1.default('test Transaction getSignMessage validate', async (t) => {
    const data = new _1.Transaction(rawData, sig);
    // const testSignMessage = await data.testSignMessage();
    // console.log(testSignMessage);
    const signMessage = await data.getRegisterSignMessageByRSA();
    console.log(signMessage);
    t.is(true, true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLHdCQUFnQztBQUVoQyxNQUFNLE9BQU8sR0FBRztJQUNkLEtBQUssRUFBRSxLQUFLO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsUUFBUSxFQUFFLE1BQU07SUFDaEIsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLFdBQVc7UUFDakIsS0FBSyxFQUFFO1lBQ0wsQ0FBQyxFQUFFLE1BQU07WUFDVCxDQUFDLEVBQUUsOENBQThDO1NBQ2xEO0tBQ0Y7SUFDRCxNQUFNLEVBQUU7UUFDTixhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLE1BQU0sRUFBRSw4Q0FBOEM7UUFDdEQsYUFBYSxFQUFFLElBQUk7UUFDbkIsVUFBVSxFQUFFLElBQUk7S0FDakI7Q0FDRixDQUFDO0FBQ0YsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDO0FBRXRCLHlDQUF5QztBQUN6Qyw0QkFBNEI7QUFFNUIsc0RBQXNEO0FBQ3RELGdEQUFnRDtBQUNoRCwwQ0FBMEM7QUFDMUMsZ0VBQWdFO0FBQ2hFLDhCQUE4QjtBQUM5QixNQUFNO0FBRU4sd0RBQXdEO0FBQ3hELGdEQUFnRDtBQUNoRCwyQ0FBMkM7QUFDM0MsNkVBQTZFO0FBQzdFLE1BQU07QUFFTixtREFBbUQ7QUFDbkQsZ0RBQWdEO0FBQ2hELHlDQUF5QztBQUN6QyxnRkFBZ0Y7QUFDaEYsTUFBTTtBQUVOLG1FQUFtRTtBQUNuRSxnREFBZ0Q7QUFDaEQscUNBQXFDO0FBQ3JDLHNCQUFzQjtBQUN0QixNQUFNO0FBRU4sYUFBSSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMzRCxNQUFNLElBQUksR0FBRyxJQUFJLGNBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0Msd0RBQXdEO0lBQ3hELGdDQUFnQztJQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUMifQ==