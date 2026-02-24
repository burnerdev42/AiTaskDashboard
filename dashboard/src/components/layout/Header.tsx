import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notification.service';
import { type Notification } from '../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Lightbulb, MessageSquare, TrendingUp, Sparkles, Heart, ThumbsUp } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef<HTMLDivElement>(null);

    const closeMobileNav = () => setMobileNavOpen(false);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            const fetchNotifs = async () => {
                const count = await notificationService.getUnreadCount(user.id);
                setUnreadCount(count);
                if (showNotifications) {
                    setIsLoadingNotifications(true);
                    const notifs = await notificationService.getNotifications(user.id, 10);
                    // Sort descending by time
                    const sorted = notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                    setNotifications(sorted);
                    setIsLoadingNotifications(false);
                }
            };
            fetchNotifs();
        }
    }, [isAuthenticated, user?.id, showNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <header className="header-band">
            <div className="header-left">
                <div className="header-logo">∞</div>
                <div className="header-titles">
                    <h1>Ananta</h1>
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
                <NavLink to="/whats-next" className={({ isActive }) => `nav-link whats-next-link ${isActive ? 'active' : ''}`} onClick={closeMobileNav} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Sparkles size={16} /> What's Next</NavLink>

                <div className="header-user-controls">
                    {/* Notification Bell */}
                    {isAuthenticated && (
                        <div className="notification-wrapper" ref={notificationRef}>
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
                                <Bell size={20} />
                                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                            </div>

                            <div className={`notification-panel ${showNotifications ? 'active' : ''}`}>
                                <div className="notification-header">
                                    <h3>Notifications</h3>
                                    <span
                                        className="mark-all-read"
                                        onClick={() => {
                                            if (user?.id) {
                                                setUnreadCount(0);
                                                setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                                                notifications.filter(n => n.unread).forEach(n => notificationService.markAsRead(n.id));
                                            }
                                            setShowNotifications(false);
                                        }}
                                    >
                                        Mark all read
                                    </span>
                                </div>

                                <div className="notification-list">
                                    {isLoadingNotifications ? (
                                        [...Array(4)].map((_, i) => (
                                            <div key={i} className="notification-item" style={{ pointerEvents: 'none' }}>
                                                <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }}></div>
                                                <div className="notification-content" style={{ width: '100%' }}>
                                                    <div className="skeleton-text" style={{ width: '60%', height: '14px', borderRadius: '4px', marginBottom: '6px' }}></div>
                                                    <div className="skeleton-text" style={{ width: '100%', height: '12px', borderRadius: '4px', marginBottom: '6px' }}></div>
                                                    <div className="skeleton-text" style={{ width: '30%', height: '10px', borderRadius: '4px' }}></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : notifications.length === 0 ? (
                                        <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`notification-item ${notification.unread ? 'unread' : ''}`}
                                                onClick={() => {
                                                    if (notification.unread) {
                                                        notificationService.markAsRead(notification.id);
                                                        setUnreadCount(Math.max(0, unreadCount - 1));
                                                        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n));
                                                    }
                                                    setShowNotifications(false);
                                                    closeMobileNav();
                                                    navigate(notification.link);
                                                }}
                                            >
                                                <div className={`notification-icon ${notification.type}`}>
                                                    {notification.type === 'challenge' && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                                                    )}
                                                    {notification.type === 'idea' && <Lightbulb size={16} />}
                                                    {notification.type === 'comment' && <MessageSquare size={16} />}
                                                    {notification.type === 'status' && <TrendingUp size={16} />}
                                                    {notification.type === 'like' && <Heart size={16} />}
                                                    {notification.type === 'vote' && <ThumbsUp size={16} />}
                                                </div>
                                                <div className="notification-content">
                                                    <div className="notification-title">{notification.title}</div>
                                                    <div className="notification-text">{notification.text}</div>
                                                    <div className="notification-time">{notification.time}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                    )}

                    {user ? (
                        <div className="avatar" title={user.name} onClick={() => { navigate('/profile'); closeMobileNav(); }} style={{ cursor: 'pointer' }}>
                            {user.avatar}
                        </div>
                    ) : (
                        <NavLink to="/login" className="login-btn" onClick={closeMobileNav}>Login</NavLink>
                    )}
                </div>
            </div>
        </header>
    );
};
