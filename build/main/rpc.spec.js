"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
const uri = 'http://112.124.64.189:3030';
const rpc = new _1.RPC(uri);
const raw = {
    inner: {
        nonce: '0x1',
        type: 'register',
        action: {
            register_email: 'johnz@lay2.dev',
            pubkey: '0x01415498a39E37B7C17b586AB8AB77BE0B518DBDFc',
            recovery_email: null,
            quick_login: true,
        },
    },
    sig: '...email boy...',
};
const inner = {
    inner: {
        type: 'register',
        nonce: '0x1',
        username: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        action: {
            registerEmail: '0xbfc870f1e9b53944a79509409b9f1c739cb674145d63dda8f753811a8e8b984a',
            quick_login: false,
            pubkey: {
                rsaPubkey: {
                    e: 65537,
                    n: '0xc686b98fcdce07eb6c938c010b19dabae7bbfecb6cde8c45c533ab01f740536fd8de2de63395eebfc0c4a3f3ebcd2f60a7debdfd8aa86a592b6a51c135c3bbd8f195f8aef02db7e3eac04d3fff6dff69f6e90f48a31df80c1a5a92adeb051e1dd3242c8adf22259151eda9ce47169f1f198fa634e6e38de4df26738e38dd921269ac01acb7f74c329d93e1353a98aaa5cdae3e6c78ca615955f20adb1058046429542755c3151abade06e0af6470b088ff1781227999e60b17a214b8887739396f699c889125cf4c0dec45190fb079f11b0fec4c204875be6d66f8ad3a5e1523d5017b8989346ad91e7988942b008e6517c1ca1c2a71630e1e9096569583a181',
                },
            },
            recoveryEmail: {
                threshold: 1,
                firstN: 1,
                emails: [
                    '0xbfc870f1e9b53944a79509409b9f1c739cb674145d63dda8f753811a8e8b984a',
                ],
            },
        },
    },
    sig: {
        signature: '0x6fa7e54133ac96dccbf8114ddb1422023508f9a65724211026944cb3d85a7b9d3af7dc511ac37fd1dc6bbfbacd95d9f2efbda3f02f37b912cc708c8a4e974e374c3e9a52c86c75353faf843cd256acf385faac161acd40a01cd6f4046d01aa0f9343151f4a44387329e4ddb3eecc78ccafe4f93966d857273267ccba8b194ad1964510b4d93df7d99b1d1fdd5655f671720384af7d938cfbf12edad4e41228f73f82a5a7c33e13a88f4446c5e8fab6b5a5743bcdd0f8dab0a7e7080504860b367d89a1916fcf123173d3b17209e0bf0a7a637d25abb21c78438c78728f9a252370135c01955703dbd302d26624e16cdd962d66e3b683ba10968b00fa190d0ff5',
        emailHeader: 'Received: from 149.72.34.116 (unknown [149.72.34.116])\n\tby newmx3.qq.com (NewMx) with SMTP id \n\tfor <hi.ellen@qq.com>; Wed, 22 Sep 2021 19:50:59 +0800\nX-QQ-FEAT: VZ9o1bCAgxXKbNNOz3kylTBWnO5VYKEtjrRN0dgbdTw=\nX-QQ-MAILINFO: Nj4k/6lmmRCSuPQccq+PVeaayFyVE4PaPQ1ctUowAjpCQq5TZWfvV8KmG\n\tGLygcUoixhWwZKoK2wsetY+nLZhkyDoiAz8083wznO7GgLxlnttHuhusYEd2EVyoXnSjhXE\n\t4K4LI0+k2ziW\nX-QQ-mid: mxsza19t1632311457txdanfjhi\nX-QQ-CSender: bounces+21873558-4980-hi.ellen=qq.com@em4908.mail0.unipass.me\nX-QQ-ORGSender: bounces+21873558-4980-hi.ellen=qq.com@em4908.mail0.unipass.me\nX-QQ-XMAILINFO: OUMxvQDaATiejMvbwUMD4W8Ne3CgEcXOdj4lJJkmyBI3cEDRF5Qm+Zi4m5B/32\n\t iTRxsKsPcbkXa1QvbZYW6mth5oTd+1eDRf9lB6ggWlz7FlpOe5HIze2GrIacnVHvtNdndYOMd4D4\n\t GXnU7gbIELZk2Jq7q8c0PyVvpGdq5LwInXiHXTvta6QAXRR0hRaoxu+WBze2jIAsCImtQm2I3aIi\n\t ag4M+/83pM5NihoTWUOhnJorZ469RYy5mqyAIBITY2IVov8RFKKAiKsREC9kRputf/BQA8DOWMom\n\t uELPN2hYDNuK9lwCe6mkkGB6dMhxsb7xkdnf9Gc/M6ot7zLuJaWzotVsIHnbL4Ka0PztTAavSQmV\n\t DbdKJAGJiycJmXoNPRX5zTX5rkGNwVX4YDnIWceJFDCjrBY0FXak7REaqN9TNQI3/BBlXd3ajTaS\n\t eBy1tZg+n9sL0i310dAXzdUNjia0I+huEPsIfbgeY/aKhLQTRllUoglqxVS+b3OC+q97oXYAFyz2\n\t 4mZiwtgyVaDQdEmmMeqEWpvVTGT9Arkg8inazz0M41eUtTcKTvbVI1DcvtcygldrC2/p6+Z67V+3\n\t eeIMw9D2spRakYrMrNwFVEI02aF1EE40l2VGoDIemdCAPq3ybafJnilDfi2sYgj12UxKndcmZXsA\n\t H2frxea4Cn3Nf+6nlVN0LlfA6aswo8lHkA0DqIeimoYgf8Yu+flyUygPY4gjeRrvmnm5k5jRwlJt\n\t ibxoQh/6hP6rv7dcORv5z//VDvxOJnWpEuwPlMQRiSy/Fu23nPqyKXpruIpOPg05PLtn6vSPHxiz\n\t K3F4gbS8xxjnvd9oj3/Es08GMAOH8TDpcTx9C+Wm15WvqRpo11fkeZxmKJJD1h7jmArUytkg4GoA\n\t qZvDdbVxGJ8ug5QWzL5ahwfFslY/DlqByuYjLM6ot1mQwM3P64fP0OwunEJyl4UKpsql6V2P8rEA\n\t a8XD+98UkR2pTgk9X86VPcX9zOiyc9i5IGNKrzZbc=\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=mail0.unipass.me;\n\th=content-type:from:mime-version:subject:to;\n\ts=s1; bh=5ddZjKAJHDGrED65EUZW1VG0PvQmtau+Vr5LhPsiSjs=;\n\tb=dzuowvnxmLEIj6X8j3iaSplD6BwzOZor69guzVUeHIvV5YJ3e5molZvR/d8h9JdeEYWK\n\tKMXpt6TD/vRXtcr+4cLDbDLZvVEJa1fuXV5p/jXMPOZ25YgOgE3CAMwUCh5JQXHfLP9QAG\n\tgaF/DYIlRvN+glrwMRJvkTthVXO9RU5CsHnqnWxmAkvAX9kc2O/RCnKyG+2hQWri+6FfYK\n\ts2OaTvqFUVgsAgX/SxqlZRe3nIZljP2+w2xaLIrB/8awu0BF/g2O6vaaespKDfBYJQt8zR\n\t+lfXKexvVGLje/b6Vt21wTXSLUD4As6G8CDNdjSoI48YUTPO/eEAp0/P0hkkYIww==\nReceived: by filterdrecv-75ff7b5ffb-ndqvq with SMTP id filterdrecv-75ff7b5ffb-ndqvq-1-614B18A0-62\n        2021-09-22 11:50:57.130535424 +0000 UTC m=+1776635.730931153\nX-SG-Ot-Tracer-Traceid: c4460b8a112e363\nX-SG-Ot-Tracer-Spanid: 393aacae757145ac\nReceived: from MjE4NzM1NTg (unknown)\n\tby geopod-ismtpd-4-2 (SG) with HTTP\n\tid jGBcpTm2SRSi4Pbdb9idtg\n\tWed, 22 Sep 2021 11:50:56.687 +0000 (UTC)\nContent-Type: multipart/alternative; boundary=be38946ad49421cf006e70e4591bc86a1e3a6bb5208a0b58bcc822b82834\nDate: Wed, 22 Sep 2021 11:50:57 +0000 (UTC)\nFrom: =?utf-8?b?VW5pcGFzcy5tZeWboumYnw==?= <noreply@mail0.unipass.me>\nMime-Version: 1.0\nMessage-ID: <jGBcpTm2SRSi4Pbdb9idtg@geopod-ismtpd-4-2>\nSubject: \n UniPass0xb6d32fc07d1152af566db6a254295d42bad499e10ee1336da372ed3c427195a3\nX-SG-EID: \n =?us-ascii?Q?0o7=2F29m45niS+AvypjS+n2eT2Rj4KAGnwRRN8HEESUVIF64zzDsre1HhN6r=2F57?=\n =?us-ascii?Q?JpBwUl2MDwCa9jnFMgY1PgYBnBTEqOIG6mIb3tJ?=\n =?us-ascii?Q?Wa0wSwCS3K2aXEVXMkPNXGtLpn8L8qzU7AZ=2FAqY?=\n =?us-ascii?Q?yorUAJbubSKX80LrrBWFgjzffypl3IedxroTXuC?=\n =?us-ascii?Q?t7LUGQwZEm40MPjkdzQ2t6ZvVmS0xB9SdK6tHVh?=\n =?us-ascii?Q?h1Uj9ysGFxlVs7jtAv05dVmJ8ZedAFMuSiDbFN?=\nTo: hi.ellen@qq.com\nX-Entity-ID: N8xIRc7lzsQF+nuoetUsGw==\n\n Unipass Test',
    },
};
// test('test aggregator rpc get_user_info', async (t) => {
//   const data = await rpc.get_user_info(
//     hashData('aven1'),
//     hashData('751733381@qq.com')
//   );
//   console.log(data);
//   t.is(true, true);
// });
// test('test aggregator rpc get_up_transaction_by_hash', async (t) => {
//   const data = await rpc.get_up_transaction_by_hash(
//     '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'
//   );
//   t.is(true, true);
// });
ava_1.default('test aggregator rpc get_up_nonce', async (t) => {
    const data = await rpc.get_up_nonce(_1.hashData('aven'));
    t.is(true, true);
});
// test('test aggregator rpc get_up_transaction_history', async (t) => {
//   const data = await rpc.get_up_transaction_history('johnz');
//   t.is(true, true);
// });
// test('test  rpc send_up_transaction', async (t) => {
//   const data = await rpc.send_up_transaction(raw);
//   t.is(true, true);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnBjLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFDdkIsd0JBQWtDO0FBRWxDLE1BQU0sR0FBRyxHQUFHLDRCQUE0QixDQUFDO0FBQ3pDLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXpCLE1BQU0sR0FBRyxHQUFHO0lBQ1YsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLEtBQUs7UUFDWixJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUU7WUFDTixjQUFjLEVBQUUsZ0JBQWdCO1lBQ2hDLE1BQU0sRUFBRSw4Q0FBOEM7WUFDdEQsY0FBYyxFQUFFLElBQUk7WUFDcEIsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRjtJQUNELEdBQUcsRUFBRSxpQkFBaUI7Q0FDdkIsQ0FBQztBQUNGLE1BQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLFVBQVU7UUFDaEIsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQ04sb0VBQW9FO1FBQ3RFLE1BQU0sRUFBRTtZQUNOLGFBQWEsRUFDWCxvRUFBb0U7WUFDdEUsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRTtvQkFDVCxDQUFDLEVBQUUsS0FBSztvQkFDUixDQUFDLEVBQUUsb2dCQUFvZ0I7aUJBQ3hnQjthQUNGO1lBQ0QsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxDQUFDO2dCQUNULE1BQU0sRUFBRTtvQkFDTixvRUFBb0U7aUJBQ3JFO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsU0FBUyxFQUNQLG9nQkFBb2dCO1FBQ3RnQixXQUFXLEVBQ1QsMDRHQUEwNEc7S0FDNzRHO0NBQ0YsQ0FBQztBQUVGLDJEQUEyRDtBQUMzRCwwQ0FBMEM7QUFDMUMseUJBQXlCO0FBQ3pCLG1DQUFtQztBQUNuQyxPQUFPO0FBQ1AsdUJBQXVCO0FBQ3ZCLHNCQUFzQjtBQUN0QixNQUFNO0FBRU4sd0VBQXdFO0FBQ3hFLHVEQUF1RDtBQUN2RCwyRUFBMkU7QUFDM0UsT0FBTztBQUNQLHNCQUFzQjtBQUN0QixNQUFNO0FBRU4sYUFBSSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNuRCxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUM7QUFFSCx3RUFBd0U7QUFDeEUsZ0VBQWdFO0FBQ2hFLHNCQUFzQjtBQUN0QixNQUFNO0FBRU4sdURBQXVEO0FBQ3ZELHFEQUFxRDtBQUNyRCxzQkFBc0I7QUFDdEIsTUFBTSJ9