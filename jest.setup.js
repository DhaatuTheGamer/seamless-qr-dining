require('@testing-library/jest-dom');
const { webcrypto } = require('node:crypto');

if (!global.crypto) {
    global.crypto = webcrypto;
}
