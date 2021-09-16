import test from 'ava';
import { RPC, Transaction } from '.';
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
const rpc = new RPC(uri);
test('test Transaction formateData', async (t) => {
    const data = new Transaction(rawData, sig);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBcUIsTUFBTSxHQUFHLENBQUM7QUFFeEQsTUFBTSxPQUFPLEdBQUc7SUFDZCxLQUFLLEVBQUUsS0FBSztJQUNaLElBQUksRUFBRSxVQUFVO0lBQ2hCLE1BQU0sRUFBRTtRQUNOLGFBQWEsRUFBRSxnQkFBZ0I7UUFDL0IsTUFBTSxFQUFFLDhDQUE4QztRQUN0RCxhQUFhLEVBQUUsSUFBSTtRQUNuQixVQUFVLEVBQUUsS0FBSztLQUNsQjtDQUNGLENBQUM7QUFDRixNQUFNLEdBQUcsR0FBRztJQUNWLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFNBQVMsRUFBRSw4Q0FBOEM7Q0FDMUQsQ0FBQztBQUVGLE1BQU0sR0FBRyxHQUFHLHlCQUF5QixDQUFDO0FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXpCLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sSUFBSSxHQUFJLFdBQWlDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUMzRCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFFSCx3REFBd0Q7QUFDeEQsZ0RBQWdEO0FBQ2hELDJDQUEyQztBQUMzQyw2RUFBNkU7QUFDN0UsTUFBTTtBQUVOLG1EQUFtRDtBQUNuRCxnREFBZ0Q7QUFDaEQseUNBQXlDO0FBQ3pDLGdGQUFnRjtBQUNoRixNQUFNO0FBRU4sbUVBQW1FO0FBQ25FLGdEQUFnRDtBQUNoRCxxQ0FBcUM7QUFDckMsc0JBQXNCO0FBQ3RCLE1BQU0ifQ==