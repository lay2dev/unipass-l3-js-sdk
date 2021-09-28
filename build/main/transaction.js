"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const utils_1 = require("./utils");
let source = 'unipass-wallet';
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
        const data = utils_1.transaction.TransformTransaction(this.serializeJson());
        data.inner.action.source = data.inner.action.source
            ? data.inner.action.source
            : source;
        return data;
    }
    serializeJson() {
        return {
            inner: this.inner,
            sig: this.sig,
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQWtEO0FBQ2xELElBQUksTUFBTSxHQUFHLGdCQUFnQixDQUFDO0FBRTlCLE1BQWEsV0FBVztJQUN0QixZQUFtQixLQUFVLEVBQVMsR0FBVTtRQUE3QixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBTztJQUFHLENBQUM7SUFFcEQsUUFBUTtRQUNOLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQXVCLENBQUM7UUFDbkQsa0JBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLElBQUksR0FBRyxtQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsa0JBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQUc7UUFDUixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sSUFBSSxHQUFHLG1CQUFXLENBQUMsb0JBQW9CLENBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FDQSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQ2pELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQzFCLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDWCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTztZQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBUTtRQUM1QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLFdBQVcsR0FBRyxJQUFzQixDQUFDO1lBQzNDLE9BQU8sV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0Y7QUE3Q0Qsa0NBNkNDIn0=