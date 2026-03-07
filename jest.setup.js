require('@testing-library/jest-dom');
const { webcrypto } = require('node:crypto');

if (typeof global.crypto === 'undefined' || !global.crypto.subtle) {
    Object.defineProperty(global, 'crypto', {
        value: webcrypto,
        configurable: true,
        enumerable: true,
        writable: true
    });
}

if (typeof TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}
