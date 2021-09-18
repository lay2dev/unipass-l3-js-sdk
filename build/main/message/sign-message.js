"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignMessage = exports.hashData = void 0;
const __1 = require("..");
const sign_message_base_1 = require("./sign-message-base");
const crypto_1 = require("crypto");
function hashData(data) {
    const messageHash = crypto_1.createHash('SHA256')
        .update(data)
        .digest('hex')
        .toString();
    return `0x${messageHash}`;
}
exports.hashData = hashData;
class SignMessage {
    constructor(inner) {
        this.inner = inner;
    }
    sign() {
        if (this.inner.action == 'register') {
            const rsa = new sign_message_base_1.Rsa(new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer, this.inner.pubkey.value.n);
            const inner = new sign_message_base_1.RegisterInner(new __1.StringReader(hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(32), new sign_message_base_1.RsaPubkey(rsa), new sign_message_base_1.RecoveryEmail(1, 1, [
                new __1.StringReader(hashData(this.inner.registerEmail)).toArrayBuffer(32),
            ]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQUE0RTtBQUM1RSwyREFLNkI7QUFDN0IsbUNBQW9DO0FBQ3BDLFNBQWdCLFFBQVEsQ0FBQyxJQUFZO0lBQ25DLE1BQU0sV0FBVyxHQUFHLG1CQUFVLENBQUMsUUFBUSxDQUFDO1NBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDWixNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ2IsUUFBUSxFQUFFLENBQUM7SUFFZCxPQUFPLEtBQUssV0FBVyxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQVBELDRCQU9DO0FBQ0QsTUFBYSxXQUFXO0lBQ3RCLFlBQW9CLEtBQW9CO1FBQXBCLFVBQUssR0FBTCxLQUFLLENBQWU7SUFBRyxDQUFDO0lBQzVDLElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFHLENBQ2pCLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxQixDQUFDO1lBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBYSxDQUM3QixJQUFJLGdCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ2pFLElBQUksZ0JBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFDdEUsSUFBSSw2QkFBUyxDQUFDLEdBQUcsQ0FBQyxFQUNsQixJQUFJLGlDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxnQkFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUNoRSxFQUFFLENBQ0g7YUFDRixDQUFDLENBQ0gsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFJLEtBQUssQ0FBQyxTQUFTLEVBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixPQUFPLE9BQU8sQ0FBQztTQUNoQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztDQUNGO0FBekJELGtDQXlCQyJ9