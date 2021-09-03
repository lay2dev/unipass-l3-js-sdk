"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keccak256Hasher = void 0;
const _1 = require(".");
const keccak_1 = __importDefault(require("keccak"));
const reader_1 = require("../reader");
class Keccak256Hasher extends _1.Hasher {
    constructor() {
        super(keccak_1.default('keccak256'));
    }
    update(data) {
        let array;
        if (data instanceof reader_1.ArrayBufferReader || data instanceof reader_1.HexStringReader) {
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
            array = Buffer.from(new Uint8Array(new reader_1.ArrayBufferReader(data).toArrayBuffer()));
        }
        this.h.update(array);
        return this;
    }
    digest() {
        const hex = '0x' + this.h.digest('hex').toString();
        return new reader_1.HexStringReader(hex);
    }
    reset() {
        this.h = keccak_1.default('keccak256');
    }
}
exports.Keccak256Hasher = Keccak256Hasher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VjY2FrMjU2LWhhc2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYXNoL2tlY2NhazI1Ni1oYXNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0JBQTJCO0FBQzNCLG9EQUE0QjtBQUM1QixzQ0FBK0Q7QUFFL0QsTUFBYSxlQUFnQixTQUFRLFNBQU07SUFDekM7UUFDRSxLQUFLLENBQUMsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNLENBQ0osSUFBZ0U7UUFFaEUsSUFBSSxLQUFhLENBQUM7UUFDbEIsSUFBSSxJQUFJLFlBQVksMEJBQWlCLElBQUksSUFBSSxZQUFZLHdCQUFlLEVBQUU7WUFDeEUsNERBQTREO1lBQzVELEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0Q7YUFBTSxJQUFJLElBQUksWUFBWSxXQUFXLEVBQUU7WUFDdEMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMzQzthQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQ25DLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDakIsSUFBSSxVQUFVLENBQUMsSUFBSSwwQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUM1RCxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELE9BQU8sSUFBSSx3QkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxnQkFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQWpDRCwwQ0FpQ0MifQ==