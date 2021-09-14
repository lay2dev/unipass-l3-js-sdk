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
        const h = blake2b_1.default(32, null, null, new Uint8Array(__1.Reader.fromRawString('ckb-default-hash').toArrayBuffer()));
        super(h);
    }
    update(data) {
        let array;
        if (data instanceof __1.Reader) {
            /** Reader type params not enter this branch, it's weired */
            array = Buffer.from(data.replace('0x', ''));
        }
        else if (data instanceof ArrayBuffer) {
            array = Buffer.from(new Uint8Array(data));
        }
        else if (typeof data === 'string') {
            array = Buffer.from(data);
        }
        else {
            array = Buffer.from(new Uint8Array(new __1.Reader(data).toArrayBuffer()));
        }
        this.h.update(array);
        return this;
    }
    digest() {
        const out = new Uint8Array(32);
        this.h.digest(out);
        return new __1.Reader(out.buffer);
    }
    reset() {
        this.h = blake2b_1.default(32, null, null, new Uint8Array(__1.Reader.fromRawString('ckb-default-hash').toArrayBuffer()));
    }
}
exports.Blake2bHasher = Blake2bHasher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxha2UyYi1oYXNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFzaC9ibGFrZTJiLWhhc2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3QkFBMkI7QUFDM0Isc0RBQThCO0FBQzlCLDBCQUE2QztBQUU3QyxNQUFhLGFBQWMsU0FBUSxTQUFNO0lBQ3ZDO1FBQ0UsTUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FDZixFQUFFLEVBQ0YsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLFVBQVUsQ0FBQyxVQUFNLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FDekUsQ0FBQztRQUNGLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBMEI7UUFDL0IsSUFBSSxLQUFhLENBQUM7UUFDbEIsSUFBSSxJQUFJLFlBQVksVUFBTSxFQUFFO1lBQzFCLDREQUE0RDtZQUM1RCxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBRSxJQUFlLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO2FBQU0sSUFBSSxJQUFJLFlBQVksV0FBVyxFQUFFO1lBQ3RDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDM0M7YUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNuQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ2pCLElBQUksVUFBVSxDQUFFLElBQUksVUFBTSxDQUFDLElBQUksQ0FBcUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUN0RSxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsQ0FBQyxHQUFHLGlCQUFPLENBQ2QsRUFBRSxFQUNGLElBQUksRUFDSixJQUFJLEVBQ0osSUFBSSxVQUFVLENBQUMsVUFBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQ3pFLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUEzQ0Qsc0NBMkNDIn0=