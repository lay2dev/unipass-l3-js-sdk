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
        else if (this.inner.action == 'add_key') {
            if (!this.inner.nonce) {
                throw new Error(`SignMessageError: not find nonce `);
            }
            if (!this.inner.nonce.startsWith('0x')) {
                throw new Error(`SignMessageError: nonce not hex data`);
            }
            const inner = new sign_message_base_1.addLocalKeyInner(new __1.StringReader(__1.hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(this.inner.nonce).toArrayBuffer(4), pubkey);
            const message = inner.serialize().serializeJson();
            return message;
        }
        else if (this.inner.action == 'delete_key') {
            if (!this.inner.nonce) {
                throw new Error(`SignMessageError: not find nonce `);
            }
            if (!this.inner.nonce.startsWith('0x')) {
                throw new Error(`SignMessageError: nonce not hex data`);
            }
            const inner = new sign_message_base_1.deleteLocalKeyInner(new __1.StringReader(__1.hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(this.inner.nonce).toArrayBuffer(4), pubkey);
            const message = inner.serialize().serializeJson();
            return message;
        }
        else if (this.inner.action == 'update_recovery_email') {
            if (!this.inner.nonce) {
                throw new Error(`SignMessageError: not find nonce `);
            }
            if (!this.inner.nonce.startsWith('0x')) {
                throw new Error(`SignMessageError: nonce not hex data`);
            }
            const inner = new sign_message_base_1.UpdateRecoveryEmailInner(new __1.StringReader(__1.hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(this.inner.nonce).toArrayBuffer(4), new sign_message_base_1.RecoveryEmail(1, 1, [
                new __1.StringReader(__1.hashData(this.inner.recoveryEmail)).toArrayBuffer(32),
            ]));
            const message = inner.serialize().serializeJson();
            return message;
        }
        else if (this.inner.action == 'update_quick_login') {
            if (!this.inner.nonce) {
                throw new Error(`SignMessageError: not find nonce `);
            }
            if (!this.inner.nonce.startsWith('0x')) {
                throw new Error(`SignMessageError: nonce not hex data`);
            }
            const inner = new sign_message_base_1.updateQuickLoginInner(new __1.StringReader(__1.hashData(this.inner.username)).toArrayBuffer(32), new __1.StringReader(this.inner.nonce).toArrayBuffer(4), Number(this.inner.quickLogin));
            const message = inner.serialize().serializeJson();
            return message;
        }
        else {
            throw new Error(`SignMessageError: action error`);
        }
    }
}
exports.SignMessage = SignMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQU1ZO0FBQ1osMkRBUzZCO0FBRTdCLE1BQWEsV0FBVztJQUN0QixZQUFvQixLQUFvQjtRQUFwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUM1QyxXQUFXO1FBQ1QsTUFBTSxHQUFHLEdBQUcsSUFBSSx1QkFBRyxDQUNqQixJQUFJLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFDN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDMUIsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksNkJBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQzthQUM5RDtZQUNELE1BQU0sS0FBSyxHQUFHLElBQUksaUNBQWEsQ0FDN0IsSUFBSSxnQkFBWSxDQUFDLFlBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUNqRSxJQUFJLGdCQUFZLENBQUMsWUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ3RFLE1BQU0sRUFDTixJQUFJLGlDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtn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