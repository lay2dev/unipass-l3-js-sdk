"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
const uri = 'https://testnet.ckb.dev';
const rpc = new _1.RPC(uri);
const raw = {
    inner: {
        nonce: '0x1',
        type: 'register',
        action: {
            register_email: 'johnz@lay2.dev',
            pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
            recovery_email: null,
            quick_login: true,
        },
    },
    sig: '...email boy...',
};
ava_1.default('test aggregator rpc get_user_info', async (t) => {
    const data = await rpc.get_user_info('johnz', 'johnz@lay2.dev');
    t.is(true, true);
});
ava_1.default('test aggregator rpc get_up_transaction_by_hash', async (t) => {
    const data = await rpc.get_up_transaction_by_hash('0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8');
    t.is(true, true);
});
ava_1.default('test aggregator rpc get_up_nonce', async (t) => {
    const data = await rpc.get_up_nonce('johnz');
    t.is(true, true);
});
ava_1.default('test aggregator rpc get_up_transaction_history', async (t) => {
    const data = await rpc.get_up_transaction_history('johnz');
    t.is(true, true);
});
ava_1.default('test  rpc send_up_transaction', async (t) => {
    const data = await rpc.send_up_transaction(raw);
    t.is(true, true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnBjLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFDdkIsd0JBQXdCO0FBRXhCLE1BQU0sR0FBRyxHQUFHLHlCQUF5QixDQUFDO0FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXpCLE1BQU0sR0FBRyxHQUFHO0lBQ1YsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLEtBQUs7UUFDWixJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUU7WUFDTixjQUFjLEVBQUUsZ0JBQWdCO1lBQ2hDLE1BQU0sRUFBRSw4Q0FBOEM7WUFDdEQsY0FBYyxFQUFFLElBQUk7WUFDcEIsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRjtJQUNELEdBQUcsRUFBRSxpQkFBaUI7Q0FDdkIsQ0FBQztBQUVGLGFBQUksQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDcEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLGdEQUFnRCxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqRSxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQywwQkFBMEIsQ0FDL0Msb0VBQW9FLENBQ3JFLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLGdEQUFnRCxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqRSxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQywrQkFBK0IsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUMifQ==