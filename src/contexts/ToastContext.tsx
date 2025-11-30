"use client";
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * The types of toasts available.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Represents a toast notification.
 */
export interface Toast {
    /** Unique identifier for the toast. */
    id: string;
    /** The message to display. */
    message: string;
    /** The type of toast (determines styling). */
    type: ToastType;
}

/**
 * Defines the shape of the ToastContext.
 */
interface ToastContextType {
    /**
     * Adds a new toast notification.
     * @param message - The message to display.
     * @param type - The type of toast (defaults to 'info').
     */
    addToast: (message: string, type?: ToastType) => void;
    /**
     * Removes a toast by its ID.
     * @param id - The ID of the toast to remove.
     */
    removeToast: (id: string) => void;
    /** The list of active toasts. */
    toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to access the toast context.
 *
 * @returns {ToastContextType} The toast context value.
 * @throws {Error} If used outside of a ToastProvider.
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

/**
 * Provider component for the ToastContext.
 * Manages the state of toast notifications.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Child components.
 * @returns {JSX.Element} The provider component.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * Adds a new toast.
     * @param message - The message to display.
     * @param type - The type of toast.
     */
    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    /**
     * Removes a toast.
     * @param id - The ID of the toast to remove.
     */
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
            {children}
        </ToastContext.Provider>
    );
};
