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
            commit_status: 'committed',
            local_keys: [
                {
                    secp256k1: '0x68514d4a157aa662e79682184be0b94a42f6b5b4',
                },
                {
                    rsa_pubkey: {
                        e: 65537,
                        n: '0xb96f3a23b4dc3e5bbddde8e9f6bc5ad6e309f24efd5c1e3f763108121995ff847e52db6dcf310fb0360f9d9cafea6a034ad38bbaa4bdecd599b0d8d5196c496cbe212dc31fc94f62b50aa56140b1cad9a37715a3b117773fe7652e582b78facc700d21057d99b60a8809b5694448bbbe16398baa8dfcc6977fdf4c17e046182ef3e9ea94326ced855f8181fa582815fdc563b40f987459fe30fa5b35b6954a1d7c33c0925fe9f092ebf41460b17b57c46a1dd841da5fa54c7471f53579e7cb7e7c2b69255ebe0b2da8a335f0e85b508fd5e2b5ca568128a7fa815a111dbf8d75ba640a502684833da1093481a980b2eb3e005b7952382dbbba4190010d909715',
                    },
                },
            ],
            nonce: '0x2',
            quick_login: false,
            recovery_email: null,
            register_email: '0xea196b650027e538de43667b4b312746f35145f00afed5bef9a6368c2c309988',
            username: '0x2a1eb676171606ea0c6ffad366ddee63cd2c2c8fa2ac99da0334862f4290c140',
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
    console.log(formateData, userInfoRawData);
    t.is(formateData[0].registerEmail, userInfoRawData.result[0].register_email);
});
// test('test rawTransaction stringRawData ', async (t) => {
//   const data = new RawTransaction(stringRawData);
//   const formateData = data.transform();
//   console.log(formateData);
//   t.is(formateData, stringRawData.result);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LXRyYW5zYWN0aW9uLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmF3LXRyYW5zYWN0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFFdkIsdURBQW1EO0FBRW5ELE1BQU0sU0FBUyxHQUFHO0lBQ2hCLEVBQUUsRUFBRSxDQUFDO0lBQ0wsT0FBTyxFQUFFLEtBQUs7SUFDZCxNQUFNLEVBQUU7UUFDTixpQkFBaUIsRUFBRTtZQUNqQixLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsZ0JBQWdCO2dCQUNoQyxNQUFNLEVBQUUsOENBQThDO2dCQUN0RCxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRjtRQUNELFNBQVMsRUFBRTtZQUNULFdBQVcsRUFDVCxvRUFBb0U7WUFDdEUsTUFBTSxFQUFFLFNBQVM7U0FDbEI7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLHNCQUFzQixHQUFHO0lBQzdCLEVBQUUsRUFBRSxDQUFDO0lBQ0wsT0FBTyxFQUFFLEtBQUs7SUFDZCxNQUFNLEVBQUU7UUFDTjtZQUNFLGlCQUFpQixFQUFFO2dCQUNqQixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsTUFBTSxFQUFFO29CQUNOLGNBQWMsRUFBRSxnQkFBZ0I7b0JBQ2hDLE1BQU0sRUFBRSw4Q0FBOEM7b0JBQ3RELGNBQWMsRUFBRSxJQUFJO29CQUNwQixXQUFXLEVBQUUsSUFBSTtpQkFDbEI7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxXQUFXLEVBQ1Qsb0VBQW9FO2dCQUN0RSxNQUFNLEVBQUUsU0FBUzthQUNsQjtTQUNGO1FBQ0Q7WUFDRSxpQkFBaUIsRUFBRTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLE1BQU0sRUFBRTtvQkFDTixjQUFjLEVBQUUsZ0JBQWdCO29CQUNoQyxNQUFNLEVBQUUsOENBQThDO29CQUN0RCxjQUFjLEVBQUUsSUFBSTtvQkFDcEIsV0FBVyxFQUFFLElBQUk7aUJBQ2xCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsV0FBVyxFQUNULG9FQUFvRTtnQkFDdEUsTUFBTSxFQUFFLFNBQVM7YUFDbEI7U0FDRjtLQUNGO0NBQ0YsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFO1FBQ047WUFDRSxhQUFhLEVBQUUsV0FBVztZQUMxQixVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsU0FBUyxFQUFFLDRDQUE0QztpQkFDeEQ7Z0JBQ0Q7b0JBQ0UsVUFBVSxFQUFFO3dCQUNWLENBQUMsRUFBRSxLQUFLO3dCQUNSLENBQUMsRUFBRSxvZ0JBQW9nQjtxQkFDeGdCO2lCQUNGO2FBQ0Y7WUFDRCxLQUFLLEVBQUUsS0FBSztZQUNaLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGNBQWMsRUFDWixvRUFBb0U7WUFDdEUsUUFBUSxFQUNOLG9FQUFvRTtTQUN2RTtLQUNGO0lBQ0QsRUFBRSxFQUFFLE9BQU87Q0FDWixDQUFDO0FBTUYsTUFBTSxhQUFhLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBRWxFLDBEQUEwRDtBQUMxRCxnREFBZ0Q7QUFDaEQsK0RBQStEO0FBQy9ELDhCQUE4QjtBQUM5QixrRkFBa0Y7QUFDbEYsTUFBTTtBQUVOLCtEQUErRDtBQUMvRCw2REFBNkQ7QUFDN0QsaUVBQWlFO0FBQ2pFLDhCQUE4QjtBQUM5QixVQUFVO0FBQ1YseUNBQXlDO0FBQ3pDLDZEQUE2RDtBQUM3RCxPQUFPO0FBQ1AsTUFBTTtBQUVOLGFBQUksQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkQsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQXNCLENBQUM7SUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFMUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDL0UsQ0FBQyxDQUFDLENBQUM7QUFFSCw0REFBNEQ7QUFDNUQsb0RBQW9EO0FBQ3BELDBDQUEwQztBQUMxQyw4QkFBOEI7QUFDOUIsNkNBQTZDO0FBQzdDLE1BQU0ifQ==