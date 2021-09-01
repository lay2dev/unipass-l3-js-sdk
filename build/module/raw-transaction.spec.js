import test from 'ava';
import { RawTransaction } from './raw-transaction';
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
test('test rawTransaction tx txRawData', async (t) => {
    const data = new RawTransaction(txRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData.txStatus.ckbTxHash, txRawData.result.tx_status.ckb_tx_hash);
});
test('test rawTransaction historyTxRawData ', async (t) => {
    const data = new RawTransaction(historyTxRawStringData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData[0].txStatus.ckbTxHash, historyTxRawStringData.result[0].tx_status.ckb_tx_hash);
});
test('test rawTransaction userInfoRawData ', async (t) => {
    const data = new RawTransaction(userInfoRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData.registerEmail, userInfoRawData.result.register_email);
});
test('test rawTransaction stringRawData ', async (t) => {
    const data = new RawTransaction(stringRawData);
    const formateData = data.transform();
    console.log(formateData);
    t.is(formateData, stringRawData.result);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LXRyYW5zYWN0aW9uLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmF3LXRyYW5zYWN0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBRXZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRCxNQUFNLFNBQVMsR0FBRztJQUNoQixFQUFFLEVBQUUsQ0FBQztJQUNMLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFO1FBQ04saUJBQWlCLEVBQUU7WUFDakIsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLGdCQUFnQjtnQkFDaEMsTUFBTSxFQUFFLDhDQUE4QztnQkFDdEQsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCO1NBQ0Y7UUFDRCxTQUFTLEVBQUU7WUFDVCxXQUFXLEVBQ1Qsb0VBQW9FO1lBQ3RFLE1BQU0sRUFBRSxTQUFTO1NBQ2xCO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsTUFBTSxzQkFBc0IsR0FBRztJQUM3QixFQUFFLEVBQUUsQ0FBQztJQUNMLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFO1FBQ047WUFDRSxpQkFBaUIsRUFBRTtnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLE1BQU0sRUFBRTtvQkFDTixjQUFjLEVBQUUsZ0JBQWdCO29CQUNoQyxNQUFNLEVBQUUsOENBQThDO29CQUN0RCxjQUFjLEVBQUUsSUFBSTtvQkFDcEIsV0FBVyxFQUFFLElBQUk7aUJBQ2xCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsV0FBVyxFQUNULG9FQUFvRTtnQkFDdEUsTUFBTSxFQUFFLFNBQVM7YUFDbEI7U0FDRjtRQUNEO1lBQ0UsaUJBQWlCLEVBQUU7Z0JBQ2pCLEtBQUssRUFBRSxLQUFLO2dCQUNaLElBQUksRUFBRSxVQUFVO2dCQUNoQixNQUFNLEVBQUU7b0JBQ04sY0FBYyxFQUFFLGdCQUFnQjtvQkFDaEMsTUFBTSxFQUFFLDhDQUE4QztvQkFDdEQsY0FBYyxFQUFFLElBQUk7b0JBQ3BCLFdBQVcsRUFBRSxJQUFJO2lCQUNsQjthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFdBQVcsRUFDVCxvRUFBb0U7Z0JBQ3RFLE1BQU0sRUFBRSxTQUFTO2FBQ2xCO1NBQ0Y7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLGVBQWUsR0FBRztJQUN0QixFQUFFLEVBQUUsQ0FBQztJQUNMLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFO1FBQ04sY0FBYyxFQUFFLGdCQUFnQjtRQUNoQyxXQUFXLEVBQUUsS0FBSztRQUNsQixVQUFVLEVBQUU7WUFDViw0Q0FBNEM7WUFDNUMsb0lBQW9JO1lBQ3BJLG9oQkFBb2hCO1NBQ3JoQjtRQUNELGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRSxDQUFDO1lBQ1osT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztTQUMzQjtRQUNELGFBQWEsRUFBRTtZQUNiLFdBQVcsRUFBRSw4Q0FBOEM7WUFDM0QsV0FBVyxFQUFFLEtBQUs7WUFDbEIsU0FBUyxFQUNQLG9FQUFvRTtTQUN2RTtLQUNGO0NBQ0YsQ0FBQztBQU1GLE1BQU0sYUFBYSxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUVsRSxJQUFJLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ25ELE1BQU0sSUFBSSxHQUFHLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQXVCLENBQUM7SUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQXlCLENBQUM7SUFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsRUFBRSxDQUNGLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUNqQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FDdkQsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2RCxNQUFNLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFvQixDQUFDO0lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUMsQ0FBQyJ9