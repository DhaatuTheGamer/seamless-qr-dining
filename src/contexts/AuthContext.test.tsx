import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

describe('AuthContext', () => {
    it('should throw an error when useAuth is used outside of AuthProvider', () => {
        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');
    });

    describe('with AuthProvider', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        it('should have initial unauthenticated state', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        it('should handle login correctly', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });

            act(() => {
                result.current.login('John Doe', '1234567890');
            });

            expect(result.current.user).toEqual({
                name: 'John Doe',
                phone: '1234567890',
                isGuest: false,
            });
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should handle loginAsGuest correctly', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });

            act(() => {
                result.current.loginAsGuest();
            });

            expect(result.current.user).toEqual({
                name: 'Guest',
                phone: '',
                isGuest: true,
            });
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should handle logout correctly', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });

            // First login
            act(() => {
                result.current.login('John Doe', '1234567890');
            });
            expect(result.current.isAuthenticated).toBe(true);

            // Then logout
            act(() => {
                result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });
});
