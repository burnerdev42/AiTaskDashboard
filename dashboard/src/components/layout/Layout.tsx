import React from 'react';
import { Header } from './Header';
import { Outlet, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
    const location = useLocation();

    return (
        <>
            <Header />
            <main className="main-wrapper">
                <div key={location.key} className="page-transition">
                    <Outlet />
                </div>
            </main>
            <footer className="footer">
                Copyright © 2026, <a href="#">www.ananta.com</a> · Developed with human brain, artificial neurons, love, passion, and GPUs at
                <strong> The Innovation engineering LAB</strong>, Kolkata ODC.
            </footer>
        </>
    );
};
