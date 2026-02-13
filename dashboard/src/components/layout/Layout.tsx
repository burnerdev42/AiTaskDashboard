import React from 'react';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
    return (
        <>
            <Header />
            <main className="main-wrapper">
                <Outlet />
            </main>
            <footer className="footer">
                Copyright © 2026, <a href="#">www.ananta.com</a> · Developed with human brain, artificial neurons, love, passion, and GPUs at
                <strong> The Innovation engineering LAB</strong>, Kolkata ODC.
            </footer>
        </>
    );
};
