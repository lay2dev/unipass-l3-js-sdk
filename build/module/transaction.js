import { ArrayBufferReader, } from '.';
import { validators, transaction, userInfo } from './utils';
export class Transaction {
    constructor(inner, sig) {
        this.inner = inner;
        this.sig = sig;
    }
    validate() {
        const data = this.transform();
        validators.ValidateInner(data.inner);
        return this;
    }
    validateRaw() {
        const data = transaction.TransformInner(this.inner);
        validators.ValidateInner(data);
        return this;
    }
    setSig(sig) {
        this.sig = sig;
    }
    transform() {
        return transaction.TransformTransaction(this.serializeJson());
    }
    serializeJson() {
        return {
            inner: this.inner,
            sig: this.sig,
        };
    }
    sigVerify() {
        this.validateRaw();
        const signData = {
            registerEmail: this.inner.action.registerEmail,
            pubkey: this.inner.action.pubkey,
            quickLogin: this.inner.action.quickLogin,
            recoveryEmail: this.inner.action.recoveryEmail,
            nonce: this.inner.nonce,
        };
        const signMessage = new ArrayBufferReader(userInfo.SerializeUserInfo(signData));
        return signMessage;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixHQU1sQixNQUFNLEdBQUcsQ0FBQztBQUNYLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUU1RCxNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFtQixLQUFVLEVBQVMsR0FBWTtRQUEvQixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUztJQUFHLENBQUM7SUFFdEQsUUFBUTtRQUNOLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQXVCLENBQUM7UUFDbkQsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQUc7UUFDUixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sV0FBVyxDQUFDLG9CQUFvQixDQUNyQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQ0EsQ0FBQztJQUN6QixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLE1BQU0sUUFBUSxHQUFHO1lBQ2YsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFDOUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU07WUFDaEMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFDeEMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFDOUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztTQUN4QixDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxpQkFBaUIsQ0FDdkMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUNyQyxDQUFDO1FBQ0YsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBUTtRQUM1QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLFdBQVcsR0FBRyxJQUFzQixDQUFDO1lBQzNDLE9BQU8sV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0YifQ==