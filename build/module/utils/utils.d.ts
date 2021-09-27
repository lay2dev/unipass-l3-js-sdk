/// <reference types="node" />
import JSBI from 'jsbi';
import { FormatOptions } from '../interface';
export declare const rationalNumberToBnString: (rational: string, decimals: number) => string;
export declare function hexToByteArray(h: string): any[];
export declare function byteArrayToHex(a: any): string;
export declare function toBigUInt64LE(num: any): string;
export declare const toArrayBuffer: (buf: Buffer) => ArrayBuffer;
export declare function toBigUInt128LE(u128: any): string;
export declare function readBigUInt32LE(hex: any): JSBI;
export declare function readBigUInt64LE(hex: any): JSBI;
export declare function readBigUInt128LE(hex: any): JSBI;
export declare const bnStringToRationalNumber: (bn: string, decimals: number, options: FormatOptions) => string;
export declare function hashData(data: string): string;
export declare function sha256HashData(data: string): string;
declare global {
    interface String {
        hexToBuffer(): Buffer;
    }
}
