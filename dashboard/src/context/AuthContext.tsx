/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    register: (userData: Partial<User> & { name: string; email: string }) => Promise<boolean>;
    updateUser: (data: Partial<User>) => Promise<boolean>;
    deleteAccount: () => Promise<boolean>;
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
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
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

    const register = async (userData: Partial<User> & { name: string; email: string }): Promise<boolean> => {
        // Check if user exists in active users
        const users = storage.getUsers();
        if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return false;
        }

        // Check if already in pending registrations
        if (storage.isEmailPending(userData.email)) {
            return false;
        }

        const pendingUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email.toLowerCase().trim(),
            role: userData.role || 'Contributor',
            avatar: userData.name.substring(0, 2).toUpperCase(),
            opco: userData.opco,
            platform: userData.platform,
            about: userData.about,
            interests: userData.interests,
            status: 'pending',
            registeredAt: new Date().toISOString()
        };

        return storage.addPendingRegistration(pendingUser);
    };

    const updateUser = async (updatedData: Partial<User>): Promise<boolean> => {
        if (!user) return false;

        const updatedUser = { ...user, ...updatedData };
        if (storage.updateUser(updatedUser)) {
            setUser(updatedUser);
            return true;
        }
        return false;
    };

    const deleteAccount = async (): Promise<boolean> => {
        if (!user) return false;
        if (storage.deleteUser(user.email)) {
            setUser(null);
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser, deleteAccount, isAuthenticated: !!user }}>
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
