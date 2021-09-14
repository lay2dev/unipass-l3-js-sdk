import { Reader, SerializeRegisterChildTxInner } from '..';
export class RecoveryEmail {
    constructor(threshold, first_n, emails) {
        this.threshold = threshold;
        this.first_n = first_n;
        this.emails = emails;
    }
}
export class RegisterInner {
    constructor(username, register_email, pubkey, recoveryEmail, source = new ArrayBuffer(0)) {
        this.username = username;
        this.register_email = register_email;
        this.pubkey = pubkey;
        this.recoveryEmail = recoveryEmail;
        this.source = source;
    }
    serialize() {
        return new Reader(SerializeRegisterChildTxInner(this)).serializeJson();
    }
}
export class Rsa {
    constructor(e, n) {
        this.e = e;
        this.n = n;
    }
}
export class RsaPubkey {
    constructor(rsa) {
        this.type = 'RsaPubkey';
        this.value = rsa;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhc2gvc2lnbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBcUIsTUFBTSxFQUFFLDZCQUE2QixFQUFFLE1BQU0sSUFBSSxDQUFDO0FBTzlFLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQ1MsU0FBaUIsRUFDakIsT0FBZSxFQUNmLE1BQXFCO1FBRnJCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFdBQU0sR0FBTixNQUFNLENBQWU7SUFDM0IsQ0FBQztDQUNMO0FBQ0QsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDUyxRQUFnQixFQUNoQixjQUFzQixFQUN0QixNQUFjLEVBQ2QsYUFBNEIsRUFDNUIsU0FBc0IsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBSnhDLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLFdBQU0sR0FBTixNQUFNLENBQWtDO0lBQzlDLENBQUM7SUFDSixTQUFTO1FBQ1AsT0FDRSxJQUFJLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsQ0FDL0MsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNwQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sR0FBRztJQUNkLFlBQW1CLENBQWMsRUFBUyxDQUFjO1FBQXJDLE1BQUMsR0FBRCxDQUFDLENBQWE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFhO0lBQUcsQ0FBQztDQUM3RDtBQUVELE1BQU0sT0FBTyxTQUFTO0lBR3BCLFlBQVksR0FBUTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0NBQ0YifQ==