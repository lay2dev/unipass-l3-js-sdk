export class ArrayBufferReader {
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
export class HexStringReader {
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
export class Reader {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlYWRlci9yZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUFZLE1BQU07UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDOUIsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFDO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLENBQ0wsSUFBSTtZQUNKLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRztpQkFDaEIsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUM1QyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2xDO2lCQUNBLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDWixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFBWSxNQUFNO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBQztRQUNQLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxhQUFhO1FBQ1gsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sTUFBTTtJQUNqQixZQUFZLEtBQUs7UUFDZixJQUNFLEtBQUssWUFBWSxlQUFlO1lBQ2hDLEtBQUssWUFBWSxpQkFBaUIsRUFDbEM7WUFDQSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNwRCxNQUFNLElBQUksS0FBSyxDQUNiLDhEQUE4RCxDQUMvRCxDQUFDO2FBQ0g7WUFDRCxPQUFPLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxLQUFLLFlBQVksV0FBVyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNO1FBQ3pCLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7YUFDcEU7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0YifQ==