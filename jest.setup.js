require('@testing-library/jest-dom');
const crypto = require('node:crypto');
const { TextEncoder, TextDecoder } = require('util');

if (!global.crypto) {
    global.crypto = crypto.webcrypto;
} else if (!global.crypto.subtle) {
    global.crypto.subtle = crypto.webcrypto.subtle;
    global.crypto.getRandomValues = crypto.webcrypto.getRandomValues.bind(crypto.webcrypto);
}

if (!global.TextEncoder) {
    global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
    global.TextDecoder = TextDecoder;
}
