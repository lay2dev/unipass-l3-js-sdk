"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterInner = exports.RecoveryEmail = exports.RsaPubkey = exports.Rsa = void 0;
const __1 = require("..");
const witness_1 = require("./unipass-v3-jss/witness");
class Rsa {
    constructor(e, n) {
        this.e = e;
        this.n = n;
    }
}
exports.Rsa = Rsa;
class RsaPubkey {
    constructor(rsa) {
        this.type = 'RsaPubkey';
        this.value = rsa;
    }
}
exports.RsaPubkey = RsaPubkey;
class RecoveryEmail {
    constructor(threshold, first_n, emails) {
        this.threshold = threshold;
        this.first_n = first_n;
        this.emails = emails;
    }
}
exports.RecoveryEmail = RecoveryEmail;
class RegisterInner {
    constructor(username, register_email, pubkey, recoveryEmail, source = new ArrayBuffer(0)) {
        this.username = username;
        this.register_email = register_email;
        this.pubkey = pubkey;
        this.recoveryEmail = recoveryEmail;
        this.source = source;
    }
    serialize() {
        return new __1.Reader(witness_1.SerializeRegisterChildTxInner(this));
    }
}
exports.RegisterInner = RegisterInner;
function create_rsa() {
    const NodeRSA = require('node-rsa');
    const key = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEogIBAAKCAQEA0i4KvHsZ2DjpVMvG9hYCloaxTy+2hIyAvNjIz/mkkbDafqFg\n' +
        'ock0UrjEWmpbzsYryg3PGBwHuXJ6E9rVG3Gf9Vwkrgx64/eGhnlJbslQooaSJJKv\n' +
        'xh6bM1D4BQGqDM6sAeFZXgn4XKsOV5Au5pjC2DxPr2YylN/lf0sQFYd5vy4OPHj8\n' +
        'xSr6nrU/zSamnbqMGJsDmuUqq4NHUas1s9/Z9WzHU22z4SYflCkghe+6YfNJX/Kc\n' +
        'ip9YrKnMu5qxV6XvhH4CUKUQfCBpYknRNsn62QLKqSvcadaIGa/wgH92dKlM3Wv8\n' +
        '1nQi9+sn+MqcCRnwb/w8dq3hynXxcnXDuKt8bwIDAQABAoIBABgcTAL/JCHXtXyS\n' +
        'u8ozECzwWpq44HkoHQSM4cxp2OUVoprwLEOi7yumInA0zz9TIGbXWrBrVr+BUFvC\n' +
        'uLujNzRQU6zbpaVNGdOHSlM5KNTcFxu28A8MJ8WlPi5k2HsLolO85CGThzgqL0UA\n' +
        'N0EguQlRMdrvIFJPtOX7WGb/2YmCq7aShsNagBrePYo5hIts7cdBCsprVv+/NO3r\n' +
        '9fnoEz8EeMmF+oRiPBQzuV2wY/AKPHhK5vPVahZinbDaHzMfRyCR1YgjN+aZGmlR\n' +
        'ZOGxM/k85qoD1gzoQ+gbJovv3oro9EEe9NFQ9EPxUozutgQuVqFDjSXLKIIyFI4f\n' +
        'ocwRqBECgYEA9R27+W6rP2AjnppyrphuZfsdPJO9iLrMorQfUEcKQe1sFE6X24GE\n' +
        'zA0aYRcKab6fT+bzpsPK6gc31PsWtzjtyJJK63RrUCchf1AW+lLvvCuCmXy1aQX7\n' +
        '2Gg+/opfNOPdrgc1/GV1IqiSkQnP5Dcq+8SsfJhjSCfqw6Re1g4aXasCgYEA24Mu\n' +
        'sy86fSfg9L6v7K7146PmLZwXlHyolzqP6vItv4/g1WlC8ffQtdqPEadck5GdgjS1\n' +
        'tOrYC1vNOTeiattH6NdVi8tg6Mqk2PZ8uYAlgqE2Xxy2vOqNOahY81rEtYTTjIOy\n' +
        'XDw5T9LvfVFp5fayc9TZKvLqkHaHaF3qzNnH8E0CgYB8ROjqGquDY/BrFo6R6gH+\n' +
        'fgNilNyAl4Pr8Tn27y1KI16qJPZkeROkh/gZxR6oYdZPIh3hLF6Rq7sopWvs1FXp\n' +
        'XBHTsaA+cLhQ3X/oxWd5lO2Pd2RZrIj0PFXDos+F9wiKlGlQXve17JTyJ3FYmIeY\n' +
        'QSvZt0COcn5ZVdom19uSJQKBgGVsqoI+Wy8C4w0SomSgvppM24jNa5O/OYKOm3q6\n' +
        'JWsyhnb06Oq2TygHcT197+d7S6SiyCZssCAnbZ53V0M6SHKMNEmgUgmdwCdDVIO9\n' +
        'cxd1d5LgyIpncZNndpoSoXshgUGWhC3b4btBQkjL+js4DmI4wZL3pGvVaGFPq7K1\n' +
        'GY2tAoGARugtayfujDrYMiwfrQL4kbh7dOv62cKpeRPB3/YBuFNJ7l7uWo/M/DJT\n' +
        'k/iV4IzeX8o6FzI9GXCj/TwIXLofZi9ENOg6kLSYI6YqmYHG3f0ZNDQfceN5d7j3\n' +
        'pYftxwl9EbsnXUW8tL90UbPB2nI0z6IqJOtg+XOzEH/u7n8EK+I=\n' +
        '-----END RSA PRIVATE KEY-----');
    console.log(key);
    const keyObject = key.exportKey('components');
    console.log(keyObject);
    const n = new Uint8Array(keyObject.n.slice(1));
    const pubkey = new RsaPubkey(new Rsa(new Uint32Array([keyObject.e]).reverse().buffer, n.reverse().buffer));
    console.log(pubkey);
    const emails = [];
    for (let i = 0; i < 32; i++) {
        emails[i] = new ArrayBuffer(32);
    }
    const inner = new RegisterInner(new __1.Reader(new ArrayBuffer(32)), new __1.Reader(new ArrayBuffer(32)), pubkey, new RecoveryEmail(1, 1, emails));
    console.log(inner.serialize().serializeJson());
}
create_rsa();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWVzc2FnZS9zaWduLW1lc3NhZ2UtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBK0M7QUFFL0Msc0RBQXlFO0FBTXpFLE1BQWEsR0FBRztJQUNkLFlBQW1CLENBQWMsRUFBUyxDQUFjO1FBQXJDLE1BQUMsR0FBRCxDQUFDLENBQWE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFhO0lBQUcsQ0FBQztDQUM3RDtBQUZELGtCQUVDO0FBRUQsTUFBYSxTQUFTO0lBR3BCLFlBQVksR0FBUTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUFQRCw4QkFPQztBQUNELE1BQWEsYUFBYTtJQUN4QixZQUNTLFNBQWlCLEVBQ2pCLE9BQWUsRUFDZixNQUFxQjtRQUZyQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQzNCLENBQUM7Q0FDTDtBQU5ELHNDQU1DO0FBQ0QsTUFBYSxhQUFhO0lBQ3hCLFlBQ1MsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsTUFBYyxFQUNkLGFBQTRCLEVBQzVCLFNBQXNCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztRQUp4QyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFrQztJQUM5QyxDQUFDO0lBQ0osU0FBUztRQUNQLE9BQU8sSUFBSSxVQUFNLENBQUMsdUNBQTZCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0Y7QUFYRCxzQ0FXQztBQUNELFNBQVMsVUFBVTtJQUNqQixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQ3JCLG1DQUFtQztRQUNqQyxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSx3REFBd0Q7UUFDeEQsK0JBQStCLENBQ2xDLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QixNQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9DLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxDQUMxQixJQUFJLEdBQUcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQzdFLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNqQztJQUNELE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUM3QixJQUFJLFVBQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUMvQixJQUFJLFVBQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUMvQixNQUFNLEVBQ04sSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FDaEMsQ0FBQztJQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLFNBQVMsRUFBd0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFFRCxVQUFVLEVBQUUsQ0FBQyJ9