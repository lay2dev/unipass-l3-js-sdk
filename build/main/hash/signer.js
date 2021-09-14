"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsaPubkey = exports.Rsa = exports.RegisterInner = exports.RecoveryEmail = void 0;
const __1 = require("..");
class RecoveryEmail {
    constructor(threshold, first_n, emails) {
        this.threshold = threshold;
        this.first_n = first_n;
        this.emails = emails;
    }
}
exports.RecoveryEmail = RecoveryEmail;
class RegisterInner {
    constructor(username, register_email, pubkey, recoveryEmail, source = new ArrayBuffer(0)) {
        this.username = username;
        this.register_email = register_email;
        this.pubkey = pubkey;
        this.recoveryEmail = recoveryEmail;
        this.source = source;
    }
    serialize() {
        return new __1.Reader(__1.SerializeRegisterChildTxInner(this)).serializeJson();
    }
}
exports.RegisterInner = RegisterInner;
class Rsa {
    constructor(e, n) {
        this.e = e;
        this.n = n;
    }
}
exports.Rsa = Rsa;
class RsaPubkey {
    constructor(rsa) {
        this.type = 'RsaPubkey';
        this.value = rsa;
    }
}
exports.RsaPubkey = RsaPubkey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhc2gvc2lnbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBCQUE4RTtBQU85RSxNQUFhLGFBQWE7SUFDeEIsWUFDUyxTQUFpQixFQUNqQixPQUFlLEVBQ2YsTUFBcUI7UUFGckIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsV0FBTSxHQUFOLE1BQU0sQ0FBZTtJQUMzQixDQUFDO0NBQ0w7QUFORCxzQ0FNQztBQUNELE1BQWEsYUFBYTtJQUN4QixZQUNTLFFBQWdCLEVBQ2hCLGNBQXNCLEVBQ3RCLE1BQWMsRUFDZCxhQUE0QixFQUM1QixTQUFzQixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFKeEMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsV0FBTSxHQUFOLE1BQU0sQ0FBa0M7SUFDOUMsQ0FBQztJQUNKLFNBQVM7UUFDUCxPQUNFLElBQUksVUFBTSxDQUFDLGlDQUE2QixDQUFDLElBQUksQ0FBQyxDQUMvQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQWJELHNDQWFDO0FBRUQsTUFBYSxHQUFHO0lBQ2QsWUFBbUIsQ0FBYyxFQUFTLENBQWM7UUFBckMsTUFBQyxHQUFELENBQUMsQ0FBYTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQWE7SUFBRyxDQUFDO0NBQzdEO0FBRkQsa0JBRUM7QUFFRCxNQUFhLFNBQVM7SUFHcEIsWUFBWSxHQUFRO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQVBELDhCQU9DIn0=