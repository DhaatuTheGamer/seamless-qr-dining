import { encryptData, decryptData } from './security';

describe('security', () => {
    describe('decryptData', () => {
        it('returns null for falsy inputs', async () => {
            expect(await decryptData('')).toBeNull();
            // @ts-ignore
            expect(await decryptData(null)).toBeNull();
            // @ts-ignore
            expect(await decryptData(undefined)).toBeNull();
        });

        it('successfully decrypts valid encrypted data', async () => {
            const data = { test: 'value', number: 42 };
            const encrypted = await encryptData(data);
            const decrypted = await decryptData(encrypted);
            expect(decrypted).toEqual(data);
        });

        it('returns null and warns when decryption fails (corrupted data)', async () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            // Create a fake corrupted base64 string (needs to be somewhat long to avoid out of bounds on IV)
            const corruptedData = btoa('this is a corrupted string that is long enough');
            const result = await decryptData(corruptedData);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('returns null and warns when given an invalid base64 string', async () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const result = await decryptData('invalid-base64!@#');

            expect(result).toBeNull();
            // Either atob throws or decrypt throws, both caught
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
