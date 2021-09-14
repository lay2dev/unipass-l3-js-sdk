"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterInner = exports.RecoveryEmail = exports.RsaPubkey = exports.Rsa = void 0;
const __1 = require("..");
const witness_1 = require("./unipass-v3-jss/witness");
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
        return new __1.Reader(witness_1.SerializeRegisterChildTxInner(this));
    }
}
exports.RegisterInner = RegisterInner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWVzc2FnZS9zaWduLW1lc3NhZ2UtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBNEI7QUFFNUIsc0RBQXlFO0FBTXpFLE1BQWEsR0FBRztJQUNkLFlBQW1CLENBQWMsRUFBUyxDQUFjO1FBQXJDLE1BQUMsR0FBRCxDQUFDLENBQWE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFhO0lBQUcsQ0FBQztDQUM3RDtBQUZELGtCQUVDO0FBRUQsTUFBYSxTQUFTO0lBR3BCLFlBQVksR0FBUTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUFQRCw4QkFPQztBQUNELE1BQWEsYUFBYTtJQUN4QixZQUNTLFNBQWlCLEVBQ2pCLE9BQWUsRUFDZixNQUFxQjtRQUZyQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQzNCLENBQUM7Q0FDTDtBQU5ELHNDQU1DO0FBQ0QsTUFBYSxhQUFhO0lBQ3hCLFlBQ1MsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsTUFBYyxFQUNkLGFBQTRCLEVBQzVCLFNBQXNCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztRQUp4QyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFrQztJQUM5QyxDQUFDO0lBQ0osU0FBUztRQUNQLE9BQU8sSUFBSSxVQUFNLENBQUMsdUNBQTZCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0Y7QUFYRCxzQ0FXQyJ9