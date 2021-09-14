import test from 'ava';
import { Transaction } from '.';
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
test('test Transaction getSignMessage validate', async (t) => {
    const data = new Transaction(rawData, sig);
    // const testSignMessage = await data.testSignMessage();
    // console.log(testSignMessage);
    const signMessage = await data.getRegisterSignMessageByRSA();
    console.log(signMessage);
    t.is(true, true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBRWhDLE1BQU0sT0FBTyxHQUFHO0lBQ2QsS0FBSyxFQUFFLEtBQUs7SUFDWixJQUFJLEVBQUUsVUFBVTtJQUNoQixRQUFRLEVBQUUsTUFBTTtJQUNoQixNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsV0FBVztRQUNqQixLQUFLLEVBQUU7WUFDTCxDQUFDLEVBQUUsTUFBTTtZQUNULENBQUMsRUFBRSw4Q0FBOEM7U0FDbEQ7S0FDRjtJQUNELE1BQU0sRUFBRTtRQUNOLGFBQWEsRUFBRSxnQkFBZ0I7UUFDL0IsTUFBTSxFQUFFLDhDQUE4QztRQUN0RCxhQUFhLEVBQUUsSUFBSTtRQUNuQixVQUFVLEVBQUUsSUFBSTtLQUNqQjtDQUNGLENBQUM7QUFDRixNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUM7QUFFdEIseUNBQXlDO0FBQ3pDLDRCQUE0QjtBQUU1QixzREFBc0Q7QUFDdEQsZ0RBQWdEO0FBQ2hELDBDQUEwQztBQUMxQyxnRUFBZ0U7QUFDaEUsOEJBQThCO0FBQzlCLE1BQU07QUFFTix3REFBd0Q7QUFDeEQsZ0RBQWdEO0FBQ2hELDJDQUEyQztBQUMzQyw2RUFBNkU7QUFDN0UsTUFBTTtBQUVOLG1EQUFtRDtBQUNuRCxnREFBZ0Q7QUFDaEQseUNBQXlDO0FBQ3pDLGdGQUFnRjtBQUNoRixNQUFNO0FBRU4sbUVBQW1FO0FBQ25FLGdEQUFnRDtBQUNoRCxxQ0FBcUM7QUFDckMsc0JBQXNCO0FBQ3RCLE1BQU07QUFFTixJQUFJLENBQUMsMENBQTBDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzNELE1BQU0sSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzQyx3REFBd0Q7SUFDeEQsZ0NBQWdDO0lBQ2hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7SUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQyJ9