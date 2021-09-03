import { Hasher } from '.';
import keccak from 'keccak';
import { ArrayBufferReader, HexStringReader } from '../reader';
export class Keccak256Hasher extends Hasher {
    constructor() {
        super(keccak('keccak256'));
    }
    update(data) {
        let array;
        if (data instanceof ArrayBufferReader || data instanceof HexStringReader) {
            /** Reader type params not enter this branch, it's weired */
            array = Buffer.from(data.serializeJson().replace('0x', ''));
        }
        else if (data instanceof ArrayBuffer) {
            array = Buffer.from(new Uint8Array(data));
        }
        else if (typeof data === 'string') {
            array = Buffer.from(data);
        }
        else {
            array = Buffer.from(new Uint8Array(new ArrayBufferReader(data).toArrayBuffer()));
        }
        this.h.update(array);
        return this;
    }
    digest() {
        const hex = '0x' + this.h.digest('hex').toString();
        return new HexStringReader(hex);
    }
    reset() {
        this.h = keccak('keccak256');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VjY2FrMjU2LWhhc2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYXNoL2tlY2NhazI1Ni1oYXNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQztBQUMzQixPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUvRCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxNQUFNO0lBQ3pDO1FBQ0UsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNLENBQ0osSUFBZ0U7UUFFaEUsSUFBSSxLQUFhLENBQUM7UUFDbEIsSUFBSSxJQUFJLFlBQVksaUJBQWlCLElBQUksSUFBSSxZQUFZLGVBQWUsRUFBRTtZQUN4RSw0REFBNEQ7WUFDNUQsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3RDthQUFNLElBQUksSUFBSSxZQUFZLFdBQVcsRUFBRTtZQUN0QyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQzNDO2FBQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDbkMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUNqQixJQUFJLFVBQVUsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQzVELENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsT0FBTyxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRiJ9