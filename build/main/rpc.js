"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntToHexString = exports.HexStringToBigInt = exports.RPC = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const jsbi_1 = __importDefault(require("jsbi"));
const _1 = require(".");
function mergeOptions(overrideOptions, defaultOptions) {
    defaultOptions = defaultOptions || {};
    const headers = Object.assign({}, defaultOptions.headers || {}, overrideOptions.headers || {});
    return Object.assign({}, defaultOptions, overrideOptions, {
        headers: headers,
    });
}
const handler = {
    get: (target, method) => {
        return async (...params) => {
            const id = Math.round(Math.random() * 10000000);
            const body = JSON.stringify({
                jsonrpc: '2.0',
                id: id,
                method: method,
                params: params,
            });
            const response = await cross_fetch_1.default(target.uri, mergeOptions({
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            }, target.defaultOptions));
            const data = await response.json();
            if (data.id !== id) {
                throw new Error('JSONRPCError: response ID does not match request ID!');
            }
            if (data.error) {
                throw new Error(`JSONRPCError: server error ${JSON.stringify(data.error)}`);
            }
            const ret = data;
            return new _1.RawTransaction(ret);
        };
    },
};
class RPC {
    constructor(uri, options = {}) {
        this.uri = uri;
        this.options = options;
        return new Proxy(this, handler);
    }
}
exports.RPC = RPC;
function HexStringToBigInt(hexString) {
    return jsbi_1.default.BigInt(hexString);
}
exports.HexStringToBigInt = HexStringToBigInt;
function BigIntToHexString(bigInt) {
    return '0x' + bigInt.toString(16);
}
exports.BigIntToHexString = BigIntToHexString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4REFBZ0M7QUFDaEMsZ0RBQXdCO0FBQ3hCLHdCQUFpRDtBQU9qRCxTQUFTLFlBQVksQ0FBQyxlQUFnQyxFQUFFLGNBQW1CO0lBQ3pFLGNBQWMsR0FBRyxjQUFjLElBQUksRUFBRSxDQUFDO0lBQ3RDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQzNCLEVBQUUsRUFDRixjQUFjLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFDNUIsZUFBZSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQzlCLENBQUM7SUFDRixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUU7UUFDeEQsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sT0FBTyxHQUFHO0lBQ2QsR0FBRyxFQUFFLENBQUMsTUFBVyxFQUFFLE1BQWMsRUFBTyxFQUFFO1FBQ3hDLE9BQU8sS0FBSyxFQUFFLEdBQUcsTUFBVyxFQUFFLEVBQUU7WUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDMUIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsRUFBRSxFQUFFLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7WUFFSCxNQUFNLFFBQVEsR0FBRyxNQUFNLHFCQUFLLENBQzFCLE1BQU0sQ0FBQyxHQUFHLEVBQ1YsWUFBWSxDQUNWO2dCQUNFLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE9BQU8sRUFBRTtvQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2lCQUNuQztnQkFDRCxJQUFJO2FBQ0wsRUFDRCxNQUFNLENBQUMsY0FBYyxDQUN0QixDQUNGLENBQUM7WUFFRixNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVuQyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7YUFDekU7WUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDYiw4QkFBOEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDM0QsQ0FBQzthQUNIO1lBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBb0IsQ0FBQztZQUNqQyxPQUFPLElBQUksaUJBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLE1BQWEsR0FBRztJQUNkLFlBQTZCLEdBQVcsRUFBbUIsVUFBVSxFQUFFO1FBQTFDLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUNyRSxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBRUY7QUFMRCxrQkFLQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLFNBQVM7SUFDekMsT0FBTyxjQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFGRCw4Q0FFQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLE1BQU07SUFDdEMsT0FBTyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRkQsOENBRUMifQ==