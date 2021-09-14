"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterMessage = void 0;
const __1 = require("..");
class RegisterMessage {
    constructor(inner) {
        this.inner = inner;
    }
    sign() {
        const rsa = new __1.Rsa(new __1.StringReader(this.inner.pubkey.value.e).toArrayBuffer(4), new __1.StringReader(this.inner.pubkey.value.n).toArrayBuffer(256));
        const inner = new __1.RegisterInner(new __1.StringReader(this.inner.username).toArrayBuffer(32), new __1.StringReader(this.inner.registerEmail).toArrayBuffer(32), new __1.RsaPubkey(rsa), new __1.RecoveryEmail(1, 1, [
            new __1.StringReader(this.inner.registerEmail).toArrayBuffer(32),
        ]));
        console.log(inner);
        const message = inner.serialize();
        console.log('---message------', message);
        return message;
    }
}
exports.RegisterMessage = RegisterMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQU9ZO0FBRVosTUFBYSxlQUFlO0lBQzFCLFlBQW9CLEtBQW9CO1FBQXBCLFVBQUssR0FBTCxLQUFLLENBQWU7SUFBRyxDQUFDO0lBQzVDLElBQUk7UUFDRixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQUcsQ0FDakIsSUFBSSxnQkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQzVELElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUMvRCxDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBYSxDQUM3QixJQUFJLGdCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQ3ZELElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFDNUQsSUFBSSxhQUFTLENBQUMsR0FBRyxDQUFDLEVBQ2xCLElBQUksaUJBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3RCLElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7U0FDN0QsQ0FBQyxDQUNILENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQXJCRCwwQ0FxQkMifQ==