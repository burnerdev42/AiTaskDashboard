/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string) => Promise<boolean>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        storage.initialize();
        const timer = setTimeout(() => {
            const currentUser = storage.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const login = async (email: string): Promise<boolean> => {
        const users = storage.getUsers();
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            storage.setCurrentUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        storage.setCurrentUser(null);
    };

    const register = async (name: string, email: string): Promise<boolean> => {
        // Check if user exists
        const users = storage.getUsers();
        if (users.find(u => u.email === email)) {
            return false;
        }

        const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            role: 'Contributor',
            avatar: name.substring(0, 2).toUpperCase(),
        };
        storage.addUser(newUser);
        setUser(newUser);
        storage.setCurrentUser(newUser);
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
