"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const _1 = require(".");
const utils_1 = require("./utils");
class Transaction {
    constructor(inner, sig) {
        this.inner = inner;
        this.sig = sig;
    }
    validate() {
        const data = this.transform();
        utils_1.validators.ValidateInner(data.inner);
        return this;
    }
    validateRaw() {
        const data = utils_1.transaction.TransformInner(this.inner);
        utils_1.validators.ValidateInner(data);
        return this;
    }
    setSig(sig) {
        this.sig = sig;
    }
    transform() {
        return utils_1.transaction.TransformTransaction(this.serializeJson());
    }
    serializeJson() {
        return {
            inner: this.inner,
            sig: this.sig,
        };
    }
    getRegisterSignByRSAMessage() {
        const rsa = new _1.Rsa(new _1.StringReader(this.inner.pubkey.value.e).toArrayBuffer(4), new _1.StringReader(this.inner.pubkey.value.n).toArrayBuffer(256));
        const inner = new _1.RegisterInner(new _1.StringReader(this.inner.username).toArrayBuffer(32), new _1.StringReader(this.inner.action.registerEmail).toArrayBuffer(32), new _1.RsaPubkey(rsa), new _1.RecoveryEmail(1, 1, [
            new _1.StringReader(this.inner.action.registerEmail).toArrayBuffer(32),
        ]));
        console.log(inner);
        const message = inner.serialize();
        console.log('---message', message);
        return message;
    }
    testSignMessage() {
        this.validateRaw();
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
        let keyObject = key.exportKey('components');
        // 因为molecule是小端编码，所以需要使用reverse 方法逆序排序
        let n = new Uint8Array(keyObject.n.slice(1)).reverse();
        let e = new Uint32Array([keyObject.e]).reverse();
        let pubkey = new _1.RsaPubkey(new _1.Rsa(e.buffer, n.buffer));
        let emails = [];
        for (let i = 0; i < 32; i++) {
            emails[i] = new ArrayBuffer(32);
        }
        let inner = new _1.RegisterInner(new _1.Reader(new ArrayBuffer(32)), new _1.Reader(new ArrayBuffer(32)), pubkey, new _1.RecoveryEmail(1, 1, emails));
        const message = inner.serialize();
        return message;
    }
    async sendTransaction(rpc) {
        const transformData = this.transform();
        const data = await rpc.send_up_transaction(transformData);
        if (data) {
            const rawResponse = data;
            return rawResponse.transform();
        }
        throw new Error(`TxHashError: txhash error ${data}`);
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0JBWVc7QUFDWCxtQ0FBa0Q7QUFFbEQsTUFBYSxXQUFXO0lBQ3RCLFlBQW1CLEtBQVUsRUFBUyxHQUFZO1FBQS9CLFVBQUssR0FBTCxLQUFLLENBQUs7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFTO0lBQUcsQ0FBQztJQUV0RCxRQUFRO1FBQ04sTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBdUIsQ0FBQztRQUNuRCxrQkFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sSUFBSSxHQUFHLG1CQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxrQkFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRztRQUNSLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxtQkFBVyxDQUFDLG9CQUFvQixDQUNyQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQ0EsQ0FBQztJQUN6QixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFDRCwyQkFBMkI7UUFDekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxNQUFHLENBQ2pCLElBQUksZUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMs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