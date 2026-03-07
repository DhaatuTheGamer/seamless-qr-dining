import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';
import React from 'react';

describe('ToastContext', () => {
    it('should initialize with empty toasts array', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        );
        const { result } = renderHook(() => useToast(), { wrapper });

        expect(result.current.toasts).toEqual([]);
    });

    it('should throw error if useToast is used outside of ToastProvider', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useToast())).toThrow('useToast must be used within a ToastProvider');
        consoleErrorSpy.mockRestore();
    });

    it('should add a toast with default info type', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        );
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.addToast('Test Message');
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0]).toEqual(
            expect.objectContaining({
                message: 'Test Message',
                type: 'info',
            })
        );
        expect(typeof result.current.toasts[0].id).toBe('string');
    });

    it('should add a toast with specified type', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        );
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.addToast('Error Message', 'error');
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0]).toEqual(
            expect.objectContaining({
                message: 'Error Message',
                type: 'error',
            })
        );
    });

    it('should remove a toast by id', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        );
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.addToast('Message to remove');
        });

        const toastId = result.current.toasts[0].id;

        act(() => {
            result.current.removeToast(toastId);
        });

        expect(result.current.toasts).toHaveLength(0);
    });

});
