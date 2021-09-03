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
    getSignMessage() {
        this.validateRaw();
        const signData = {
            registerEmail: this.inner.action.registerEmail,
            pubkey: this.inner.action.pubkey,
            quickLogin: this.inner.action.quickLogin,
            recoveryEmail: this.inner.action.recoveryEmail,
            nonce: this.inner.nonce,
        };
        const signMessage = new _1.ArrayBufferReader(utils_1.userInfo.SerializeUserInfo(signData));
        return signMessage.serializeJson();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0JBT1c7QUFDWCxtQ0FBNEQ7QUFFNUQsTUFBYSxXQUFXO0lBQ3RCLFlBQW1CLEtBQVUsRUFBUyxHQUFZO1FBQS9CLFVBQUssR0FBTCxLQUFLLENBQUs7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFTO0lBQUcsQ0FBQztJQUV0RCxRQUFRO1FBQ04sTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBdUIsQ0FBQztRQUNuRCxrQkFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sSUFBSSxHQUFHLG1CQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxrQkFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRztRQUNSLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxtQkFBVyxDQUFDLG9CQUFvQixDQUNyQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQ0EsQ0FBQztJQUN6QixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLE1BQU0sUUFBUSxHQUFHO1lBQ2YsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFDOUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU07WUFDaEMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFDeEMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFDOUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztTQUN4QixDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxvQkFBaUIsQ0FDdkMsZ0JBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FDckMsQ0FBQztRQUVGLE9BQU8sV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQVE7UUFDNUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFELElBQUksSUFBSSxFQUFFO1lBQ1IsTUFBTSxXQUFXLEdBQUcsSUFBc0IsQ0FBQztZQUMzQyxPQUFPLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNoQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNGO0FBM0RELGtDQTJEQyJ9