"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
const rawData = {
    type: 'register',
    nonce: '0x1',
    username: '0x559d201f1891db7cfc7d52f12563e4717c3736cdc0b833d62f4c9433edabb363',
    action: {
        registerEmail: '0xf3b0d96aa6f47732f1f6048f57b632d4590fef07928c57017a877c4df6f04ff3',
        pubkey: {
            rsaPubkey: {
                e: 65537,
                n: '0xca8ac6f64477b3cc4a92883c1a5bf148410ec4b41b7a513b3a1b0ef847657534fda99ebe5891832d89ee47eb17fed6cfbf3d8e600e6f93b5e2775389505b83348040cb1274d2139e919d1e321198627b831c143e7655fc31b64877618aa802005a8e49b057c419d1f40362abb93b4099ccb2cebb7e6fbfb15b6de5d0b7a0c3cd40db23a357c8fde2454ed4d84a6c2034bb3e3e8df7726257760cc2e6b0825ba4c84259f57b8e5ee18f4744836c200c5b6767dda462b4e02bd8b0730e962faad79a2d1aea8a0ee76924c344c10c02c1176554ef533f66d574ef3fcb2185afdb35bc288966e9061c3ccadee97430d5e41d3aee4ce907fe2066a97bca187b9e18d1',
            },
        },
        recoveryEmail: {
            firstN: 1,
            threshold: 1,
            emails: [
                '0xf3b0d96aa6f47732f1f6048f57b632d4590fef07928c57017a877c4df6f04ff3',
            ],
        },
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
    console.log('===========================');
    console.log(JSON.stringify(formateData));
    console.log('===========================');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2FjdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLHdCQUF3RDtBQUV4RCxNQUFNLE9BQU8sR0FBRztJQUNkLElBQUksRUFBRSxVQUFVO0lBQ2hCLEtBQUssRUFBRSxLQUFLO0lBQ1osUUFBUSxFQUNOLG9FQUFvRTtJQUN0RSxNQUFNLEVBQUU7UUFDTixhQUFhLEVBQ1gsb0VBQW9FO1FBQ3RFLE1BQU0sRUFBRTtZQUNOLFNBQVMsRUFBRTtnQkFDVCxDQUFDLEVBQUUsS0FBSztnQkFDUixDQUFDLEVBQUUsb2dCQUFvZ0I7YUFDeGdCO1NBQ0Y7UUFDRCxhQUFhLEVBQUU7WUFDYixNQUFNLEVBQUUsQ0FBQztZQUNULFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFO2dCQUNOLG9FQUFvRTthQUNyRTtTQUNGO1FBQ0QsVUFBVSxFQUFFLEtBQUs7S0FDbEI7Q0FDRixDQUFDO0FBQ0YsTUFBTSxHQUFHLEdBQUc7SUFDVixXQUFXLEVBQUUsT0FBTztJQUNwQixTQUFTLEVBQUUsOENBQThDO0NBQzFELENBQUM7QUFFRixNQUFNLEdBQUcsR0FBRyx5QkFBeUIsQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV6QixhQUFJLENBQUMsOEJBQThCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUMzQyxNQUFNLElBQUksR0FBSSxXQUFpQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDM0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsd0RBQXdEO0FBQ3hELGdEQUFnRDtBQUNoRCwyQ0FBMkM7QUFDM0MsNkVBQTZFO0FBQzdFLE1BQU07QUFFTixtREFBbUQ7QUFDbkQsZ0RBQWdEO0FBQ2hELHlDQUF5QztBQUN6QyxnRkFBZ0Y7QUFDaEYsTUFBTTtBQUVOLG1FQUFtRTtBQUNuRSxnREFBZ0Q7QUFDaEQscUNBQXFDO0FBQ3JDLHNCQUFzQjtBQUN0QixNQUFNIn0=