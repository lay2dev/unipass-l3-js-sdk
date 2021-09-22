"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignMessage = void 0;
const __1 = require("..");
const sign_message_base_1 = require("./sign-message-base");
class SignMessage {
    constructor(inner) {
        this.inner = inner;
    }
    messageHash() {
        const rsa = new sign_message_base_1.Rsa(new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer, this.inner.pubkey.value.n);
        const pubkey = new sign_message_base_1.RsaPubkey(rsa);
        if (this.inner.action == 'register') {
            if (!this.inner.registerEmail) {
                throw new Error(`SignMessageError: not find registerEmail `);
            }
            const inner = new sign_message_base_1.RegisterInner(new __1.StringReader(__1.hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(__1.hashData(this.inner.registerEmail)).toArrayBuffer(32), pubkey, new sign_message_base_1.RecoveryEmail(1, 1, [
                new __1.StringReader(__1.hashData(this.inner.registerEmail)).toArrayBuffer(32),
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
            const inner = new sign_message_base_1.addLocalKeyInner(new __1.StringReader(__1.hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(this.inner.nonce).toArrayBuffer(4), pubkey);
            const message = inner.serialize().serializeJson();
            console.log(message);
            return message;
        }
        else {
            throw new Error(`SignError: action  error `);
        }
    }
}
exports.SignMessage = SignMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQU1ZO0FBQ1osMkRBTTZCO0FBRTdCLE1BQWEsV0FBVztJQUN0QixZQUFvQixLQUFvQjtRQUFwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUM1QyxXQUFXO1FBQ1QsTUFBTSxHQUFHLEdBQUcsSUFBSSx1QkFBRyxDQUNqQixJQUFJLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFDN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDMUIsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksNkJBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQzthQUM5RDtZQUNELE1BQU0sS0FBSyxHQUFHLElBQUksaUNBQWEsQ0FDN0IsSUFBSSxnQkFBWSxDQUFDLFlBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUNqRSxJQUFJLGdCQUFZLENBQUMsWUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ3RFLE1BQU0sRUFDTixJQUFJLGlDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxnQkFBWSxDQUFDLFlBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUNoRSxFQUFFLENBQ0g7YUFDRixDQUFDLENBQ0gsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFJLEtBQUssQ0FBQyxTQUFTLEVBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekUsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtZQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQzthQUN0RDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQzthQUN6RDtZQUVELE1BQU0sS0FBSyxHQUFHLElBQUksb0NBQWdCLENBQ2hDLElBQUksZ0JBQVksQ0FBQyxZQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFDakUsSUFBSSxnQkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUNuRCxNQUFNLENBQ1AsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFJLEtBQUssQ0FBQyxTQUFTLEVBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixPQUFPLE9BQU8sQ0FBQztTQUNoQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztDQUNGO0FBN0NELGtDQTZDQyJ9