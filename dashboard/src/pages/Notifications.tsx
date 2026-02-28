import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { type Notification } from '../types';
import { Lightbulb, MessageSquare, TrendingUp, Heart, ThumbsUp } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Zap, User as UserIcon } from 'lucide-react';

export const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState<'all' | 'challenge' | 'idea' | 'comment' | 'status' | 'like' | 'action'>('all');
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Delete Modal State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
    const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

    // Toast State
    const { showToast } = useToast();

    // Force update state
    const [_, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    React.useEffect(() => {
        window.addEventListener('storage-updated', forceUpdate);
        return () => window.removeEventListener('storage-updated', forceUpdate);
    }, []);

    // Get notifications from storage
    let allNotifications = storage.getNotifications();

    const isAdmin = user?.role === 'Admin';
    let actionItems: Notification[] = [];

    if (isAdmin) {
        // Fetch pending items
        const pendingRegs = storage.getPendingRegistrations();
        const challenges = storage.getChallenges();
        const ideas = storage.getIdeaDetails();

        const pendingChallenges = challenges.filter(c => c.approvalStatus === 'Pending');
        const pendingIdeas = ideas.filter(i => {
            if (i.approvalStatus) return i.approvalStatus === 'Pending';
            return i.status === 'In Review' || i.status === 'Pending';
        });

        // Fetch read action items
        const readActionItems = storage.getReadActionItems();

        // Map pending registrations to notifications
        const mappedRegs: Notification[] = pendingRegs.map(reg => {
            const id = `action-reg-${reg.email}`;
            return {
                id,
                type: 'registration',
                title: `New Registration — ${reg.name}`,
                text: `${reg.name} (${reg.email}) from ${reg.department} has registered and is awaiting your approval to access the portal.`,
                time: new Date(reg.date).toLocaleString(),
                unread: !readActionItems.includes(id),
                link: '/control-center',
                actionNeeded: true,
                meta: [{ type: 'registration', text: 'Registration' }]
            };
        });

        // Map pending challenges
        const mappedChalls: Notification[] = pendingChallenges.map(c => {
            const id = `action-chall-${c.id}`;
            return {
                id,
                type: 'challenge',
                title: `New Challenge Submitted — ${c.title}`,
                text: `${c.owner?.name || 'User'} submitted challenge ${c.id}. Needs your approval before it goes live.`,
                time: 'Recent',
                unread: !readActionItems.includes(id),
                link: '/control-center',
                actionNeeded: true,
                meta: [{ type: 'challenge', text: 'Challenge' }, { type: 'id', text: c.id }]
            };
        });

        // Map pending ideas
        const mappedIdeas: Notification[] = pendingIdeas.map(i => {
            const id = `action-idea-${i.id}`;
            return {
                id,
                type: 'idea',
                title: `New Idea Submitted — ${i.title}`,
                text: `${i.owner?.name || 'User'} submitted idea ${i.id}. Requires approval to appear in the ideas board.`,
                time: i.submittedDate ? new Date(i.submittedDate).toLocaleString() : 'Recent',
                unread: !readActionItems.includes(id),
                link: '/control-center',
                actionNeeded: true,
                meta: [{ type: 'idea', text: 'Idea' }, { type: 'id', text: i.id }]
            };
        });

        actionItems = [...mappedRegs, ...mappedChalls, ...mappedIdeas];
        // Combine action items at the top
        allNotifications = [...actionItems, ...allNotifications];
    }

    // Apply type filter
    const filteredNotifications = allNotifications.filter(n => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'action') return n.actionNeeded;
        if (activeFilter === 'like') return n.type === 'like' || n.type === 'vote';
        return n.type === activeFilter;
    });

    // Calculate counts for tabs
    const counts = {
        all: allNotifications.length,
        action: actionItems.length,
        challenge: allNotifications.filter(n => n.type === 'challenge' && !n.actionNeeded).length,
        idea: allNotifications.filter(n => n.type === 'idea' && !n.actionNeeded).length,
        comment: allNotifications.filter(n => n.type === 'comment' && !n.actionNeeded).length,
        status: allNotifications.filter(n => n.type === 'status' && !n.actionNeeded).length,
        like: allNotifications.filter(n => (n.type === 'like' || n.type === 'vote') && !n.actionNeeded).length
    };

    const handleNotificationClick = (notification: Notification) => {
        storage.markNotificationRead(notification.id);
        navigate(notification.link);
    };

    const handleMarkAllRead = () => {
        storage.markAllNotificationsRead();
        forceUpdate();
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
            setTimeout(() => {
                try {
                    storage.deleteNotification(idToDelete);
                    forceUpdate();
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
            case 'registration': return <UserIcon size={16} />;
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
        <div className="container notifications-page" >
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
                {isAdmin && (
                    <button
                        className={`filter-tab ${activeFilter === 'action' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('action')}
                    >
                        <Zap size={14} style={{ marginRight: '6px' }} /> Action Needed {isLoading ? <span className="count skeleton-text" style={{ width: '20px', height: '14px', margin: 0 }}></span> : <span className="count animate-pop">{counts.action}</span>}
                    </button>
                )}
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
                            className={`notif-card ${notification.unread ? 'unread' : ''} ${animatingIds.has(notification.id) ? 'notif-exit' : ''} ${notification.actionNeeded ? 'action-needed' : ''}`}
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
                                    {notification.actionNeeded && (
                                        <span className="notif-badge action-tag">
                                            <Zap size={12} style={{ marginRight: '4px' }} /> Action Needed
                                        </span>
                                    )}
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
        </div >
    );
};
