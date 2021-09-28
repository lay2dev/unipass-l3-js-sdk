import { validators, transaction } from './utils';
let source = 'unipass-wallet';
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
        const data = transaction.TransformTransaction(this.serializeJson());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFFOUIsTUFBTSxPQUFPLFdBQVc7SUFDdEIsWUFBbUIsS0FBVSxFQUFTLEdBQVU7UUFBN0IsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUFTLFFBQUcsR0FBSCxHQUFHLENBQU87SUFBRyxDQUFDO0lBRXBELFFBQVE7UUFDTixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUF1QixDQUFDO1FBQ25ELFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHO1FBQ1IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUVELFNBQVM7UUFDUCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsb0JBQW9CLENBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FDQSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQ2pELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQzFCLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDWCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTztZQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBUTtRQUM1QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLFdBQVcsR0FBRyxJQUFzQixDQUFDO1lBQzNDLE9BQU8sV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0YifQ==