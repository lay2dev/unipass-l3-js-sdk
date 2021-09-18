import { StringReader } from '..';
import { RecoveryEmail, RegisterInner, Rsa, RsaPubkey, } from './sign-message-base';
export class SignMessage {
    constructor(inner) {
        this.inner = inner;
    }
    sign() {
        if (this.inner.action == 'register') {
            const rsa = new Rsa(new Uint32Array([this.inner.pubkey.value.e]).reverse().buffer, this.inner.pubkey.value.n.reverse().buffer);
            // const inner = new RegisterInner(
            //   new StringReader(this.inner.username).toArrayBuffer(32),
            //   new StringReader(this.inner.registerEmail).toArrayBuffer(32),
            //   new RsaPubkey(rsa),
            //   new RecoveryEmail(1, 1, [
            //     new StringReader(this.inner.registerEmail).toArrayBuffer(32),
            //   ])
            // );
            //
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2Uvc2lnbi1tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBNEMsWUFBWSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQzVFLE9BQU8sRUFDTCxhQUFhLEVBQ2IsYUFBYSxFQUNiLEdBQUcsRUFDSCxTQUFTLEdBQ1YsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QixNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFvQixLQUFvQjtRQUFwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUM1QyxJQUFJO1FBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQ2pCLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FDM0MsQ0FBQztZQUVGLG1DQUFtQztZQUNuQyw2REFBNkQ7WUFDN0Qsa0VBQWtFO1lBQ2xFLHdCQUF3QjtZQUN4Qiw4QkFBOEI7WUFDOUIsb0VBQW9FO1lBQ3BFLE9BQU87WUFDUCxLQUFLO1lBQ0wsRUFBRTtZQUNGLE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUM3QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFDdkQsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQzVELElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUNsQixJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUN0QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7YUFDN0QsQ0FBQyxDQUNILENBQUM7WUFDRixNQUFNLE9BQU8sR0FBSSxLQUFLLENBQUMsU0FBUyxFQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXpFLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0NBQ0YifQ==