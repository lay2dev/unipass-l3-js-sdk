import { Reader } from '..';
import { SerializeAddLocalKeyChildTxInner, SerializeRegisterChildTxInner, } from './unipass-v3-jss/witness';
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
export class addLocalKeyInner {
    constructor(username, nonce, pubkey) {
        this.username = username;
        this.nonce = nonce;
        this.pubkey = pubkey;
    }
    serialize() {
        return new Reader(SerializeAddLocalKeyChildTxInner(this));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1tZXNzYWdlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWVzc2FnZS9zaWduLW1lc3NhZ2UtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQzVCLE9BQU8sRUFDTCxnQ0FBZ0MsRUFDaEMsNkJBQTZCLEdBQzlCLE1BQU0sMEJBQTBCLENBQUM7QUFNbEMsTUFBTSxPQUFPLEdBQUc7SUFDZCxZQUFtQixDQUFjLEVBQVMsQ0FBYztRQUFyQyxNQUFDLEdBQUQsQ0FBQyxDQUFhO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBYTtJQUFHLENBQUM7Q0FDN0Q7QUFFRCxNQUFNLE9BQU8sU0FBUztJQUdwQixZQUFZLEdBQVE7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBQ0QsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDUyxTQUFpQixFQUNqQixPQUFlLEVBQ2YsTUFBcUI7UUFGckIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsV0FBTSxHQUFOLE1BQU0sQ0FBZTtJQUMzQixDQUFDO0NBQ0w7QUFDRCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUNTLFFBQWdCLEVBQ2hCLGNBQXNCLEVBQ3RCLE1BQWMsRUFDZCxjQUE2QixFQUM3QixTQUFzQixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFKeEMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsV0FBTSxHQUFOLE1BQU0sQ0FBa0M7SUFDOUMsQ0FBQztJQUNKLFNBQVM7UUFDUCxPQUFPLElBQUksTUFBTSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUNTLFFBQWdCLEVBQ2hCLEtBQWEsRUFDYixNQUFjO1FBRmQsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUNwQixDQUFDO0lBQ0osU0FBUztRQUNQLE9BQU8sSUFBSSxNQUFNLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0NBQ0YifQ==