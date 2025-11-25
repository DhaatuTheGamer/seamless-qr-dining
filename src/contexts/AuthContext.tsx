"use client";
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
    name: string;
    phone: string;
    isGuest: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (name: string, phone: string) => void;
    loginAsGuest: () => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (name: string, phone: string) => {
        setUser({ name, phone, isGuest: false });
    };

    const loginAsGuest = () => {
        setUser({ name: 'Guest', phone: '', isGuest: true });
    };

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
