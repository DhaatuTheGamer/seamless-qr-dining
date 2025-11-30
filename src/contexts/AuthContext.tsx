"use client";
import React, { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * Represents a user in the system.
 */
interface User {
    /** The user's name. */
    name: string;
    /** The user's phone number. */
    phone: string;
    /** Whether the user is a guest (not fully registered/authenticated). */
    isGuest: boolean;
}

/**
 * Defines the shape of the authentication context state and actions.
 */
interface AuthContextType {
    /** The current user object, or null if no user is logged in. */
    user: User | null;
    /**
     * Logs a user in with their name and phone number.
     * @param name - The user's name.
     * @param phone - The user's phone number.
     */
    login: (name: string, phone: string) => void;
    /**
     * Logs a user in as a guest.
     */
    loginAsGuest: () => void;
    /**
     * Logs the current user out.
     */
    logout: () => void;
    /** Indicates whether a user is currently authenticated (logged in). */
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access the authentication context.
 *
 * @returns {AuthContextType} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Provider component for the authentication context.
 * Manages user state and provides login/logout functionality.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - Child components that need access to the auth context.
 * @returns {JSX.Element} The provider component wrapping the children.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    /**
     * Logs a user in.
     * @param name - The name of the user.
     * @param phone - The phone number of the user.
     */
    const login = (name: string, phone: string) => {
        setUser({ name, phone, isGuest: false });
    };

    /**
     * Logs a user in as a guest.
     */
    const loginAsGuest = () => {
        setUser({ name: 'Guest', phone: '', isGuest: true });
    };

    /**
     * Logs the current user out.
     */
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            loginAsGuest,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
