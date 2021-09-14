import { StringReader } from '..';
import { RecoveryEmail, RegisterInner, Rsa, RsaPubkey, } from './sign-message-base';
export class SignMessage {
    constructor(inner) {
        this.inner = inner;
    }
    sign() {
        if (this.inner.action == 'register') {
            const rsa = new Rsa(new StringReader(this.inner.pubkey.value.e).toArrayBuffer(4), new StringReader(this.inner.pubkey.value.n).toArrayBuffer(256));
            const inner = new RegisterInner(new StringReader(this.inner.username).toArrayBuffer(32), new StringReader(this.inner.registerEmail).toArrayBuffer(32), new RsaPubkey(rsa), new RecoveryEmail(1, 1, [
                new StringReader(this.inner.registerEmail).toArrayBuffer(32),
            ]));
            const message = inner.serialize().serializeJson();
            return message;
        }
        else {
            throw new Error(`SignError: action  error `);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBNEMsWUFBWSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQzVFLE9BQU8sRUFDTCxhQUFhLEVBQ2IsYUFBYSxFQUNiLEdBQUcsRUFDSCxTQUFTLEdBQ1YsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QixNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFvQixLQUFvQjtRQUFwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUM1QyxJQUFJO1FBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQ2pCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQzVELElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQy9ELENBQUM7WUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsQ0FDN0IsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ3ZELElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUM1RCxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFDbEIsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO2FBQzdELENBQUMsQ0FDSCxDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUksS0FBSyxDQUFDLFNBQVMsRUFBd0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV6RSxPQUFPLE9BQU8sQ0FBQztTQUNoQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztDQUNGIn0=