import { POST } from './route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status,
      json: async () => data,
    })),
  },
}));

describe('POST /api/auth/verify-otp', () => {
    it('returns 400 if phone or otp is missing', async () => {
        const mockJson = jest.fn().mockResolvedValue({ phone: '123' });
        const req = { json: mockJson } as any;

        const res = await POST(req);

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.success).toBe(false);
        expect(json.message).toBe('Phone and OTP are required');
    });

    it('returns 200 if otp is valid', async () => {
        const mockJson = jest.fn().mockResolvedValue({ phone: '123', otp: '1234' });
        const req = { json: mockJson } as any;

        const res = await POST(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.message).toBe('OTP verified successfully');
    });

    it('returns 401 if otp is invalid', async () => {
        const mockJson = jest.fn().mockResolvedValue({ phone: '123', otp: 'wrong' });
        const req = { json: mockJson } as any;

        const res = await POST(req);

        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json.success).toBe(false);
        expect(json.message).toBe('Invalid OTP.');
    });

    it('returns 500 on internal error', async () => {
        const mockJson = jest.fn().mockRejectedValue(new Error('Test error'));
        const req = { json: mockJson } as any;

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const res = await POST(req);

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.success).toBe(false);
        expect(json.message).toBe('Internal server error');

        consoleSpy.mockRestore();
    });
});
