require('@testing-library/jest-dom');
const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('util');

if (!global.crypto || !global.crypto.subtle) {
    Object.defineProperty(global, 'crypto', {
        value: crypto.webcrypto,
        writable: true
    });
}
if (!global.TextEncoder) {
    global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
    global.TextDecoder = TextDecoder;
}
