import { Reader } from '..';
import { SerializeRegisterChildTxInner } from './unipass-v3-jss/witness';
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
export class RecoveryEmail {
    constructor(threshold, first_n, emails) {
        this.threshold = threshold;
        this.first_n = first_n;
        this.emails = emails;
    }
}
export class RegisterInner {
    constructor(username, register_email, pubkey, recovery_email, source = new ArrayBuffer(0)) {
        this.username = username;
        this.register_email = register_email;
        this.pubkey = pubkey;
        this.recovery_email = recovery_email;
        this.source = source;
    }
    serialize() {
        return new Reader(SerializeRegisterChildTxInner(this));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWVzc2FnZS9zaWduLW1lc3NhZ2UtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQzVCLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBTXpFLE1BQU0sT0FBTyxHQUFHO0lBQ2QsWUFBbUIsQ0FBYyxFQUFTLENBQWM7UUFBckMsTUFBQyxHQUFELENBQUMsQ0FBYTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQWE7SUFBRyxDQUFDO0NBQzdEO0FBRUQsTUFBTSxPQUFPLFNBQVM7SUFHcEIsWUFBWSxHQUFRO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQUNELE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQ1MsU0FBaUIsRUFDakIsT0FBZSxFQUNmLE1BQXFCO1FBRnJCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFdBQU0sR0FBTixNQUFNLENBQWU7SUFDM0IsQ0FBQztDQUNMO0FBQ0QsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDUyxRQUFnQixFQUNoQixjQUFzQixFQUN0QixNQUFjLEVBQ2QsY0FBNkIsRUFDN0IsU0FBc0IsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBSnhDLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLFdBQU0sR0FBTixNQUFNLENBQWtDO0lBQzlDLENBQUM7SUFDSixTQUFTO1FBQ1AsT0FBTyxJQUFJLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDRiJ9