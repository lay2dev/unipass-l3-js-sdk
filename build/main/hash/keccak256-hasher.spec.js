"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
ava_1.default('hello Keccak256Hasher', (t) => {
    const hasher = new _1.Keccak256Hasher();
    const res = hasher.hash('hello').serializeJson();
    t.is(res, '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VjY2FrMjU2LWhhc2hlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhc2gva2VjY2FrMjU2LWhhc2hlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLHdCQUFvQztBQUdwQyxhQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGtCQUFlLEVBQUUsQ0FBQztJQUNyQyxNQUFNLEdBQUcsR0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0RSxDQUFDLENBQUMsRUFBRSxDQUNGLEdBQUcsRUFDSCxvRUFBb0UsQ0FDckUsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIn0=