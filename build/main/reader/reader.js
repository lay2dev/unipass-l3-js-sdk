"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = exports.HexStringReader = exports.ArrayBufferReader = void 0;
class ArrayBufferReader {
    constructor(buffer) {
        this.view = new DataView(buffer);
    }
    length() {
        return this.view.byteLength;
    }
    indexAt(i) {
        return this.view.getUint8(i);
    }
    toArrayBuffer() {
        return this.view.buffer;
    }
    serializeJson() {
        return ('0x' +
            Array.prototype.map
                .call(new Uint8Array(this.view.buffer), (x) => ('00' + x.toString(16)).slice(-2))
                .join(''));
    }
}
exports.ArrayBufferReader = ArrayBufferReader;
class HexStringReader {
    constructor(string) {
        this.string = string;
    }
    length() {
        return this.string.length / 2 - 1;
    }
    indexAt(i) {
        return parseInt(this.string.substr(2 + i * 2, 2), 16);
    }
    toArrayBuffer() {
        const buffer = new ArrayBuffer(this.length());
        const view = new DataView(buffer);
        for (let i = 0; i < this.length(); i++) {
            view.setUint8(i, this.indexAt(i));
        }
        return buffer;
    }
    serializeJson() {
        return this.string;
    }
}
exports.HexStringReader = HexStringReader;
class Reader {
    constructor(input) {
        if (input instanceof HexStringReader ||
            input instanceof ArrayBufferReader) {
            return input;
        }
        if (typeof input === 'string') {
            if (!input.startsWith('0x') || input.length % 2 != 0) {
                throw new Error('Hex string must start with 0x, and has even numbered length!');
            }
            return new HexStringReader(input);
        }
        if (input instanceof ArrayBuffer) {
            return new ArrayBufferReader(input);
        }
        throw new Error('Reader can only accept hex string or ArrayBuffer!');
    }
    static fromRawString(string) {
        const buffer = new ArrayBuffer(string.length);
        const view = new DataView(buffer);
        for (let i = 0; i < string.length; i++) {
            const c = string.charCodeAt(i);
            if (c > 0xff) {
                throw new Error('fromRawString can only accept UTF-8 raw string!');
            }
            view.setUint8(i, c);
        }
        return new ArrayBufferReader(buffer);
    }
}
exports.Reader = Reader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlYWRlci9yZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxpQkFBaUI7SUFDNUIsWUFBWSxNQUFNO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBQztRQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTyxDQUNMLElBQUk7WUFDSixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUc7aUJBQ2hCLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDNUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNsQztpQkFDQSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ1osQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTNCRCw4Q0EyQkM7QUFFRCxNQUFhLGVBQWU7SUFDMUIsWUFBWSxNQUFNO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBQztRQUNQLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxhQUFhO1FBQ1gsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0NBQ0Y7QUExQkQsMENBMEJDO0FBRUQsTUFBYSxNQUFNO0lBQ2pCLFlBQVksS0FBSztRQUNmLElBQ0UsS0FBSyxZQUFZLGVBQWU7WUFDaEMsS0FBSyxZQUFZLGlCQUFpQixFQUNsQztZQUNBLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BELE1BQU0sSUFBSSxLQUFLLENBQ2IsOERBQThELENBQy9ELENBQUM7YUFDSDtZQUNELE9BQU8sSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkM7UUFDRCxJQUFJLEtBQUssWUFBWSxXQUFXLEVBQUU7WUFDaEMsT0FBTyxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU07UUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQzthQUNwRTtZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjtBQW5DRCx3QkFtQ0MifQ==