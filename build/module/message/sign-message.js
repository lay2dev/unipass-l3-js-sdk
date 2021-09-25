import { hashData, StringReader, } from '..';
import { addLocalKeyInner, deleteLocalKeyInner, RecoveryEmail, RegisterInner, Rsa, RsaPubkey, updateQuickLoginInner, UpdateRecoveryEmailInner, } from './sign-message-base';
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
        else if (this.inner.action == 'add_key') {
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
        else if (this.inner.action == 'delete_key') {
            if (!this.inner.nonce) {
                throw new Error(`SignMessageError: not find nonce `);
            }
            if (!this.inner.nonce.startsWith('0x')) {
                throw new Error(`SignMessageError: nonce not hex data`);
            }
            const inner = new deleteLocalKeyInner(new StringReader(hashData(this.inner.username)).toArrayBuffer(32), new StringReader(this.inner.nonce).toArrayBuffer(4), pubkey);
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
            const inner = new UpdateRecoveryEmailInner(new StringReader(hashData(this.inner.username)).toArrayBuffer(32), new StringReader(this.inner.nonce).toArrayBuffer(4), new RecoveryEmail(1, 1, [
                new StringReader(hashData(this.inner.recoveryEmail)).toArrayBuffer(32),
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
            const inner = new updateQuickLoginInner(new StringReader(hashData(this.inner.username)).toArrayBuffer(32), new StringReader(this.inner.nonce).toArrayBuffer(4), Number(this.inner.quickLogin));
            const message = inner.serialize().serializeJson();
            return message;
        }
        else {
            throw new Error(`SignMessageError: action error`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxRQUFRLEVBR1IsWUFBWSxHQUNiLE1BQU0sSUFBSSxDQUFDO0FBQ1osT0FBTyxFQUNMLGdCQUFnQixFQUNoQixtQkFBbUIsRUFDbkIsYUFBYSxFQUNiLGFBQWEsRUFDYixHQUFHLEVBQ0gsU0FBUyxFQUNULHFCQUFxQixFQUNyQix3QkFBd0IsR0FDekIsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QixNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFvQixLQUFvQjtRQUFwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUM1QyxXQUFXO1FBQ1QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQ2pCLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxQixDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7YUFDOUQ7WUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsQ0FDN0IsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxD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