import { validators, transaction } from './utils';
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
    async sendTransaction(rpc) {
        const transformData = this.transform();
        const data = await rpc.send_up_transaction(transformData);
        if (data) {
            const rawResponse = data;
            const txHash = rawResponse.transform().result;
            return txHash;
        }
        throw new Error(`TxHashError: txhash error ${data}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsTUFBTSxPQUFPLFdBQVc7SUFDdEIsWUFBbUIsS0FBVSxFQUFTLEdBQVk7UUFBL0IsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVM7SUFBRyxDQUFDO0lBRXRELFFBQVE7UUFDTixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUF1QixDQUFDO1FBQ25ELFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHO1FBQ1IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLFdBQVcsQ0FBQyxvQkFBb0IsQ0FDckMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUNBLENBQUM7SUFDekIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPO1lBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztTQUNkLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFRO1FBQzVCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sV0FBVyxHQUFHLElBQXNCLENBQUM7WUFDM0MsTUFBTSxNQUFNLEdBQUksV0FBVyxDQUFDLFNBQVMsRUFBbUIsQ0FBQyxNQUFNLENBQUM7WUFDaEUsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNGIn0=