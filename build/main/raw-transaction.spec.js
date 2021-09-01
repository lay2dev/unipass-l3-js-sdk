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
const historyTxRawData = {
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
    id: 2,
    jsonrpc: '2.0',
    result: {
        register_email: 'johnz@lay2.dev',
        quick_login: false,
        local_keys: [
            '01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
            '02f376bdc2590c720d0d0c32cbebf9bb4c7cddc09b880c4a85ad86f625ff614bf3cf50c16a18f0a954c14104c729698a976246d6403010b107d9c02f4b4711f577',
            '03000800000100010027235838be9d2044c72aabcfeab3ca368ea10988d700b49e7aef7810fce9a83742ec43e5e7b935ac08e4bbb8b72056722a6fff64d59eb6ac31813d827df4807f64c9c5179eba3624286aa3cdfb2da75ef644c1f88589567bc7f0ba84841be9d847c46c48861be9b478dd79c5a8465e85bc8ce817bfd3e6e3cc65e68d12858a0ff3abe7b4833ccdd5c2f0f4bb086d3042c9ef69ace4afd41f427f16377ac31c25c207916457394a9242499576b7f62502f203783edc1e7ad071a0012f1e880a74c9c6c44b3b46abbeb7979029d0effab8b92575e6385caec73df68ee8c0d9887636183d338193ee93981f93651b13ec763482ea62ada18833f8e0e887157815c3',
        ],
        recovery_email: {
            threshold: 1,
            first_n: 1,
            emails: ['johnz@lay2.dev'],
        },
        pending_state: {
            pending_key: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
            replace_old: false,
            time_cell: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        },
    },
};
const stringRawData = { jsonrpc: '2.0', result: '0x2cb4', id: 2 };
ava_1.default('test rawTransaction tx txRawData', async (t) => {
    const data = new raw_transaction_1.RawTransaction(txRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData.txStatus.ckbTxHash, txRawData.result.tx_status.ckb_tx_hash);
});
ava_1.default('test rawTransaction historyTxRawData ', async (t) => {
    const data = new raw_transaction_1.RawTransaction(historyTxRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData[0].txStatus.ckbTxHash, historyTxRawData.result[0].tx_status.ckb_tx_hash);
});
ava_1.default('test rawTransaction userInfoRawData ', async (t) => {
    const data = new raw_transaction_1.RawTransaction(userInfoRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData.registerEmail, userInfoRawData.result.register_email);
});
ava_1.default('test rawTransaction stringRawData ', async (t) => {
    const data = new raw_transaction_1.RawTransaction(stringRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData, stringRawData.result);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LXRyYW5zYWN0aW9uLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmF3LXRyYW5zYWN0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFFdkIsdURBQW1EO0FBRW5ELE1BQU0sU0FBUyxHQUFHO0lBQ2hCLEVBQUUsRUFBRSxDQUFDO0lBQ0wsT0FBTyxFQUFFLEtBQUs7SUFDZCxNQUFNLEVBQUU7UUFDTixpQkFBaUIsRUFBRTtZQUNqQixLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsZ0JBQWdCO2dCQUNoQyxNQUFNLEVBQUUsOENBQThDO2dCQUN0RCxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRjtRQUNELFNBQVMsRUFBRTtZQUNULFdBQVcsRUFDVCxvRUFBb0U7WUFDdEUsTUFBTSxFQUFFLFNBQVM7U0FDbEI7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLEVBQUUsRUFBRSxDQUFDO0lBQ0wsT0FBTyxFQUFFLEtBQUs7SUFDZCxNQUFNLEVBQUU7UUFDTjtZQUNFLGlCQUFpQixFQUFFO2dCQUNqQixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsTUFBTSxFQUFFO29CQUNOLGNBQWMsRUFBRSxnQkFBZ0I7b0JBQ2hDLE1BQU0sRUFBRSw4Q0FBOEM7b0JBQ3RELGNBQWMsRUFBRSxJQUFJO29CQUNwQixXQUFXLEVBQUUsSUFBSTtpQkFDbEI7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxXQUFXLEVBQ1Qsb0VBQW9FO2dCQUN0RSxNQUFNLEVBQUUsU0FBUzthQUNsQjtTQUNGO1FBQ0Q7WUFDRSxpQkFBaUIsRUFBRTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFLFVBQVU7Z0JBQ2hC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