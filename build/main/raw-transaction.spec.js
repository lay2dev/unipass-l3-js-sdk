"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const raw_transaction_1 = require("./raw-transaction");
const txRawData = {
    id: 2,
    jsonrpc: '2.0',
    result: {
        transaction_inner: {
            nonce: '0x1',
            type: 'register',
            action: {
                register_email: 'johnz@lay2.dev',
                pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
                recovery_email: null,
                quick_login: true,
            },
        },
        tx_status: {
            ckb_tx_hash: '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
            status: 'pending',
        },
    },
};
const historyTxRawStringData = {
    id: 2,
    jsonrpc: '2.0',
    result: [
        {
            transaction_inner: {
                nonce: '0x1',
                type: 'register',
                action: {
                    register_email: 'johnz@lay2.dev',
                    pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
                    recovery_email: null,
                    quick_login: true,
                },
            },
            tx_status: {
                ckb_tx_hash: '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
                status: 'pending',
            },
        },
        {
            transaction_inner: {
                nonce: '0x1',
                type: 'register',
                action: {
                    register_email: 'johnz@lay2.dev',
                    pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
                    recovery_email: null,
                    quick_login: true,
                },
            },
            tx_status: {
                ckb_tx_hash: '0x067da578be477e3b0596a282e0fea6c33121f40df2e9dbe787f00d1249af01a2',
                status: 'pending',
            },
        },
    ],
};
const userInfoRawData = {
    jsonrpc: '2.0',
    result: [
        {
            local_keys: [
                {
                    rsa_pubkey: {
                        e: 65537,
                        n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
                    },
                },
            ],
            nonce: '0x1',
            quick_login: false,
            recovery_email: {
                emails: [
                    '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
                ],
                first_n: 1,
                threshold: 1,
            },
            register_email: '0xb701f116b2c00668ae2a6fab119af93703df4c37ee79a7d63c4ff971b17a6902',
            username: '0x231edefda5d8c03e2ca9c5f36c55b0735f5ce3289b21c7f2e153a5cd8a1882f9',
        },
    ],
    id: 4627112,
};
const stringRawData = { jsonrpc: '2.0', result: '0x2cb4', id: 2 };
// test('test rawTransaction tx txRawData', async (t) => {
//   const data = new RawTransaction(txRawData);
//   const formateData = data.transform() as TransactionResult;
//   console.log(formateData);
//   t.is(formateData.txStatus.ckbTxHash, txRawData.result.tx_status.ckb_tx_hash);
// });
// test('test rawTransaction historyTxRawData ', async (t) => {
//   const data = new RawTransaction(historyTxRawStringData);
//   const formateData = data.transform() as TransactionResult[];
//   console.log(formateData);
//   t.is(
//     formateData[0].txStatus.ckbTxHash,
//     historyTxRawStringData.result[0].tx_status.ckb_tx_hash
//   );
// });
ava_1.default('test rawTransaction userInfoRawData ', async (t) => {
    const data = new raw_transaction_1.RawTransaction(userInfoRawData);
    const formateData = data.transform();
    t.is(formateData[0].registerEmail, userInfoRawData.result[0].register_email);
});
// test('test rawTransaction stringRawData ', async (t) => {
//   const data = new RawTransaction(stringRawData);
//   const formateData = data.transform();
//   console.log(formateData);
//   t.is(formateData, stringRawData.result);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LXRyYW5zYWN0aW9uLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmF3LXRyYW5zYWN0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFFdkIsdURBQW1EO0FBRW5ELE1BQU0sU0FBUyxHQUFHO0lBQ2hCLEVBQUUsRUFBRSxDQUFDO0lBQ0wsT0FBTyxFQUFFLEtBQUs7SUFDZCxNQUFNLEVBQUU7UUFDTixpQkFBaUIsRUFBRTtZQUNqQixLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsZ0JBQWdCO2dCQUNoQyxNQUFNLEVBQUUsOENBQThDO2dCQUN0RCxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRjtRQUNELFNBQVMsRUFBRTtZQUNULFdBQVcsRUFDVCxvRUFBb0U7WUFDdEUsTUFBTSxFQUFFLFNBQVM7U0FDbEI7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLHNCQUFzQixHQUFHO0lBQzdCLEVBQUUsRUFBRSxDQUFDO0lBQ0wsT0FBTyxFQUFFLEtBQUs7SUFDZCxNQUFNLEVBQUU7UUFDTjtZQUNFLGlCQUFpQixFQUFFO2dCQUNqQixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsTUFBTSxFQUFFO29CQUNOLGNBQWMsRUFBRSxnQkFBZ0I7b0JBQ2hDLE1BQU0sRUFBRSw4Q0FBOEM7b0JBQ3RELGNBQWMsRUFBRSxJQUFJO29CQUNwQixXQUFXLEVBQUUsSUFBSTtpQkFDbEI7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxXQUFXLEVBQ1Qsb0VBQW9FO2dCQUN0RSxNQUFNLEVBQUUsU0FBUzthQUNsQjtTQUNGO1FBQ0Q7WUFDRSxpQkFBaUIsRUFBRTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLE1BQU0sRUFBRTtvQkFDTixjQUFjLEVBQUUsZ0JBQWdCO29CQUNoQyxNQUFNLEVBQUUsOENBQThDO29CQUN0RCxjQUFjLEVBQUUsSUFBSTtvQkFDcEIsV0FBVyxFQUFFLElBQUk7aUJBQ2xCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsV0FBVyxFQUNULG9FQUFvRTtnQkFDdEUsTUFBTSxFQUFFLFNBQVM7YUFDbEI7U0FDRjtLQUNGO0NBQ0YsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFO1FBQ047WUFDRSxVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsVUFBVSxFQUFFO3dCQUNWLENBQUMsRUFBRSxLQUFLO3dCQUNSLENBQUMsRUFBRSxvZ0JBQW9nQjtxQkFDeGdCO2lCQUNGO2FBQ0Y7WUFDRCxLQUFLLEVBQUUsS0FBSztZQUNaLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLGNBQWMsRUFBRTtnQkFDZCxNQUFNLEVBQUU7b0JBQ04sb0VBQW9FO2lCQUNyRTtnQkFDRCxPQUFPLEVBQUUsQ0FBQztnQkFDVixTQUFTLEVBQUUsQ0FBQzthQUNiO1lBQ0QsY0FBYyxFQUNaLG9FQUFvRTtZQUN0RSxRQUFRLEVBQ04sb0VBQW9FO1NBQ3ZFO0tBQ0Y7SUFDRCxFQUFFLEVBQUUsT0FBTztDQUNaLENBQUM7QUFNRixNQUFNLGFBQWEsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFFbEUsMERBQTBEO0FBQzFELGdEQUFnRDtBQUNoRCwrREFBK0Q7QUFDL0QsOEJBQThCO0FBQzlCLGtGQUFrRjtBQUNsRixNQUFNO0FBRU4sK0RBQStEO0FBQy9ELDZEQUE2RDtBQUM3RCxpRUFBaUU7QUFDakUsOEJBQThCO0FBQzlCLFVBQVU7QUFDVix5Q0FBeUM7QUFDekMsNkRBQTZEO0FBQzdELE9BQU87QUFDUCxNQUFNO0FBRU4sYUFBSSxDQUFDLHNDQUFzQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2RCxNQUFNLElBQUksR0FBRyxJQUFJLGdDQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDakQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBc0IsQ0FBQztJQUV6RCxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMvRSxDQUFDLENBQUMsQ0FBQztBQUVILDREQUE0RDtBQUM1RCxvREFBb0Q7QUFDcEQsMENBQTBDO0FBQzFDLDhCQUE4QjtBQUM5Qiw2Q0FBNkM7QUFDN0MsTUFBTSJ9