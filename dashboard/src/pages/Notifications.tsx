import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { type Notification } from '../types';

export const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'all' | 'challenge' | 'idea' | 'comment' | 'status'>('all');

    // Force update state
    const [_, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Get notifications from storage
    const allNotifications = storage.getNotifications();

    // Check if we need to filter based on user (optional, seeing all for now as per mock)
    // In a real app we'd filter by userId

    // Apply type filter
    const filteredNotifications = allNotifications.filter(n => {
        if (activeFilter === 'all') return true;
        return n.type === activeFilter;
    });

    // Calculate counts for tabs
    const counts = {
        all: allNotifications.length,
        challenge: allNotifications.filter(n => n.type === 'challenge').length,
        idea: allNotifications.filter(n => n.type === 'idea').length,
        comment: allNotifications.filter(n => n.type === 'comment').length,
        status: allNotifications.filter(n => n.type === 'status').length
    };

    const handleNotificationClick = (notification: Notification) => {
        storage.markNotificationRead(notification.id);
        navigate(notification.link);
    };

    const handleMarkAllRead = () => {
        storage.markAllNotificationsRead();
        forceUpdate();
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this notification?')) {
            storage.deleteNotification(id);
            forceUpdate();
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'challenge': return '🎯';
            case 'idea': return '💡';
            case 'comment': return '💬';
            case 'status': return '📈';
            default: return '🔔';
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
                    <h1>🔔 All Notifications</h1>
                    <button className="btn btn-secondary" onClick={handleMarkAllRead}>Mark all read</button>
                </div>
                <p>Stay updated on challenges, ideas, comments, and status changes across the innovation pipeline.</p>
            </div>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All <span className="count">{counts.all}</span>
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'challenge' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('challenge')}
                >
                    Challenges <span className="count">{counts.challenge}</span>
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'idea' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('idea')}
                >
                    Ideas <span className="count">{counts.idea}</span>
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'comment' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('comment')}
                >
                    Comments <span className="count">{counts.comment}</span>
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'status' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('status')}
                >
                    Status <span className="count">{counts.status}</span>
                </button>
            </div>

            <div className="notifications-grid">
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🔕</div>
                        <h3>No notifications found</h3>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notif-card ${notification.unread ? 'unread' : ''}`}
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
                                        onClick={(e) => handleDelete(e, notification.id)}
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
        </div>
    );
};
