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
                Copyright © 2026, <a href="https://ananta.azurewebsites.net">https://ananta.azurewebsites.net</a> · Developed with human brain, artificial neurons, love, passion, and GPUs at
                <strong> Ananta Lab</strong>, Kolkata ODC.
            </footer>
        </>
    );
};
