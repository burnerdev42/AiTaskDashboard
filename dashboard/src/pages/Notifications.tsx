import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notification.service';
import { type Notification } from '../types';
import { useAuth } from '../context/AuthContext';
import { Lightbulb, MessageSquare, TrendingUp, Heart, ThumbsUp } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useToast } from '../context/ToastContext';

export const Notifications: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'all' | 'challenge' | 'idea' | 'comment' | 'status' | 'like'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

    const fetchNotifications = React.useCallback(async () => {
        setIsLoading(true);
        try {
            if (user?.id) {
                // To fetch all, we can pass a high limit or another endpoint if available.
                // Assuming limit=50 for the all notifications page
                const notifs = await notificationService.getNotifications(user.id, 50);
                setAllNotifications(notifs);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchNotifications();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.id, fetchNotifications]);

    // Delete Modal State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
    const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

    // Toast State
    const { showToast } = useToast();

    // Check if we need to filter based on user (optional, seeing all for now as per mock)
    // In a real app we'd filter by userId

    // Apply type filter
    const filteredNotifications = allNotifications.filter(n => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'like') return n.type === 'like' || n.type === 'vote';
        return n.type === activeFilter;
    });

    // Calculate counts for tabs
    const counts = {
        all: allNotifications.length,
        challenge: allNotifications.filter(n => n.type === 'challenge').length,
        idea: allNotifications.filter(n => n.type === 'idea').length,
        comment: allNotifications.filter(n => n.type === 'comment').length,
        status: allNotifications.filter(n => n.type === 'status').length,
        like: allNotifications.filter(n => n.type === 'like' || n.type === 'vote').length
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (notification.unread) {
            await notificationService.markAsRead(notification.id);
            setAllNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n));
        }
        navigate(notification.link);
    };

    const handleMarkAllRead = async () => {
        const unreadNotifs = allNotifications.filter(n => n.unread);
        setAllNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        await Promise.all(unreadNotifs.map(n => notificationService.markAsRead(n.id)));
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotificationToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (notificationToDelete) {
            const idToDelete = notificationToDelete;
            setAnimatingIds(prev => new Set(prev).add(idToDelete));
            setShowDeleteConfirm(false);
            setNotificationToDelete(null);

            // Wait for exit CSS animation (300ms) before deleting from storage
            setTimeout(async () => {
                try {
                    await notificationService.deleteNotification(idToDelete);
                    setAllNotifications(prev => prev.filter(n => n.id !== idToDelete));
                    setAnimatingIds(prev => {
                        const next = new Set(prev);
                        next.delete(idToDelete);
                        return next;
                    });
                    showToast('Notification deleted successfully');
                } catch {
                    setAnimatingIds(prev => {
                        const next = new Set(prev);
                        next.delete(idToDelete);
                        return next;
                    });
                    showToast('Failed to delete notification. Please try again.', 'error');
                }
            }, 300);
        }
    };

    const flagIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>;
    const getIcon = (type: string) => {
        switch (type) {
            case 'challenge': return flagIcon;
            case 'idea': return <Lightbulb size={16} />;
            case 'comment': return <MessageSquare size={16} />;
            case 'status': return <TrendingUp size={16} />;
            case 'like': return <Heart size={16} />;
            case 'vote': return <ThumbsUp size={16} />;
            default: return flagIcon;
        }
    };

    const renderBadge = (type: string) => {
        return (
            <span className={`notif-badge ${type}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        );
    };

    return (
        <div className="container notifications-page">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>All Notifications</h1>
                    <button className="btn btn-secondary" onClick={handleMarkAllRead}>Mark all read</button>
                </div>
                <p>Stay updated on challenges, ideas, comments, and status changes across the innovation pipeline.</p>
            </div>


            <div className={`filter-tabs ${isLoading ? 'fade-in' : ''}`}>
                <button
                    className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.all}</span>}
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'challenge' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('challenge')}
                >
                    Challenges {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.challenge}</span>}
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'idea' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('idea')}
                >
                    Ideas {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.idea}</span>}
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'comment' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('comment')}
                >
                    Comments {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.comment}</span>}
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'status' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('status')}
                >
                    Status {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.status}</span>}
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'like' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('like')}
                >
                    Reactions {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.like}</span>}
                </button>
            </div>

            <div className={`notifications-grid ${!isLoading ? 'fade-in' : ''}`}>
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="notif-card" style={{ pointerEvents: 'none' }}>
                            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}></div>
                            <div className="notif-body" style={{ width: '100%' }}>
                                <div className="notif-header" style={{ marginBottom: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton-text" style={{ width: '70%', height: '16px', borderRadius: '4px', marginBottom: '6px' }}></div>
                                        <div className="skeleton-text" style={{ width: '30%', height: '12px', borderRadius: '4px' }}></div>
                                    </div>
                                    <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="notif-desc" style={{ marginBottom: '16px' }}>
                                    <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '6px' }}></div>
                                    <div className="skeleton-text" style={{ width: '80%', height: '14px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="notif-meta">
                                    <div className="skeleton" style={{ width: '60px', height: '22px', borderRadius: '12px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">—</div>
                        <h3>No notifications found</h3>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notif-card ${notification.unread ? 'unread' : ''} ${animatingIds.has(notification.id) ? 'notif-exit' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className={`notif-icon ${notification.type}`}>
                                {getIcon(notification.type)}
                            </div>
                            <div className="notif-body">
                                <div className="notif-header">
                                    <div>
                                        <div className="notif-title">{notification.title}</div>
                                        <div className="notif-time">{notification.time}</div>
                                    </div>
                                    <button
                                        className="btn-icon delete-btn"
                                        onClick={(e) => handleDeleteClick(e, notification.id)}
                                        title="Delete notification"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="notif-desc">
                                    {notification.text}
                                </div>
                                <div className="notif-meta">
                                    {renderBadge(notification.type)}
                                    {/* Additional mock meta can be added if available in type */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setNotificationToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Notification"
                message="Are you sure you want to delete this notification? This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
};
