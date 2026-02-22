import React from 'react';
import { Header } from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export const Layout: React.FC = () => {
    const location = useLocation();
    const { toastMessage, toastType, isToastExiting } = useToast();

    const toastColor = toastType === 'error' ? '#ef4444' : '#10b981';

    return (
        <>
            <Header />

            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}>
                    <div className={`inline-success-banner animate-pop ${isToastExiting ? 'banner-exit' : ''}`} style={{
                        background: toastColor,
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 600,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                        pointerEvents: 'auto'
                    }}>
                        {toastType === 'error' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                        {toastMessage}
                    </div>
                </div>
            )}

            <main className="main-wrapper">
                <div key={location.key} className="page-transition">
                    <Outlet />
                </div>
            </main>

            <footer className="footer">
                Copyright © 2026, <a href="https://ananta.azurewebsites.net">https://ananta.azurewebsites.net</a> · Developed with human brain, artificial neurons, love, passion, and GPUs at
                <strong> Ananta Lab</strong>, Kolkata ODC.
            </footer>
        </>
    );
};
