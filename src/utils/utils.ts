import Decimal from 'decimal.js';
import JSBI from 'jsbi';
import { createHash } from 'crypto';
import { FormatOptions } from '../interface';
export const rationalNumberToBnString = (
  rational: string,
  decimals: number
) => {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("value of 'decimals' must be a natural integer");
  }
  if (decimals === 0) return rational;

  if (rational === '0x') rational = '0';

  if (typeof rational === 'number') {
    const dp = new Decimal(rational).dp();
    rational = Number(rational).toFixed(dp);
  }

  const parts = `${rational}`.split('.');

  if (!!parts[1] && parts[1].length > decimals) {
    throw new Error(
      `decimals ${decimals} is smaller than the digits number of ${rational}`
    );
  }

  return `${parts.join('')}${'0'.repeat(
    decimals - (!!parts[1] ? parts[1].length : 0)
  )}`;
};

export function hexToByteArray(h: string) {
  if (!/^(0x)?([0-9a-fA-F][0-9a-fA-F])*$/.test(h)) {
    throw new Error('Invalid hex string!');
  }
  if (h.startsWith('0x')) {
    h = h.slice(2);
  }
  const array = [];
  while (h.length >= 2) {
    array.push(parseInt(h.slice(0, 2), 16));
    h = h.slice(2);
  }
  return array;
}
export function byteArrayToHex(a) {
  return '0x' + a.map((i) => ('00' + i.toString(16)).slice(-2)).join('');
}

export function toBigUInt64LE(num) {
  const hexNumber = JSBI.BigInt(num)
    .toString(16)
    .slice(0, 16)
    .padStart(16, '0');
  const buffer = hexToByteArray(`0x${hexNumber}`).reverse();
  return byteArrayToHex(buffer);
}

export function toBigUInt128LE(u128) {
  const viewRight = toBigUInt64LE(
    JSBI.signedRightShift(JSBI.BigInt(u128), JSBI.BigInt(64))
  );
  const viewLeft = toBigUInt64LE(
    JSBI.bitwiseAnd(JSBI.BigInt(u128), JSBI.BigInt('0xffffffffffffffff'))
  );

  return `${viewLeft}${viewRight.slice(2)}`;
}

export function readBigUInt32LE(hex) {
  if (hex.slice(0, 2) !== '0x') {
    throw new Error('hex must start with 0x');
  }
  const dv = new DataView(new ArrayBuffer(4));
  dv.setUint32(0, Number(hex.slice(0, 10)), true);
  return JSBI.BigInt(dv.getUint32(0, false));
  // return BigInt(dv.getUint32(0, false));
}

export function readBigUInt64LE(hex) {
  if (hex.slice(0, 2) !== '0x') {
    throw new Error('hex must start with 0x');
  }
  const buf = hex.slice(2).padEnd(16, 0);

  const viewRight = `0x${buf.slice(0, 8)}`;
  const viewLeft = `0x${buf.slice(8, 16)}`;

  const numLeft = readBigUInt32LE(viewLeft).toString(16).padStart(8, '0');
  const numRight = readBigUInt32LE(viewRight).toString(16).padStart(8, '0');

  return JSBI.BigInt(`0x${numLeft}${numRight}`);
}

export function readBigUInt128LE(hex) {
  if (hex.slice(0, 2) !== '0x') {
    throw new Error('hex must start with 0x');
  }
  const buf = hex.slice(2).padEnd(32, 0);

  const viewRight = `0x${buf.slice(0, 16)}`;
  const viewLeft = `0x${buf.slice(16, 32)}`;

  const numLeft = readBigUInt64LE(viewLeft).toString(16).padStart(16, '0');
  const numRight = readBigUInt64LE(viewRight).toString(16).padStart(16, '0');

  return JSBI.BigInt(`0x${numLeft}${numRight}`);
}

export const bnStringToRationalNumber = (
  bn: string,
  decimals: number,
  options: FormatOptions
) => {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("value of 'decimals' must be a natural integer");
  }

  const n = new Decimal(bn);
  if (n.isNeg()) {
    bn = bn.slice(1);
  }

  let int = bn;
  let dec = '';
  if (decimals > 0) {
    const intLen = bn.length - decimals;
    int = intLen > 0 ? bn.substr(0, intLen) : '0';
    dec = intLen > 0 ? bn.slice(intLen) : `${'0'.repeat(-intLen)}${bn}`;
    dec = new Decimal(`0.${dec}`).toFixed().slice(2);
  }

  if (options) {
    if (options.fixed !== undefined) {
      if (
        !Number.isInteger(options.fixed) ||
        options.fixed < 1
        // || options.fixed > decimals
      ) {
        throw new Error(
          // `value of \'fixed\' must be a positive integer and not bigger than decimals value ${decimals}`
          `value of 'fixed' must be a positive integer`
        );
      }
      const res = new Decimal(`0.${dec}`).toFixed(options.fixed).split('.');
      dec = res[1];
      if (res[0] === '1') {
        int = JSBI.add(JSBI.BigInt(int), JSBI.BigInt(1)).toString();
      }
    } else if (options.pad && dec.length < decimals) {
      dec = `${dec}${'0'.repeat(decimals - dec.length)}`;
    }
    if (options.commify) {
      int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (options.section === 'decimal') {
      return dec;
    }
    if (options.section === 'integer') {
      return n.isNeg() ? `-${int}` : int;
    }
  }

  if (n.isNeg()) {
    int = `-${int}`;
  }

  if (dec.length) return `${int}.${dec}`;
  return int;
};

export function hashData(data: string) {
  const messageHash = createHash('SHA256')
    .update(data)
    .digest('hex')
    .toString();

  return `0x${messageHash}`;
}
