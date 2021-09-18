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
            const rsa = new sign_message_base_1.Rsa(new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer, this.inner.pubkey.value.n.reverse().buffer);
            // const inner = new RegisterInner(
            //   new StringReader(this.inner.username).toArrayBuffer(32),
            //   new StringReader(this.inner.registerEmail).toArrayBuffer(32),
            //   new RsaPubkey(rsa),
            //   new RecoveryEmail(1, 1, [
            //     new StringReader(this.inner.registerEmail).toArrayBuffer(32),
            //   ])
            // );
            //
            const inner = new sign_message_base_1.RegisterInner(new __1.StringReader(this.inner.username).toArrayBuffer(32), new __1.StringReader(this.inner.registerEmail).toArrayBuffer(32), new sign_message_base_1.RsaPubkey(rsa), new sign_message_base_1.RecoveryEmail(1, 1, [
                new __1.StringReader(this.inner.registerEmail).toArrayBuffer(32),
            ]));
            const message = inner.serialize().serializeJson();
            return message;
        }
        else {
            throw new Error(`SignError: action  error `);
        }
    }
}
exports.SignMessage = SignMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQUE0RTtBQUM1RSwyREFLNkI7QUFFN0IsTUFBYSxXQUFXO0lBQ3RCLFlBQW9CLEtBQW9CO1FBQXBCLFVBQUssR0FBTCxLQUFLLENBQWU7SUFBRyxDQUFDO0lBQzVDLElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFHLENBQ2pCLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FDM0MsQ0FBQztZQUVGLG1DQUFtQztZQUNuQyw2REFBNkQ7WUFDN0Qsa0VBQWtFO1lBQ2xFLHdCQUF3QjtZQUN4Qiw4QkFBOEI7WUFDOUIsb0VBQW9FO1lBQ3BFLE9BQU87WUFDUCxLQUFLO1lBQ0wsRUFBRTtZQUNGLE1BQU0sS0FBSyxHQUFHLElBQUksaUNBQWEsQ0FDN0IsSUFBSSxnQkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUN2RCxJQUFJLGdCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQzVELElBQUksNkJBQVMsQ0FBQyxHQUFHLENBQUMsRUFDbEIsSUFBSSxpQ0FBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3RCLElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7YUFDN0QsQ0FBQyxDQUNILENBQUM7WUFDRixNQUFNLE9BQU8sR0FBSSxLQUFLLENBQUMsU0FBUyxFQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXpFLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0NBQ0Y7QUFqQ0Qsa0NBaUNDIn0=