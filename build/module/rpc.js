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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxhQUFhLENBQUM7QUFDaEMsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBZ0IsY0FBYyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBT2pELFNBQVMsWUFBWSxDQUFDLGVBQWdDLEVBQUUsY0FBbUI7SUFDekUsY0FBYyxHQUFHLGNBQWMsSUFBSSxFQUFFLENBQUM7SUFDdEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDM0IsRUFBRSxFQUNGLGNBQWMsQ0FBQyxPQUFPLElBQUksRUFBRSxFQUM1QixlQUFlLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FDOUIsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRTtRQUN4RCxPQUFPLEVBQUUsT0FBTztLQUNqQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxPQUFPLEdBQUc7SUFDZCxHQUFHLEVBQUUsQ0FBQyxNQUFXLEVBQUUsTUFBYyxFQUFPLEVBQUU7UUFDeEMsT0FBTyxLQUFLLEVBQUUsR0FBRyxNQUFXLEVBQUUsRUFBRTtZQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUN4QixPQUFPLEVBQUUsS0FBSztnQkFDZCxFQUFFLEVBQUUsRUFBRTtnQkFDTixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsTUFBTTthQUNmLENBQUMsQ0FBQztZQUNILElBQUksTUFBTSxLQUFLLHFCQUFxQixFQUFFO2dCQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDcEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsRUFBRSxFQUFFLEVBQUU7b0JBQ04sTUFBTSxFQUFFLE1BQU07b0JBQ2QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ2xCLENBQUMsQ0FBQzthQUNKO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FDMUIsTUFBTSxDQUFDLEdBQUcsRUFDVixZQUFZLENBQ1Y7Z0JBQ0UsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFO29CQUNQLGNBQWMsRUFBRSxrQkFBa0I7aUJBQ25DO2dCQUNELElBQUk7YUFDTCxFQUNELE1BQU0sQ0FBQyxjQUFjLENBQ3RCLENBQ0YsQ0FBQztZQUVGLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRW5DLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQzthQUN6RTtZQUNELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUNiLDhCQUE4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUMzRCxDQUFDO2FBQ0g7WUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFvQixDQUFDO1lBQ2pDLE9BQU8sSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBRztJQUNkLFlBQTZCLEdBQVcsRUFBbUIsVUFBVSxFQUFFO1FBQTFDLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUNyRSxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBRUY7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsU0FBUztJQUN6QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxNQUFNO0lBQ3RDLE9BQU8sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDcEMsQ0FBQyJ9