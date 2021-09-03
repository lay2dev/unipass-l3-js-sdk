"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blake2bHasher = void 0;
const _1 = require(".");
const blake2b_1 = __importDefault(require("blake2b"));
const __1 = require("..");
class Blake2bHasher extends _1.Hasher {
    constructor() {
        const h = blake2b_1.default(32, null, null, new Uint8Array(__1.HexStringReader.fromRawString('ckb-default-hash').toArrayBuffer()));
        super(h);
    }
    update(data) {
        let array;
        if (data instanceof __1.ArrayBufferReader || data instanceof __1.HexStringReader) {
            /** Reader type params not enter this branch, it's weired */
            array = Buffer.from(data.serializeJson().replace('0x', ''));
        }
        else if (data instanceof ArrayBuffer) {
            array = Buffer.from(new Uint8Array(data));
        }
        else if (typeof data === 'string') {
            array = Buffer.from(data);
        }
        else {
            array = Buffer.from(new Uint8Array(new __1.ArrayBufferReader(data).toArrayBuffer()));
        }
        this.h.update(array);
        return this;
    }
    digest() {
        const out = new Uint8Array(32);
        this.h.digest(out);
        return new __1.ArrayBufferReader(out.buffer);
    }
    reset() {
        this.h = blake2b_1.default(32, null, null, new Uint8Array(__1.ArrayBufferReader.fromRawString('ckb-default-hash').toArrayBuffer()));
    }
}
exports.Blake2bHasher = Blake2bHasher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxha2UyYi1oYXNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFzaC9ibGFrZTJiLWhhc2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3QkFBMkI7QUFDM0Isc0RBQThCO0FBQzlCLDBCQUF3RDtBQUV4RCxNQUFhLGFBQWMsU0FBUSxTQUFNO0lBQ3ZDO1FBQ0UsTUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FDZixFQUFFLEVBQ0YsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLFVBQVUsQ0FDWixtQkFBZSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUNsRSxDQUNGLENBQUM7UUFDRixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQTBCO1FBQy9CLElBQUksS0FBYSxDQUFDO1FBQ2xCLElBQUksSUFBSSxZQUFZLHFCQUFpQixJQUFJLElBQUksWUFBWSxtQkFBZSxFQUFFO1lBQ3hFLDREQUE0RDtZQUM1RCxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzdEO2FBQU0sSUFBSSxJQUFJLFlBQVksV0FBVyxFQUFFO1lBQ3RDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDM0M7YUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNuQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ2pCLElBQUksVUFBVSxDQUFDLElBQUkscUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FDNUQsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTTtRQUNKLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLE9BQU8sSUFBSSxxQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQ2QsRUFBRSxFQUNGLElBQUksRUFDSixJQUFJLEVBQ0osSUFBSSxVQUFVLENBQ1oscUJBQWlCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQ3BFLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQS9DRCxzQ0ErQ0MifQ==