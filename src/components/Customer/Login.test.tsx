import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const mockLogin = jest.fn();
const mockLoginAsGuest = jest.fn();
const mockRouterPush = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Login Component', () => {

    beforeEach(() => {
        mockLogin.mockClear();
        mockLoginAsGuest.mockClear();
        mockRouterPush.mockClear();

        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
            loginAsGuest: mockLoginAsGuest,
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('should show error when simulated OTP sending fails', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
            throw new Error('Simulated API failure');
        });

        render(<Login tableId="table-1" />);

        // Navigate to login form
        fireEvent.click(screen.getByText('Log In'));

        // Fill in phone number
        const phoneInput = screen.getByPlaceholderText('Enter your mobile number');
        fireEvent.change(phoneInput, { target: { value: '1234567890' } });

        // Submit form
        fireEvent.click(screen.getByText('Get OTP'));

        // Wait for error to appear
        await waitFor(() => {
            expect(screen.getByText(/Failed to send OTP\. Please try again\./i)).not.toBeNull();
        });

        (global.setTimeout as any).mockRestore();
    });

    it('should login as guest and view menu successfully', () => {
        render(<Login tableId="table-1" />);

        const tableInput = screen.getByPlaceholderText('Enter Table Number');
        fireEvent.change(tableInput, { target: { value: 'table-2' } });

        fireEvent.click(screen.getByText('View Menu'));

        expect(mockLoginAsGuest).toHaveBeenCalled();
        expect(mockRouterPush).toHaveBeenCalledWith('/?table=table-2');
    });

    it('should successfully send OTP', async () => {
        render(<Login tableId="table-1" />);

        fireEvent.click(screen.getByText('Log In'));

        const phoneInput = screen.getByPlaceholderText('Enter your mobile number');
        fireEvent.change(phoneInput, { target: { value: '1234567890' } });

        fireEvent.click(screen.getByText('Get OTP'));

        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(screen.getByText('Verify OTP')).not.toBeNull();
        });
    });

    it('should verify OTP successfully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        ) as jest.Mock;

        render(<Login tableId="table-1" />);

        fireEvent.click(screen.getByText('Log In'));

        const phoneInput = screen.getByPlaceholderText('Enter your mobile number');
        fireEvent.change(phoneInput, { target: { value: '1234567890' } });

        fireEvent.click(screen.getByText('Get OTP'));

        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(screen.getByText('Verify OTP')).not.toBeNull();
        });

        const otpInput = screen.getByPlaceholderText('••••');
        fireEvent.change(otpInput, { target: { value: '1234' } });

        fireEvent.click(screen.getByText('Verify & Login'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('Customer', '1234567890');
        });

        (global.fetch as jest.Mock).mockRestore();
    });
});
