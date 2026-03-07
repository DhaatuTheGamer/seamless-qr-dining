require('@testing-library/jest-dom');
const { webcrypto } = require('node:crypto');
const { TextEncoder, TextDecoder } = require('util');

if (!global.crypto) {
    global.crypto = {
        subtle: webcrypto.subtle,
        getRandomValues: webcrypto.getRandomValues.bind(webcrypto)
    };
}

if (!global.TextEncoder) {
    global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
    global.TextDecoder = TextDecoder;
}
