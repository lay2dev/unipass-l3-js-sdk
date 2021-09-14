"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBUUEsbUNBQWtEO0FBRWxELE1BQWEsV0FBVztJQUN0QixZQUFtQixLQUFVLEVBQVMsR0FBWTtRQUEvQixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUztJQUFHLENBQUM7SUFFdEQsUUFBUTtRQUNOLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQXVCLENBQUM7UUFDbkQsa0JBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLElBQUksR0FBRyxtQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsa0JBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQUc7UUFDUixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sbUJBQVcsQ0FBQyxvQkFBb0IsQ0FDckMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUNBLENBQUM7SUFDekIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPO1lBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztTQUNkLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFRO1FBQzVCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sV0FBVyxHQUFHLElBQXNCLENBQUM7WUFDM0MsT0FBTyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDaEM7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDRjtBQXpDRCxrQ0F5Q0MifQ==