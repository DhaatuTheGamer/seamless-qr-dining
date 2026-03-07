require('@testing-library/jest-dom');
const { webcrypto } = require('node:crypto');

if (!global.crypto) {
    global.crypto = webcrypto;
} else if (!global.crypto.subtle) {
    global.crypto.subtle = webcrypto.subtle;
}

if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
    global.TextDecoder = require('util').TextDecoder;
}
