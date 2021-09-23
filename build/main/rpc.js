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
            let body = JSON.stringify({
                jsonrpc: '2.0',
                id: id,
                method: method,
                params: params,
            });
            if (method === 'send_up_transaction') {
                body = JSON.stringify({
                    jsonrpc: '2.0',
                    id: id,
                    method: method,
                    params: params[0],
                });
            }
            console.log(body);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4REFBZ0M7QUFDaEMsZ0RBQXdCO0FBQ3hCLHdCQUFpRDtBQU9qRCxTQUFTLFlBQVksQ0FBQyxlQUFnQyxFQUFFLGNBQW1CO0lBQ3pFLGNBQWMsR0FBRyxjQUFjLElBQUksRUFBRSxDQUFDO0lBQ3RDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQzNCLEVBQUUsRUFDRixjQUFjLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFDNUIsZUFBZSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQzlCLENBQUM7SUFDRixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUU7UUFDeEQsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sT0FBTyxHQUFHO0lBQ2QsR0FBRyxFQUFFLENBQUMsTUFBVyxFQUFFLE1BQWMsRUFBTyxFQUFFO1FBQ3hDLE9BQU8sS0FBSyxFQUFFLEdBQUcsTUFBVyxFQUFFLEVBQUU7WUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDeEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsRUFBRSxFQUFFLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7WUFDSCxJQUFJLE1BQU0sS0FBSyxxQkFBcUIsRUFBRTtnQkFDcEMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ3BCLE9BQU8sRUFBRSxLQUFLO29CQUNkLEVBQUUsRUFBRSxFQUFFO29CQUNOLE1BQU0sRUFBRSxNQUFNO29CQUNkLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNsQixDQUFDLENBQUM7YUFDSjtZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxxQkFBSyxDQUMxQixNQUFNLENBQUMsR0FBRyxFQUNWLFlBQVksQ0FDVjtnQkFDRSxNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUU7b0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjtpQkFDbkM7Z0JBQ0QsSUFBSTthQUNMLEVBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FDdEIsQ0FDRixDQUFDO1lBRUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbkMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQ2IsOEJBQThCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQzNELENBQUM7YUFDSDtZQUNELE1BQU0sR0FBRyxHQUFHLElBQW9CLENBQUM7WUFDakMsT0FBTyxJQUFJLGlCQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFRixNQUFhLEdBQUc7SUFDZCxZQUE2QixHQUFXLEVBQW1CLFVBQVUsRUFBRTtRQUExQyxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFDckUsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUVGO0FBTEQsa0JBS0M7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxTQUFTO0lBQ3pDLE9BQU8sY0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsOENBRUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFNO0lBQ3RDLE9BQU8sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUZELDhDQUVDIn0=