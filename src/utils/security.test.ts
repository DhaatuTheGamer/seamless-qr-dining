import { encryptData, decryptData } from './security';

describe('encryptData', () => {
    it('returns an empty string when data is null', async () => {
        const result = await encryptData(null);
        expect(result).toBe('');
    });

    it('returns an empty string when data is undefined', async () => {
        const result = await encryptData(undefined);
        expect(result).toBe('');
    });

    it('encrypts a string and returns a base64 string', async () => {
        const data = "test string";
        const result = await encryptData(data);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // It should be a valid base64 string
        expect(() => atob(result)).not.toThrow();

        // Verify it can be decrypted back
        const decrypted = await decryptData(result);
        expect(decrypted).toEqual(data);
    });

    it('encrypts an object and returns a base64 string', async () => {
        const data = { id: 1, name: "Test User" };
        const result = await encryptData(data);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // Verify it can be decrypted back
        const decrypted = await decryptData(result);
        expect(decrypted).toEqual(data);
    });

    it('throws an error if encryption fails', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const encryptSpy = jest.spyOn(crypto.subtle, 'encrypt').mockRejectedValue(new Error('Mock encryption error') as never);

        await expect(encryptData("data")).rejects.toThrow("Failed to secure data");
        expect(consoleSpy).toHaveBeenCalled();

        encryptSpy.mockRestore();
        consoleSpy.mockRestore();
    });
});

describe('decryptData', () => {
    it('returns null when encryptedBase64 is empty', async () => {
        const result = await decryptData('');
        expect(result).toBeNull();
    });

    it('returns null and warns when decryption fails', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        // invalid base64
        const result = await decryptData('invalid_base64_!');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('returns null and warns when invalid ciphertext', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        // valid base64 but not valid encrypted data
        const result = await decryptData(btoa('valid base64 but not encrypted data'));

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
