"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hasher = void 0;
class Hasher {
    constructor(h) {
        this.h = h;
    }
    setH(h) {
        this.h = h;
    }
    hash(data) {
        return this.update(data).digest();
    }
}
exports.Hasher = Hasher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhc2gvaGFzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFBLE1BQXNCLE1BQU07SUFDMUIsWUFBc0IsQ0FBYTtRQUFiLE1BQUMsR0FBRCxDQUFDLENBQVk7SUFBRyxDQUFDO0lBTTdCLElBQUksQ0FBQyxDQUFhO1FBQzFCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELElBQUksQ0FDRixJQUErRDtRQUUvRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEMsQ0FBQztDQUNGO0FBZkQsd0JBZUMifQ==