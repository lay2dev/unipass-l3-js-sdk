import fetch from 'cross-fetch';
import JSBI from 'jsbi';
import { ResponseInfo, RawTransaction } from '.';
interface OverrideOptions {
  method: string;
  headers: any;
  body: string;
}

function mergeOptions(overrideOptions: OverrideOptions, defaultOptions: any) {
  defaultOptions = defaultOptions || {};
  const headers = Object.assign(
    {},
    defaultOptions.headers || {},
    overrideOptions.headers || {}
  );
  return Object.assign({}, defaultOptions, overrideOptions, {
    headers: headers,
  });
}

const handler = {
  get: (target: any, method: string): any => {
    return async (...params: any) => {
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

      const response = await fetch(
        target.uri,
        mergeOptions(
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          },
          target.defaultOptions
        )
      );

      const data = await response.json();

      if (data.id !== id) {
        throw new Error('JSONRPCError: response ID does not match request ID!');
      }
      if (data.error) {
        throw new Error(
          `JSONRPCError: server error ${JSON.stringify(data.error)}`
        );
      }
      const ret = data as ResponseInfo;
      return new RawTransaction(ret);
    };
  },
};

export class RPC {
  constructor(private readonly uri: string, private readonly options = {}) {
    return new Proxy(this, handler);
  }
  [method: string]: any;
}

export function HexStringToBigInt(hexString) {
  return JSBI.BigInt(hexString);
}

export function BigIntToHexString(bigInt) {
  return '0x' + bigInt.toString(16);
}
