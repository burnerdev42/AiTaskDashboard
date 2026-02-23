/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    toastMessage: string | null;
    toastType: ToastType;
    isToastExiting: boolean;
    clearToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>('success');
    const [isToastExiting, setIsToastExiting] = useState(false);

    const clearToast = useCallback(() => {
        setIsToastExiting(true);
        setTimeout(() => {
            setToastMessage(null);
            setIsToastExiting(false);
        }, 300);
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setIsToastExiting(false);
    }, []);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                clearToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage, clearToast]);

    return (
        <ToastContext.Provider value={{ showToast, toastMessage, toastType, isToastExiting, clearToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
