import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, otp } = body;

        if (!phone || !otp) {
            return NextResponse.json(
                { success: false, message: 'Phone and OTP are required' },
                { status: 400 }
            );
        }

        // In a real application, you would verify the OTP against a database or a third-party service like Twilio.
        // For demonstration purposes, we accept '1234' as the valid OTP.
        if (otp === '1234') {
            return NextResponse.json(
                { success: true, message: 'OTP verified successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP.' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
