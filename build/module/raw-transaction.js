import { transaction } from '.';
export class RawTransaction {
    constructor(transactionResult) {
        this.transactionResult = transactionResult;
    }
    raw() {
        return this.transactionResult;
    }
    transform() {
        if (typeof this.transactionResult.result == 'string') {
            return this.transactionResult.result;
        }
        return transaction.TransformRawTransaction(this.transactionResult.result);
    }
    serializeJson() {
        if (typeof this.transactionResult.result == 'string') {
            return this.transactionResult.result;
        }
        return transaction.TransformRawTransaction(this.transactionResult.result);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LXRyYW5zYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jhdy10cmFuc2FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUErQixNQUFNLEdBQUcsQ0FBQztBQUU3RCxNQUFNLE9BQU8sY0FBYztJQUN6QixZQUE0QixpQkFBc0I7UUFBdEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFLO0lBQUcsQ0FBQztJQUV0RCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sSUFBSSxRQUFRLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxXQUFXLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztTQUN0QztRQUNELE9BQU8sV0FBVyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RSxDQUFDO0NBQ0YifQ==