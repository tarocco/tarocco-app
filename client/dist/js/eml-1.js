importScripts('constants.js', 'BigInteger.min.js', 'RSA.js');
const ct = [4940, 21860, 2487, 13954, 25793, 16510, 12876, 19907, 24680, 1393, 24680, 19907];
function decode(arr) {
    let first = 32; // ' '.charCodeAt(0);
    return arr.map(n => String.fromCharCode(n + first)).join('');
}
postMessage(decode(ct.map((c) => RSA.decrypt(c, eml1_d, eml1_n).toJSNumber())));