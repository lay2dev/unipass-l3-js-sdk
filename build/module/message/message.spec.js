import test from 'ava';
import { SignMessage } from './sign-message';
const rawData = {
    action: 'register',
    username: 'aven',
    pubkey: null,
    registerEmail: 's@qq.com',
};
function initPubkey() {
    const NodeRSA = require('node-rsa');
    const key = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEogIBAAKCAQEA0i4KvHsZ2DjpVMvG9hYCloaxTy+2hIyAvNjIz/mkkbDafqFg\n' +
        'ock0UrjEWmpbzsYryg3PGBwHuXJ6E9rVG3Gf9Vwkrgx64/eGhnlJbslQooaSJJKv\n' +
        'xh6bM1D4BQGqDM6sAeFZXgn4XKsOV5Au5pjC2DxPr2YylN/lf0sQFYd5vy4OPHj8\n' +
        'xSr6nrU/zSamnbqMGJsDmuUqq4NHUas1s9/Z9WzHU22z4SYflCkghe+6YfNJX/Kc\n' +
        'ip9YrKnMu5qxV6XvhH4CUKUQfCBpYknRNsn62QLKqSvcadaIGa/wgH92dKlM3Wv8\n' +
        '1nQi9+sn+MqcCRnwb/w8dq3hynXxcnXDuKt8bwIDAQABAoIBABgcTAL/JCHXtXyS\n' +
        'u8ozECzwWpq44HkoHQSM4cxp2OUVoprwLEOi7yumInA0zz9TIGbXWrBrVr+BUFvC\n' +
        'uLujNzRQU6zbpaVNGdOHSlM5KNTcFxu28A8MJ8WlPi5k2HsLolO85CGThzgqL0UA\n' +
        'N0EguQlRMdrvIFJPtOX7WGb/2YmCq7aShsNagBrePYo5hIts7cdBCsprVv+/NO3r\n' +
        '9fnoEz8EeMmF+oRiPBQzuV2wY/AKPHhK5vPVahZinbDaHzMfRyCR1YgjN+aZGmlR\n' +
        'ZOGxM/k85qoD1gzoQ+gbJovv3oro9EEe9NFQ9EPxUozutgQuVqFDjSXLKIIyFI4f\n' +
        'ocwRqBECgYEA9R27+W6rP2AjnppyrphuZfsdPJO9iLrMorQfUEcKQe1sFE6X24GE\n' +
        'zA0aYRcKab6fT+bzpsPK6gc31PsWtzjtyJJK63RrUCchf1AW+lLvvCuCmXy1aQX7\n' +
        '2Gg+/opfNOPdrgc1/GV1IqiSkQnP5Dcq+8SsfJhjSCfqw6Re1g4aXasCgYEA24Mu\n' +
        'sy86fSfg9L6v7K7146PmLZwXlHyolzqP6vItv4/g1WlC8ffQtdqPEadck5GdgjS1\n' +
        'tOrYC1vNOTeiattH6NdVi8tg6Mqk2PZ8uYAlgqE2Xxy2vOqNOahY81rEtYTTjIOy\n' +
        'XDw5T9LvfVFp5fayc9TZKvLqkHaHaF3qzNnH8E0CgYB8ROjqGquDY/BrFo6R6gH+\n' +
        'fgNilNyAl4Pr8Tn27y1KI16qJPZkeROkh/gZxR6oYdZPIh3hLF6Rq7sopWvs1FXp\n' +
        'XBHTsaA+cLhQ3X/oxWd5lO2Pd2RZrIj0PFXDos+F9wiKlGlQXve17JTyJ3FYmIeY\n' +
        'QSvZt0COcn5ZVdom19uSJQKBgGVsqoI+Wy8C4w0SomSgvppM24jNa5O/OYKOm3q6\n' +
        'JWsyhnb06Oq2TygHcT197+d7S6SiyCZssCAnbZ53V0M6SHKMNEmgUgmdwCdDVIO9\n' +
        'cxd1d5LgyIpncZNndpoSoXshgUGWhC3b4btBQkjL+js4DmI4wZL3pGvVaGFPq7K1\n' +
        'GY2tAoGARugtayfujDrYMiwfrQL4kbh7dOv62cKpeRPB3/YBuFNJ7l7uWo/M/DJT\n' +
        'k/iV4IzeX8o6FzI9GXCj/TwIXLofZi9ENOg6kLSYI6YqmYHG3f0ZNDQfceN5d7j3\n' +
        'pYftxwl9EbsnXUW8tL90UbPB2nI0z6IqJOtg+XOzEH/u7n8EK+I=\n' +
        '-----END RSA PRIVATE KEY-----');
    const keyObject = key.exportKey('components');
    const n = new Uint8Array(keyObject.n.slice(1));
    rawData.pubkey = { type: 'RsaPubkey', value: { e: keyObject.e, n } };
}
test('test Transaction getSignMessage validate', async (t) => {
    initPubkey();
    console.log(rawData);
    const data = new SignMessage(rawData);
    const signMessage = await data.sign();
    console.log(signMessage);
    t.is(signMessage.length, 748);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21lc3NhZ2UvbWVzc2FnZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHN0MsTUFBTSxPQUFPLEdBQUc7SUFDZCxNQUFNLEVBQUUsVUFBVTtJQUNsQixRQUFRLEVBQUUsTUFBTTtJQUNoQixNQUFNLEVBQUUsSUFBSTtJQUNaLGFBQWEsRUFBRSxVQUFVO0NBQzFCLENBQUM7QUFFRixTQUFTLFVBQVU7SUFDakIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUNyQixtQ0FBbUM7UUFDakMsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsd0RBQXdEO1FBQ3hELCtCQUErQixDQUNsQyxDQUFDO0lBQ0YsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9DLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDdkUsQ0FBQztBQUVELElBQUksQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDM0QsVUFBVSxFQUFFLENBQUM7SUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQyxDQUFDIn0=