"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayBufferReader = void 0;
class ArrayBufferReader {
    constructor(input) {
        this.input = input;
        this.view = new DataView(input);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktYnVmZmVyLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFkZXIvYXJyYXktYnVmZmVyLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLGlCQUFpQjtJQUU1QixZQUFtQixLQUFrQjtRQUFsQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ25DLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTTtRQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO2FBQ3BFO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBUztRQUNmLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTyxDQUNMLElBQUk7WUFDSixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUc7aUJBQ2hCLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDNUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNsQztpQkFDQSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ1osQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXpDRCw4Q0F5Q0MifQ==