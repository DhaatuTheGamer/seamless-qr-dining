/**
 * Security utilities for client-side data protection.
 * Uses the Web Crypto API (AES-GCM) to encrypt/decrypt sensitive data in localStorage.
 */

// In a production environment, this should be sourced from an environment variable.
// Note: Client-side encryption is a deterrent against simple XSS but not a substitute for backend security.
const ENCRYPTION_KEY_SECRET = "seamless-dining-secure-storage-key-v1";
const SALT = "dining-salt-2024";

let memoizedKey: CryptoKey | null = null;

/**
 * Derives a CryptoKey from the secret for AES-GCM encryption.
 */
async function getKey(): Promise<CryptoKey> {
    if (memoizedKey) return memoizedKey;

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(ENCRYPTION_KEY_SECRET),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    memoizedKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(SALT),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    return memoizedKey;
}

/**
 * Encrypts an object or value using AES-GCM.
 *
 * @param data - The data to encrypt.
 * @returns A promise that resolves to a base64-encoded string containing the IV and ciphertext.
 */
export async function encryptData(data: any): Promise<string> {
    if (data === null || data === undefined) return "";

    try {
        const text = JSON.stringify(data);
        const enc = new TextEncoder();
        const encodedData = enc.encode(text);

        const key = await getKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const ciphertext = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encodedData
        );

        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(ciphertext), iv.length);

        // Convert to base64
        return btoa(Array.from(combined, byte => String.fromCharCode(byte)).join(''));
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Failed to secure data");
    }
}

/**
 * Decrypts a base64-encoded string using AES-GCM.
 *
 * @param encryptedBase64 - The encrypted data string.
 * @returns A promise that resolves to the decrypted data, or null if decryption fails.
 */
export async function decryptData(encryptedBase64: string): Promise<any> {
    if (!encryptedBase64) return null;

    try {
        // Convert from base64
        const binaryString = atob(encryptedBase64);
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            combined[i] = binaryString.charCodeAt(i);
        }

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const key = await getKey();
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );

        const dec = new TextDecoder();
        return JSON.parse(dec.decode(decrypted));
    } catch (error) {
        // This might happen if the data in localStorage is not encrypted (e.g., from an older version)
        // or if the key/IV is invalid.
        console.warn("Decryption failed. Data might be corrupted or unencrypted:", error);
        return null;
    }
}
