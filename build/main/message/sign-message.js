"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignMessage = void 0;
const __1 = require("..");
const sign_message_base_1 = require("./sign-message-base");
class SignMessage {
    constructor(inner) {
        this.inner = inner;
    }
    sign() {
        if (this.inner.action == 'register') {
            const rsa = new sign_message_base_1.Rsa(new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer, this.inner.pubkey.value.n);
            const pubkey = new sign_message_base_1.RsaPubkey(rsa);
            console.log(pubkey);
            const inner = new sign_message_base_1.RegisterInner(new __1.StringReader(this.inner.username).toArrayBuffer(32), new __1.StringReader(this.inner.registerEmail).toArrayBuffer(32), pubkey, new sign_message_base_1.RecoveryEmail(1, 1, [
                new __1.StringReader(this.inner.registerEmail).toArrayBuffer(32),
            ]));
            console.log(inner);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQUE0RTtBQUM1RSwyREFLNkI7QUFFN0IsTUFBYSxXQUFXO0lBQ3RCLFlBQW9CLEtBQW9CO1FBQXBCLFVBQUssR0FBTCxLQUFLLENBQWU7SUFBRyxDQUFDO0lBQzVDLElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFHLENBQ2pCLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxQixDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSw2QkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBYSxDQUM3QixJQUFJLGdCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ3ZELElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFDNUQsTUFBTSxFQUNOLElBQUksaUNBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUN0QixJQUFJLGdCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO2FBQzdELENBQUMsQ0FDSCxDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLE9BQU8sR0FBSSxLQUFLLENBQUMsU0FBUyxFQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7Q0FDRjtBQTFCRCxrQ0EwQkMifQ==