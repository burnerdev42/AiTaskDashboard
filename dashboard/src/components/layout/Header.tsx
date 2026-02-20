import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { type Notification } from '../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const notifications: Notification[] = storage.getNotifications();
    const unreadCount = notifications.filter(n => n.unread).length;

    const closeMobileNav = () => setMobileNavOpen(false);

    return (
        <header className="header-band">
            <div className="header-left">
                <div className="header-logo">∞</div>
                <div className="header-titles">
                    <h1>Ananta Lab</h1>
                    <p>Manthan. Nirmaan. Drishti.</p>
                </div>
            </div>

            {/* Hamburger toggle — only visible on mobile via CSS */}
            <button
                className="hamburger-btn"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-label="Toggle navigation"
            >
                {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Overlay backdrop for mobile nav */}
            {mobileNavOpen && <div className="mobile-nav-backdrop" onClick={closeMobileNav} />}

            <div className={`header-right ${mobileNavOpen ? 'mobile-nav-open' : ''}`}>
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>Home</NavLink>
                <NavLink to="/swimlanes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>Swim Lane</NavLink>
                <NavLink to="/challenges" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>Challenges</NavLink>
                <NavLink to="/metrics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>Metrics</NavLink>
                <NavLink to="/whats-next" className={({ isActive }) => `nav-link whats-next-link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>What's Next</NavLink>

                <div className="header-user-controls">
                    {/* Notification Bell */}
                    <div className="notification-wrapper">
                        <div
                            className="notification-bell"
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    navigate('/notifications');
                                    setMobileNavOpen(false);
                                } else {
                                    setShowNotifications(!showNotifications);
                                }
                            }}
                        >
                            🔔
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </div>

                        <div className={`notification-panel ${showNotifications ? 'active' : ''}`}>
                            <div className="notification-header">
                                <h3>🔔 Notifications</h3>
                                <span
                                    className="mark-all-read"
                                    onClick={() => {
                                        storage.markAllNotificationsRead();
                                        setShowNotifications(false);
                                    }}
                                >
                                    Mark all read
                                </span>
                            </div>

                            <div className="notification-list">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                                        onClick={() => {
                                            storage.markNotificationRead(notification.id);
                                            setShowNotifications(false);
                                            closeMobileNav();
                                            navigate(notification.link);
                                        }}
                                    >
                                        <div className={`notification-icon ${notification.type}`}>
                                            {notification.type === 'challenge' && '🎯'}
                                            {notification.type === 'idea' && '💡'}
                                            {notification.type === 'comment' && '💬'}
                                            {notification.type === 'status' && '📈'}
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-title">{notification.title}</div>
                                            <div className="notification-text">{notification.text}</div>
                                            <div className="notification-time">{notification.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="notification-footer">
                                <div
                                    className="view-all-link"
                                    onClick={() => {
                                        setShowNotifications(false);
                                        closeMobileNav();
                                        navigate('/notifications');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    View All Notifications
                                </div>
                            </div>
                        </div>
                    </div>

                    {user ? (
                        <div className="avatar" title={user.name} onClick={() => { navigate('/profile'); closeMobileNav(); }} style={{ cursor: 'pointer' }}>
                            {user.avatar}
                        </div>
                    ) : (
                        <NavLink to="/login" className="nav-link" onClick={closeMobileNav}>Login</NavLink>
                    )}
                </div>
            </div>
        </header>
    );
};
