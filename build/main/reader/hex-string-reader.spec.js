"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
const rawData = {
    typeId: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    from: 'ckt1qsfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47dusc6l0nlyv80d3dn78qtd8e4kryxgtj5e7mdh6',
    nonce: '0x1',
    fee: '0x123',
    totalAmount: '0x123',
    targets: [
        {
            to: 'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8uhpvn6k55mdan84t4z7cm7dtuv3ux6cwaff3xa',
            amount: '100',
        },
    ],
};
ava_1.default('test core data-=-----', async (t) => {
    const data = new _1.HexStringReader(rawData.nonce);
    console.log('data------', data.toArrayBuffer(32));
    t.is(true, false);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LXN0cmluZy1yZWFkZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFkZXIvaGV4LXN0cmluZy1yZWFkZXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUF1QjtBQUN2Qix3QkFBb0M7QUFFcEMsTUFBTSxPQUFPLEdBQUc7SUFDZCxNQUFNLEVBQUUsb0VBQW9FO0lBQzVFLElBQUksRUFBRSxpR0FBaUc7SUFDdkcsS0FBSyxFQUFFLEtBQUs7SUFDWixHQUFHLEVBQUUsT0FBTztJQUNaLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLE9BQU8sRUFBRTtRQUNQO1lBQ0UsRUFBRSxFQUFFLGlHQUFpRztZQUNyRyxNQUFNLEVBQUUsS0FBSztTQUNkO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsYUFBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLGtCQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwQixDQUFDLENBQUMsQ0FBQyJ9