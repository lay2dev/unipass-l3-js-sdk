import fetch from 'cross-fetch';
import JSBI from 'jsbi';
import { RawTransaction } from '.';
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
            const response = await fetch(target.uri, mergeOptions({
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
            return new RawTransaction(ret);
        };
    },
};
export class RPC {
    constructor(uri, options = {}) {
        this.uri = uri;
        this.options = options;
        return new Proxy(this, handler);
    }
}
export function HexStringToBigInt(hexString) {
    return JSBI.BigInt(hexString);
}
export function BigIntToHexString(bigInt) {
    return '0x' + bigInt.toString(16);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxhQUFhLENBQUM7QUFDaEMsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBZ0IsY0FBYyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBT2pELFNBQVMsWUFBWSxDQUFDLGVBQWdDLEVBQUUsY0FBbUI7SUFDekUsY0FBYyxHQUFHLGNBQWMsSUFBSSxFQUFFLENBQUM7SUFDdEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDM0IsRUFBRSxFQUNGLGNBQWMsQ0FBQyxPQUFPLElBQUksRUFBRSxFQUM1QixlQUFlLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FDOUIsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRTtRQUN4RCxPQUFPLEVBQUUsT0FBTztLQUNqQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxPQUFPLEdBQUc7SUFDZCxHQUFHLEVBQUUsQ0FBQyxNQUFXLEVBQUUsTUFBYyxFQUFPLEVBQUU7UUFDeEMsT0FBTyxLQUFLLEVBQUUsR0FBRyxNQUFXLEVBQUUsRUFBRTtZQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNoRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUMxQixPQUFPLEVBQUUsS0FBSztnQkFDZCxFQUFFLEVBQUUsRUFBRTtnQkFDTixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsTUFBTTthQUNmLENBQUMsQ0FBQztZQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUMxQixNQUFNLENBQUMsR0FBRyxFQUNWLFlBQVksQ0FDVjtnQkFDRSxNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUU7b0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjtpQkFDbkM7Z0JBQ0QsSUFBSTthQUNMLEVBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FDdEIsQ0FDRixDQUFDO1lBRUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbkMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQ2IsOEJBQThCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQzNELENBQUM7YUFDSDtZQUNELE1BQU0sR0FBRyxHQUFHLElBQW9CLENBQUM7WUFDakMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHO0lBQ2QsWUFBNkIsR0FBVyxFQUFtQixVQUFVLEVBQUU7UUFBMUMsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQ3JFLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FFRjtBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxTQUFTO0lBQ3pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLE1BQU07SUFDdEMsT0FBTyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQyxDQUFDIn0=