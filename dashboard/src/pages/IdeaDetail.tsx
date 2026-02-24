import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import type { Idea } from '../types';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { ideaService } from '../services/idea.service';
import { challengeService } from '../services/challenge.service';
import { commentService } from '../services/comment.service';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

const getInitials = (n?: string) => {
    if (!n) return '??';
    const parts = n.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : n.substring(0, 2).toUpperCase();
};

export const IdeaDetail: React.FC = () => {
    const { challengeId, ideaId } = useParams<{ challengeId: string; ideaId: string }>();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const [searchParams] = useSearchParams();
    const [idea, setIdea] = useState<Idea | null>(null);
    const [comment, setComment] = useState('');
    const [editMode, setEditMode] = useState(searchParams.get('edit') === 'true');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editProblem, setEditProblem] = useState('');
    const [editSolution, setEditSolution] = useState('');
    const [hasLiked, setHasLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [parentChallenge, setParentChallenge] = useState<any>(null);

    // Get the parent challenge title for breadcrumb

    useEffect(() => {
        let isMounted = true;

        const fetchIdea = async () => {
            if (!ideaId) return;
            try {
                const response = await ideaService.getIdeaById(ideaId);
                if (!isMounted) return;

                // Fire-and-forget: increment view count on backend
                ideaService.recordView(ideaId).catch(() => { });

                const data = response.data?.idea || response.idea || response.data || response;
                if (!data || !data.ideaId) {
                    setIdea(null);
                    return;
                }

                // Map backend data to frontend Idea model
                const mappedIdea: Idea = {
                    id: data.ideaId || data._id,
                    title: data.title || 'Untitled',
                    description: data.description || '',
                    status: data.status ? 'In Review' : 'Pending',
                    owner: {
                        id: data.ownerDetails?._id || data.userId,
                        name: data.ownerDetails?.name || 'Unknown User',
                        avatar: getInitials(data.ownerDetails?.name),
                        avatarColor: 'var(--accent-purple)',
                    },
                    linkedChallenge: data.challengeDetails ? { id: data.challengeDetails.virtualId, title: data.challengeDetails.title } : undefined,
                    tags: data.tags || [],
                    stats: {
                        appreciations: data.upvoteCount || data.appreciationCount || 0,
                        comments: data.commentCount || 0,
                        views: data.viewCount || 0,
                    },
                    problemStatement: data.problemStatement || '',
                    proposedSolution: data.proposedSolution || '',
                    submittedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                    lastUpdated: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    activity: (data.comments || []).map((c: any) => ({
                        authorId: c.authorDetails?._id || c.userId,
                        author: c.authorDetails?.name || c.userId || 'Unknown',
                        avatar: getInitials(c.authorDetails?.name || c.userId),
                        avatarColor: 'var(--accent-blue)',
                        text: c.comment || '',
                        time: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'
                    })),
                    upVotes: data.upVotes || [],
                    subscriptions: data.subscription || []
                };

                setIdea(mappedIdea);
                setEditTitle(mappedIdea.title);
                setEditDescription(mappedIdea.description);
                setEditProblem(mappedIdea.problemStatement || '');
                setEditSolution(mappedIdea.proposedSolution || '');
            } catch (err) {
                console.error('Failed to load idea', err);
                setIdea(null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const fetchParentChallenge = async () => {
            if (!challengeId) return;
            try {
                const response = await challengeService.getChallengeById(challengeId);
                if (!isMounted) return;
                const data = response.data?.challenge || response.challenge || response.data || response;

                if (data && data.virtualId) {
                    setParentChallenge({
                        id: data.virtualId,
                        title: data.title,
                        owner: { name: data.ownerDetails?.name || 'Unknown User' },
                        stats: {
                            votes: data.upvoteCount || data.upVotes?.length || 0,
                            comments: data.commentCount || 0
                        }
                    });
                }
            } catch (err) {
                console.error('Failed to load parent challenge', err);
            }
        };

        fetchIdea();
        fetchParentChallenge();

        return () => { isMounted = false; };
    }, [ideaId, searchParams]);

    useEffect(() => {
        if (idea && user?.id) {
            setHasLiked(prev => prev || (idea.upVotes || []).includes(user.id));
            setIsSubscribed(prev => prev || (idea.subscriptions || []).includes(user.id));
        }
    }, [idea, user?.id]);

    if (isLoading) {
        return (
            <div className="detail-page-container">
                <div className="breadcrumb">
                    <div className="skeleton" style={{ width: '250px', height: '16px' }}></div>
                </div>
                <div className="detail-skeleton-header">
                    <div className="skeleton-text" style={{ width: '40%', height: '32px', borderRadius: '4px' }}></div>
                    <div className="skeleton-text" style={{ width: '80%', height: '16px', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
                <div className="detail-skeleton-meta">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="skeleton-text" style={{ width: '140px', height: '24px', borderRadius: '12px' }}></div>
                    ))}
                </div>
                <div className="detail-skeleton-main">
                    <div>
                        <div className="detail-skeleton-section">
                            <div className="skeleton-text" style={{ width: '30%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '80%', height: '14px', borderRadius: '4px' }}></div>
                        </div>
                        <div className="detail-skeleton-section">
                            <div className="skeleton-text" style={{ width: '40%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '90%', height: '14px', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                    <aside>
                        <div className="detail-skeleton-sidebar-item">
                            <div className="skeleton-text" style={{ width: '50%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '48px', borderRadius: '8px' }}></div>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    if (!idea) {
        return (
            <div className="detail-page-container fade-in">
                <div className="breadcrumb">
                    <a onClick={() => navigate('/')}>Home</a>
                    <span className="sep">/</span>
                    <a onClick={() => navigate('/challenges')}>Challenges</a>
                    {challengeId && (
                        <>
                            <span className="sep">/</span>
                            <a onClick={() => navigate(`/challenges/${challengeId}`)}>{challengeId}</a>
                        </>
                    )}
                </div>
                <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '24px', boxShadow: 'var(--shadow-lg)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', opacity: 0.8 }}>
                        <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" />
                    </svg>
                    <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: '700' }}>Idea Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', marginInline: 'auto' }}>The idea you are looking for does not exist or has been removed. It may have been deleted along with its parent challenge.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => challengeId ? navigate(`/challenges/${challengeId}`) : navigate('/challenges')}
                        style={{
                            minWidth: '200px',
                            height: '42px',
                            padding: '0 24px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '14px'
                        }}
                    >
                        {challengeId ? 'Back to Challenge' : 'Back to Challenges'}
                    </button>
                </div>
            </div>
        );
    }

    const toggleEdit = () => {
        if (editMode) {
            setIdea(prev => prev ? {
                ...prev,
                title: editTitle,
                description: editDescription,
                problemStatement: editProblem,
                proposedSolution: editSolution,
            } : prev);
        }
        setEditMode(!editMode);
    };

    const cancelEdit = () => {
        setEditTitle(idea.title);
        setEditDescription(idea.description);
        setEditProblem(idea.problemStatement || '');
        setEditSolution(idea.proposedSolution || '');
        setEditMode(false);
    };

    const handleLike = async () => {
        if (!isAuthenticated || !user?.id || !ideaId) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (hasLiked) return; // Prevent toggling off

        // Optimistic update
        setHasLiked(true);
        setIsSubscribed(true);
        setIdea(prev => prev ? {
            ...prev,
            stats: { ...prev.stats, appreciations: prev.stats.appreciations + 1 },
            upVotes: [...(prev.upVotes || []), user.id],
            subscriptions: [...(prev.subscriptions || []), user.id]
        } : prev);

        try {
            await ideaService.toggleUpvote(ideaId, user.id);
            showToast('Thanks for liking this idea!');
        } catch (error) {
            console.error('Failed to toggle upvote', error);
            // Revert on failure
            setHasLiked(false);
            setIdea(prev => prev ? {
                ...prev,
                stats: { ...prev.stats, appreciations: Math.max(0, prev.stats.appreciations - 1) },
                upVotes: (prev.upVotes || []).filter(id => id !== user.id)
            } : prev);
            showToast('Failed to update like status', 'error');
        }
    };

    const handleSubscribe = async () => {
        if (!isAuthenticated || !user?.id || !ideaId) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (isSubscribed) return; // Prevent toggling off

        // Optimistic update
        setIsSubscribed(true);
        setIdea(prev => prev ? {
            ...prev,
            subscriptions: [...(prev.subscriptions || []), user.id]
        } : prev);

        try {
            await ideaService.toggleSubscribe(ideaId, user.id);
            showToast('Subscribed to idea updates!');
        } catch (error) {
            console.error('Failed to toggle subscription', error);
            // Revert on failure
            setIsSubscribed(false);
            setIdea(prev => prev ? {
                ...prev,
                subscriptions: (prev.subscriptions || []).filter(id => id !== user.id)
            } : prev);
            showToast('Failed to update subscription', 'error');
        }
    };

    const handlePostComment = async () => {
        if (!isAuthenticated || !user?.id) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!comment.trim() || !ideaId) return;

        try {
            await commentService.createComment({
                userId: user.id,
                comment: comment.trim(),
                type: 'ID',
                typeId: ideaId
            });

            const newComment = {
                author: user.name || 'Current User',
                avatar: getInitials(user.name),
                avatarColor: 'var(--accent-purple)',
                text: comment.trim(),
                time: 'Just now'
            };

            setIdea(prev => prev ? {
                ...prev,
                stats: { ...prev.stats, comments: (prev.stats.comments || 0) + 1 },
                activity: [newComment, ...(prev.activity || [])]
            } : prev);

            setComment('');
            showToast('Comment posted successfully');
        } catch (error) {
            console.error('Failed to post comment', error);
            showToast('Failed to post comment. Please try again.', 'error');
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (idea && challengeId) {
            try {
                storage.deleteIdea(challengeId, idea.id);
                showToast('Idea deleted successfully');
                navigate(`/challenges/${challengeId}`);
            } catch {
                showToast('Failed to delete idea. Please try again.', 'error');
            }
        }
    };

    return (
        <div className="detail-page-container fade-in">

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a onClick={() => navigate('/')}>Home</a>
                <span className="sep">/</span>
                <a onClick={() => navigate('/challenges')}>Challenges</a>
                <span className="sep">/</span>
                <a onClick={() => navigate(`/challenges/${challengeId}`)}>
                    {challengeId}
                </a>
                <span className="sep">/</span>
                <span className="current">{idea.id}</span>
            </div>

            {/* Page Header */}
            <div className="detail-page-header">
                <div className="detail-page-header-top">
                    <div className="detail-page-header-left">
                        <div className="detail-idea-id">
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg></span>
                            <span>{idea.id}</span>
                        </div>
                        {editMode ? (
                            <>
                                <textarea className="detail-page-title edit-mode" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                <textarea className="detail-page-subtitle edit-mode" value={editSolution} onChange={e => setEditSolution(e.target.value)} />
                            </>
                        ) : (
                            <>
                                <h1 className="detail-page-title">{idea.title}</h1>
                                <p className="detail-page-subtitle">{idea.proposedSolution}</p>
                            </>
                        )}
                        <div className="header-badges">
                            <span
                                className="status-badge"
                                data-status={idea.status.toLowerCase()}
                            >
                                {idea.status}
                            </span>
                        </div>
                    </div>
                    <div className="detail-page-header-right">
                        {isAuthenticated && idea.owner.name === 'Current User' && (
                            editMode ? (
                                <>
                                    <button className="btn-save btn-sm" onClick={toggleEdit}>Save</button>
                                    <button className="btn-cancel btn-sm" onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <button className="btn-secondary btn-sm" onClick={toggleEdit}>Edit</button>
                            )
                        )}
                    </div>
                </div>
                <div className="detail-meta-row">
                    <div className="detail-meta-item" onClick={() => navigate(`/profile/${idea.owner.id || ''}`)} style={{ cursor: 'pointer' }} title={`View ${idea.owner.name}'s Profile`}>
                        <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></span>
                        <span>Author: <strong style={{ color: 'var(--accent-blue)' }}>{idea.owner.name}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
                        <span>Submitted: <strong>{idea.submittedDate}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg></span>
                        <span>Updated: <strong>{idea.lastUpdated}</strong></span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="detail-main-grid">

                {/* Left Column */}
                <div>
                    {/* Problem Statement */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></span>
                                <span>Problem Statement</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editProblem} onChange={e => setEditProblem(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{idea.problemStatement}</div>
                        )}
                    </div>

                    {/* Proposed Solution */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></span>
                                <span>Idea Details</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{idea.description}</div>
                        )}
                    </div>

                    {/* Activity & Comments */}
                    <div className="detail-content-section" style={{ marginTop: '24px' }}>
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon" style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></span>
                                <span>Comments</span>
                            </div>
                        </div>

                        <div className="detail-activity-feed">
                            {idea.activity?.map((act, i) => (
                                <div key={i} className="detail-activity-item">
                                    <div className="detail-activity-avatar" style={{ background: act.avatarColor, color: 'white', cursor: 'pointer' }} onClick={() => navigate(`/profile/${act.authorId || ''}`)} title={`View ${act.author}'s Profile`}>{act.avatar}</div>
                                    <div className="detail-activity-content">
                                        <div className="detail-activity-header">
                                            <span className="detail-activity-author" style={{ cursor: 'pointer', color: 'var(--text)' }} onClick={() => navigate(`/profile/${act.authorId || ''}`)} title={`View ${act.author}'s Profile`} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text)'}>{act.author}</span>
                                            <span className="detail-activity-time">{act.time}</span>
                                        </div>
                                        <div className="detail-activity-text">{act.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="detail-comment-box">
                            <textarea
                                className="detail-comment-input"
                                placeholder="Share your thoughts or feedback..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handlePostComment();
                                    }
                                }}
                            />
                            <button
                                className="btn-save btn-sm"
                                style={{
                                    alignSelf: 'flex-start',
                                    opacity: !comment.trim() ? 0.5 : 1,
                                    cursor: !comment.trim() ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handlePostComment}
                                disabled={!comment.trim()}
                            >
                                Post Comment
                            </button>
                        </div>

                    </div>
                </div>



                {/* Right Sidebar */}
                <aside>
                    {/* Linked Challenge */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                            </span>
                            Parent Challenge
                        </div>
                        <a
                            className="detail-linked-challenge"
                            onClick={() => navigate(`/challenges/${challengeId}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '4px' }}>
                                <div className="challenge-id-text">{challengeId}</div>
                                <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '600', background: 'rgba(76, 175, 80, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                                    {parentChallenge?.stats.votes || 0} <span style={{ fontSize: '10px' }}>votes</span>
                                </div>
                            </div>
                            <div style={{ width: '100%' }}>
                                <div className="challenge-title-text" style={{ whiteSpace: 'normal', lineHeight: '1.4' }}>{parentChallenge?.title || 'View Challenge'}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>by {parentChallenge?.owner.name || 'N/A'}</div>
                            </div>
                        </a>
                    </div>

                    {/* Engagement Stats */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-4"></path></svg>
                            </span>
                            Engagement Stats
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Views</span>
                            <span className="detail-stat-value blue">{idea.stats.views}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Likes</span>
                            <span className={`detail-stat-value green ${hasLiked ? 'active' : ''}`}>
                                {idea.stats.appreciations}
                            </span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Comments</span>
                            <span className="detail-stat-value orange">{idea.stats.comments}</span>
                        </div>
                    </div>





                    {/* Quick Actions */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            </span>
                            Quick Actions
                        </div>
                        <div className="detail-quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                className={`btn btn-secondary ${hasLiked ? 'active animate-pop' : ''}`}
                                onClick={handleLike}
                                disabled={hasLiked}
                                title={hasLiked ? "You have already liked this idea" : ""}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    opacity: hasLiked ? 0.7 : 1,
                                    cursor: hasLiked ? 'default' : 'pointer',
                                    color: hasLiked ? 'var(--accent-teal)' : '',
                                    borderColor: hasLiked ? 'var(--accent-teal)' : ''
                                }}>
                                <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                </span>
                                {hasLiked ? 'Liked' : 'Like'}
                            </button>
                            <button
                                className={`btn btn-secondary ${isSubscribed ? 'active' : ''}`}
                                onClick={handleSubscribe}
                                disabled={isSubscribed}
                                title={isSubscribed ? "You are already subscribed to this idea" : ""}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    opacity: isSubscribed ? 0.7 : 1,
                                    cursor: isSubscribed ? 'default' : 'pointer',
                                    color: isSubscribed ? 'var(--accent-green)' : '',
                                    borderColor: isSubscribed ? 'var(--accent-green)' : ''
                                }}>
                                <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isSubscribed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                </span>
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                            {isAuthenticated && idea.owner.name === 'Current User' && (
                                <button
                                    className="btn btn-danger btn-sm animate-pop"
                                    onClick={handleDelete}
                                    style={{ width: '100%' }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </span>
                                    Delete Idea
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Idea"
                message="Are you sure you want to delete this idea? This action cannot be undone."
                confirmText="Delete Idea"
            />
        </div>
    );
};
