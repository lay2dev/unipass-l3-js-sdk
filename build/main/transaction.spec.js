"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        quickLogin: false,
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
// test('test Transaction getSignMessage validate', async (t) => {
//   const data = new Transaction(rawData, sig);
//   const signMessage = await data.getRegisterSignMessageByRSA();
//   console.log(signMessage);
//   t.is(true, true);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsTUFBTSxPQUFPLEdBQUc7SUFDZCxLQUFLLEVBQUUsS0FBSztJQUNaLElBQUksRUFBRSxVQUFVO0lBQ2hCLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxXQUFXO1FBQ2pCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxNQUFNO1lBQ1QsQ0FBQyxFQUFFLDhDQUE4QztTQUNsRDtLQUNGO0lBQ0QsTUFBTSxFQUFFO1FBQ04sYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixNQUFNLEVBQUUsOENBQThDO1FBQ3RELGFBQWEsRUFBRSxJQUFJO1FBQ25CLFVBQVUsRUFBRSxLQUFLO0tBQ2xCO0NBQ0YsQ0FBQztBQUNGLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQztBQUV0Qix5Q0FBeUM7QUFDekMsNEJBQTRCO0FBRTVCLHNEQUFzRDtBQUN0RCxnREFBZ0Q7QUFDaEQsMENBQTBDO0FBQzFDLGdFQUFnRTtBQUNoRSw4QkFBOEI7QUFDOUIsTUFBTTtBQUVOLHdEQUF3RDtBQUN4RCxnREFBZ0Q7QUFDaEQsMkNBQTJDO0FBQzNDLDZFQUE2RTtBQUM3RSxNQUFNO0FBRU4sbURBQW1EO0FBQ25ELGdEQUFnRDtBQUNoRCx5Q0FBeUM7QUFDekMsZ0ZBQWdGO0FBQ2hGLE1BQU07QUFFTixtRUFBbUU7QUFDbkUsZ0RBQWdEO0FBQ2hELHFDQUFxQztBQUNyQyxzQkFBc0I7QUFDdEIsTUFBTTtBQUVOLGtFQUFrRTtBQUNsRSxnREFBZ0Q7QUFDaEQsa0VBQWtFO0FBQ2xFLDhCQUE4QjtBQUM5QixzQkFBc0I7QUFDdEIsTUFBTSJ9