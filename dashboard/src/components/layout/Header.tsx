import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { type Notification } from '../../types';
import { NavLink, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications: Notification[] = storage.getNotifications();
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="header-band">
            <div className="header-left">
                <div className="header-logo">∞</div>
                <div className="header-titles">
                    <h1>Ananta Lab</h1>
                    <p>Manthan. Nirmaan. Drishti.</p>
                </div>
            </div>
            <div className="header-right">
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
                <NavLink to="/swimlanes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Swim Lane</NavLink>
                <NavLink to="/challenges" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Challenges</NavLink>
                <NavLink to="/metrics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Metrics</NavLink>

                {/* Notification Bell */}
                <div className="notification-wrapper">
                    <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
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
                                    // Force re-render would require state change or effect
                                    // For simple implementation, we can just close panel or rely on parent re-render if state was lifted
                                    // But since notifications variable is derived effectively from storage only on render, we need to trigger update.
                                    // Best way in this simple app:
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
                    <div className="avatar" title={user.name} onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        {user.avatar}
                    </div>
                ) : (
                    <NavLink to="/login" className="nav-link">Login</NavLink>
                )}
            </div>
        </header>
    );
};
