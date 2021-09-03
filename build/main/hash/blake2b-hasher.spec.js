"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
ava_1.default('test reader  hello', (t) => {
    const hasher = new _1.Blake2bHasher();
    const res = hasher.hash('hello').serializeJson();
    // console.log(res);
    t.is(res, '0x2da1289373a9f6b7ed21db948f4dc5d942cf4023eaef1d5a2b1a45b9d12d1036');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxha2UyYi1oYXNoZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYXNoL2JsYWtlMmItaGFzaGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFDdkIsd0JBQWtDO0FBRWxDLGFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQWEsRUFBRSxDQUFDO0lBQ25DLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakQsb0JBQW9CO0lBQ3BCLENBQUMsQ0FBQyxFQUFFLENBQ0YsR0FBRyxFQUNILG9FQUFvRSxDQUNyRSxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMifQ==