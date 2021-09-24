import { hashData, StringReader, } from '..';
import { addLocalKeyInner, RecoveryEmail, RegisterInner, Rsa, RsaPubkey, } from './sign-message-base';
export class SignMessage {
    constructor(inner) {
        this.inner = inner;
    }
    messageHash() {
        const rsa = new Rsa(new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer, this.inner.pubkey.value.n);
        const pubkey = new RsaPubkey(rsa);
        if (this.inner.action == 'register') {
            if (!this.inner.registerEmail) {
                throw new Error(`SignMessageError: not find registerEmail `);
            }
            const inner = new RegisterInner(new StringReader(hashData(this.inner.username)).toArrayBuffer(32), new StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(32), pubkey, new RecoveryEmail(1, 1, [
                new StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(32),
            ]));
            const message = inner.serialize().serializeJson();
            return message;
        }
        else if (this.inner.action == 'addKey') {
            if (!this.inner.nonce) {
                throw new Error(`SignMessageError: not find nonce `);
            }
            if (!this.inner.nonce.startsWith('0x')) {
                throw new Error(`SignMessageError: nonce not hex data`);
            }
            const inner = new addLocalKeyInner(new StringReader(hashData(this.inner.username)).toArrayBuffer(32), new StringReader(this.inner.nonce).toArrayBuffer(4), pubkey);
            const message = inner.serialize().serializeJson();
            return message;
        }
        else {
            throw new Error(`SignError: action  error `);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxRQUFRLEVBR1IsWUFBWSxHQUNiLE1BQU0sSUFBSSxDQUFDO0FBQ1osT0FBTyxFQUNMLGdCQUFnQixFQUNoQixhQUFhLEVBQ2IsYUFBYSxFQUNiLEdBQUcsRUFDSCxTQUFTLEdBQ1YsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QixNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFvQixLQUFvQjtRQUFwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUM1QyxXQUFXO1FBQ1QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQ2pCLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxQixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7YUFDOUQ7WUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsQ0FDN0IsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ2pFLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUN0RSxNQUFNLEVBQ04sSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQ2hFLEVBQUUsQ0FDSDthQUNGLENBQUMsQ0FDSCxDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUksS0FBSyxDQUFDLFNBQVMsRUFBd0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN6RSxPQUFPLE9BQU8sQ0FBQztTQUNoQjthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2FBQ3pEO1lBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBZ0IsQ0FDaEMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ2pFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUNuRCxNQUFNLENBQ1AsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFJLEtBQUssQ0FBQyxTQUFTLEVBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFekUsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7Q0FDRiJ9