/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '../types';
import { storage } from '../services/storage';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    register: (userData: Partial<User> & { name: string; email: string; interests?: string[], password?: string }) => Promise<{ success: boolean; error?: string }>;
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

    const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await authService.login(email, password);
            if (res && res.data && res.data.user) {
                const u = res.data.user;
                // Standardize backend response to frontend user model
                const frontendUser: User = {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    role: u.companyTechRole || u.role || 'Contributor',
                    companyTechRole: u.companyTechRole,
                    avatar: u.avatar || u.name?.substring(0, 2).toUpperCase() || 'U',
                    opco: u.opco,
                    platform: u.platform,
                    interestAreas: u.interestAreas || [],
                    upvoteCount: u.upvoteCount || 0,
                    commentCount: u.commentCount || 0,
                    challengeCount: u.challengeCount || 0,
                    totalIdeaCount: u.totalIdeaCount || 0,
                    innovationScore: u.innovationScore || 0,
                };

                setUser(frontendUser);
                storage.setCurrentUser(frontendUser);
                if (res.data.access_token) {
                    localStorage.setItem('access_token', res.data.access_token);
                }
                return { success: true };
            }
            return { success: false, error: 'Invalid response from server' };
        } catch (error: any) {
            console.error('Login failed', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        setUser(null);
        storage.setCurrentUser(null);
        localStorage.removeItem('access_token');
    };

    const register = async (userData: Partial<User> & { name: string; email: string; interests?: string[], password?: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await authService.register(userData);
            if (res && res.data && res.data.user) {
                const u = res.data.user;
                const frontendUser: User = {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    role: u.companyTechRole || u.role || 'Contributor',
                    companyTechRole: u.companyTechRole,
                    avatar: u.avatar || u.name?.substring(0, 2).toUpperCase() || 'U',
                    opco: u.opco,
                    platform: u.platform,
                    interestAreas: u.interestAreas || [],
                    upvoteCount: u.upvoteCount || 0,
                    commentCount: u.commentCount || 0,
                    challengeCount: u.challengeCount || 0,
                    totalIdeaCount: u.totalIdeaCount || 0,
                    innovationScore: u.innovationScore || 0,
                };

                setUser(frontendUser);
                storage.setCurrentUser(frontendUser);
                // Also store the access token from the register response if present
                if (res.data.access_token) {
                    localStorage.setItem('access_token', res.data.access_token);
                }

                return { success: true };
            }
            return { success: false, error: 'Invalid response from server' };
        } catch (error: any) {
            console.error('Registration failed', error);
            const errorMessage = error.response?.data?.message || 'Registration failed';
            return { success: false, error: errorMessage };
        }
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
