require('@testing-library/jest-dom');
const { webcrypto } = require('node:crypto');
const { TextEncoder, TextDecoder } = require('util');

if (!global.crypto || !global.crypto.subtle) {
    Object.defineProperty(global, 'crypto', {
        value: webcrypto,
        writable: true
    });
}
if (!global.TextEncoder) {
    global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
    global.TextDecoder = TextDecoder;
}
