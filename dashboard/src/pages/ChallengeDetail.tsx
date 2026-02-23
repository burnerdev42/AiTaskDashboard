import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { ChallengeDetailData } from '../types';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { challengeService } from '../services/challenge.service';
import { commentService } from '../services/comment.service';
import { ideaService } from '../services/idea.service';

const STAGE_BRANDING: Record<string, { color: string, bg: string, icon: React.ReactNode }> = {
    'Challenge Submitted': {
        color: 'var(--accent-red)', bg: 'rgba(239,83,80,.15)',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg>
    },
    'Ideation & Evaluation': {
        color: 'var(--accent-yellow)', bg: 'rgba(255,238,88,.12)',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    },
    'POC & Pilot': {
        color: 'var(--accent-blue)', bg: 'rgba(240,184,112,.15)',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    },
    'Scaled & Deployed': {
        color: 'var(--accent-gold)', bg: 'rgba(255,213,79,.12)',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
    },
    'Parking Lot': {
        color: 'var(--accent-grey)', bg: 'rgba(120,144,156,.15)',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>
    }
};

const PRIORITY_BRANDING: Record<string, { color: string, bg: string, border: string }> = {
    'Critical': {
        color: '#ef5350', bg: 'rgba(239, 83, 80, .12)', border: 'rgba(239, 83, 80, .25)'
    },
    'High': {
        color: '#ffa726', bg: 'rgba(255, 167, 38, .12)', border: 'rgba(255, 167, 38, .25)'
    },
    'Medium': {
        color: '#ffee58', bg: 'rgba(255, 238, 88, .12)', border: 'rgba(255, 238, 88, .25)'
    },
    'Low': {
        color: '#66bb6a', bg: 'rgba(102, 187, 106, .12)', border: 'rgba(102, 187, 106, .25)'
    }
};

const getStageFromCode = (code: string): string => {
    switch (code) {
        case 'submitted': return 'Challenge Submitted';
        case 'ideation': return 'Ideation & Evaluation';
        case 'pilot': return 'POC & Pilot';
        case 'completed': return 'Scaled & Deployed';
        case 'archive': return 'Parking Lot';
        default: return 'Challenge Submitted';
    }
};

const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

export const ChallengeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    const [challenge, setChallenge] = useState<ChallengeDetailData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [showIdeaModal, setShowIdeaModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editSubtitle, setEditSubtitle] = useState('');
    const [editProblem, setEditProblem] = useState('');
    const [editOutcome, setEditOutcome] = useState('');
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [exitingIdeaIds, setExitingIdeaIds] = useState<string[]>([]);
    const [newIdeaId, setNewIdeaId] = useState<string | null>(null);

    // Idea Modal States
    const [ideaTitle, setIdeaTitle] = useState('');
    const [ideaDescription, setIdeaDescription] = useState('');
    const [ideaDetail, setIdeaDetail] = useState('');
    const [ideaErrors, setIdeaErrors] = useState<{ title?: string; description?: string; detail?: string }>({});

    // Quick Action States
    const [hasVoted, setHasVoted] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchChallengeData = async () => {
            if (!id) return;

            try {
                const response = await challengeService.getChallengeById(id);
                if (!isMounted) return;

                // Fire-and-forget: increment view count
                challengeService.recordView(id).catch(() => { });

                const challengeData = response.data?.challenge || response.data || response;

                // Fetch related data in parallel
                let comments = [];
                let ideas = [];

                try {
                    const commentsRes = await commentService.getCommentsForChallenge(id);
                    comments = commentsRes.data?.comments || commentsRes.data || commentsRes || [];
                    if (!Array.isArray(comments)) comments = [];
                } catch (err) {
                    console.error("Failed to fetch comments", err);
                }

                try {
                    const ideasRes = await ideaService.getIdeasForChallenge(id);
                    ideas = ideasRes.data?.ideas || ideasRes.data || ideasRes || [];
                    if (!Array.isArray(ideas)) ideas = [];
                } catch (err) {
                    console.error("Failed to fetch ideas", err);
                    // If endpoint doesn't exist, we fallback to empty array
                }

                // Default empty state mapping
                const defaultString = "Not available";

                // Map backend structure to frontend ChallengeDetailData
                const mappedChallenge: ChallengeDetailData = {
                    id: challengeData.virtualId || id,
                    title: challengeData.title || defaultString,
                    description: challengeData.summary || defaultString,
                    problemStatement: challengeData.description || defaultString,
                    expectedOutcome: challengeData.outcome || defaultString,
                    stage: getStageFromCode(challengeData.status),
                    owner: {
                        id: challengeData.ownerDetails?._id || challengeData.userId,
                        name: challengeData.ownerDetails?.name || 'Unknown User',
                        avatar: getInitials(challengeData.ownerDetails?.name),
                        avatarColor: 'var(--accent-purple)'
                    },
                    accentColor: 'teal',
                    stats: {
                        appreciations: challengeData.upvoteCount || 0,
                        comments: challengeData.commentCount || 0,
                        views: challengeData.totalViews || challengeData.viewCount || 0,
                    },
                    tags: challengeData.tags || [],
                    challengeTags: challengeData.tags || [],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    team: challengeData.contributorsDetails?.map((c: any) => ({
                        name: c.name,
                        avatar: getInitials(c.name),
                        avatarColor: 'var(--accent-blue)',
                        role: c.companyTechRole || 'Contributor'
                    })) || [],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    impact: challengeData.priority as any || 'Medium',
                    businessUnit: challengeData.opco || defaultString,
                    department: challengeData.platform || defaultString,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    priority: challengeData.priority as any || 'Medium',
                    estimatedImpact: defaultString,
                    timeline: challengeData.timeline || defaultString,
                    portfolioOption: challengeData.portfolioLane || defaultString,
                    constraints: challengeData.constraint || defaultString,
                    stakeholders: challengeData.stakeHolder || defaultString,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ideas: ideas.map((i: any) => ({
                        id: i.ideaId || i.virtualId || i._id,
                        title: i.title || defaultString,
                        authorId: i.ownerDetails?._id || i.userId,
                        author: i.ownerDetails?.name || 'Unknown',
                        status: i.status ? 'Accepted' : 'Pending',
                        appreciations: i.upvoteCount || i.appreciationCount || 0,
                        comments: i.commentCount || 0,
                        views: i.viewCount || 0
                    })),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    activity: comments.map((c: any) => ({
                        authorId: c.userDetails?._id || c.userId,
                        author: c.userDetails?.name || 'Unknown',
                        avatar: getInitials(c.userDetails?.name),
                        avatarColor: 'var(--accent-blue)',
                        text: c.comment,
                        time: new Date(c.createdat || c.createdAt).toLocaleDateString()
                    })),
                    createdDate: challengeData.createdAt ? new Date(challengeData.createdAt).toLocaleDateString() : defaultString,
                    updatedDate: challengeData.updatedAt ? new Date(challengeData.updatedAt).toLocaleDateString() : defaultString,
                    upVotes: challengeData.upvoteList || challengeData.upVotes || [],
                    subscriptions: challengeData.subcriptions || challengeData.subscriptions || [],

                    // Keep original object mapping for any missing pass-throughs
                    ...challengeData,
                };

                setChallenge(mappedChallenge);
                setEditTitle(mappedChallenge.title);
                setEditSubtitle(mappedChallenge.description);
                setEditProblem(mappedChallenge.problemStatement);
                setEditOutcome(mappedChallenge.expectedOutcome);

            } catch (err) {
                console.error("Failed to load challenge details", err);
                setChallenge(null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchChallengeData();

        if (searchParams.get('edit') === 'true') {
            setEditMode(true);
        }

        return () => { isMounted = false; };
    }, [id, searchParams]);

    useEffect(() => {
        if (challenge && user?.id) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const c = challenge as any;
            setHasVoted(prev => prev || (c.upVotes || c.upvoteList || []).includes(user.id));
            setIsSubscribed(prev => prev || (c.subscriptions || c.subcriptions || []).includes(user.id));
        }
    }, [challenge, user?.id]);

    if (isLoading) {
        return (
            <div className="detail-page-container fade-in">
                <div className="breadcrumb">
                    <div className="skeleton" style={{ width: '200px', height: '16px' }}></div>
                </div>
                <div className="detail-skeleton-header">
                    <div className="skeleton-text" style={{ width: '40%', height: '32px', borderRadius: '4px' }}></div>
                    <div className="skeleton-text" style={{ width: '80%', height: '16px', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
                <div className="detail-skeleton-meta">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton-text" style={{ width: '150px', height: '24px', borderRadius: '12px' }}></div>
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
                        <div className="detail-skeleton-section">
                            <div className="skeleton-text" style={{ width: '25%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '60%', height: '14px', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                    <aside>
                        <div className="detail-skeleton-sidebar-item">
                            <div className="skeleton-text" style={{ width: '50%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div className="skeleton-text" style={{ width: '40%', height: '14px', borderRadius: '4px' }}></div>
                                    <div className="skeleton-text" style={{ width: '20%', height: '14px', borderRadius: '4px' }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="detail-skeleton-sidebar-item">
                            <div className="skeleton-text" style={{ width: '50%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div className="skeleton-text" style={{ width: '30%', height: '14px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-text" style={{ width: '15%', height: '14px', borderRadius: '8px' }}></div>
                                    </div>
                                    <div className="skeleton-text" style={{ width: '80%', height: '12px', borderRadius: '4px' }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="detail-skeleton-sidebar-item">
                            <div className="skeleton-text" style={{ width: '60%', height: '20px', borderRadius: '4px', marginBottom: '16px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '36px', borderRadius: '8px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '36px', borderRadius: '8px', marginBottom: '8px' }}></div>
                            <div className="skeleton-text" style={{ width: '100%', height: '36px', borderRadius: '8px' }}></div>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="detail-page-container fade-in">
                <div className="breadcrumb">
                    <a onClick={() => navigate('/')}>Home</a>
                    <span className="sep">/</span>
                    <a onClick={() => navigate('/challenges')}>Challenges</a>
                </div>
                <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '24px', boxShadow: 'var(--shadow-lg)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', opacity: 0.8 }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: '700' }}>Challenge Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', marginInline: 'auto' }}>The challenge you are looking for does not exist or has been deleted from our innovation pipeline.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/challenges')}
                        style={{
                            minWidth: '200px',
                            height: '42px',
                            padding: '0 24px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '14px'
                        }}
                    >
                        Back to Challenges
                    </button>
                </div>
            </div>
        );
    }

    const toggleEdit = async () => {
        if (editMode) {
            if (!challenge) return;
            // Save
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: any = {
                    title: editTitle,
                    summary: editSubtitle,
                    description: editProblem,
                    outcome: editOutcome
                };

                await challengeService.updateChallenge(challenge.id, payload);

                setChallenge(prev => prev ? {
                    ...prev,
                    title: editTitle,
                    description: editSubtitle,
                    problemStatement: editProblem,
                    expectedOutcome: editOutcome,
                } : prev);
                showToast('Challenge updated successfully');
            } catch (err) {
                console.error("Failed to update challenge", err);
                showToast('Failed to update challenge. Please try again.', 'error');
                return; // Don't exit edit mode on failure
            }
        }
        setEditMode(!editMode);
    };

    const cancelEdit = () => {
        if (challenge) {
            setEditTitle(challenge.title);
            setEditSubtitle(challenge.description);
            setEditProblem(challenge.problemStatement);
            setEditOutcome(challenge.expectedOutcome);
        }
        setEditMode(false);
    };

    const handleVote = async () => {
        if (!isAuthenticated || !user?.id) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!challenge || hasVoted) return;

        // Optimistic update
        setHasVoted(true);
        setIsSubscribed(true);
        setChallenge(prev => prev ? {
            ...prev,
            stats: { ...prev.stats, appreciations: prev.stats.appreciations + 1 },
            upVotes: [...(prev.upVotes || []), user.id],
            subscriptions: [...(prev.subscriptions || []), user.id]
        } : prev);

        try {
            await challengeService.toggleUpvote(challenge.id, user.id);
            showToast('Thanks for voting!');
        } catch {
            // Revert on failure
            setHasVoted(false);
            setChallenge(prev => prev ? {
                ...prev,
                stats: { ...prev.stats, appreciations: Math.max(0, prev.stats.appreciations - 1) },
                upVotes: (prev.upVotes || []).filter(id => id !== user.id)
            } : prev);
            showToast('Failed to toggle vote. Please try again.', 'error');
        }
    };

    const handleSubscribe = async () => {
        if (!isAuthenticated || !user?.id) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!challenge || isSubscribed) return;

        // Optimistic update
        setIsSubscribed(true);
        setChallenge(prev => prev ? {
            ...prev,
            subscriptions: [...(prev.subscriptions || []), user.id]
        } : prev);

        try {
            await challengeService.toggleSubscribe(challenge.id, user.id);
            showToast('Subscribed to challenge updates!');
        } catch {
            // Revert on failure
            setIsSubscribed(false);
            setChallenge(prev => prev ? {
                ...prev,
                subscriptions: (prev.subscriptions || []).filter(id => id !== user.id)
            } : prev);
            showToast('Failed to toggle subscription. Please try again.', 'error');
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (challenge) {
            try {
                await challengeService.deleteChallenge(challenge.id);
                showToast('Challenge deleted successfully');
                navigate('/challenges');
            } catch {
                showToast('Failed to delete challenge. Please try again.', 'error');
                setShowDeleteConfirm(false);
            }
        }
    };

    const resetIdeaForm = () => {
        setIdeaTitle('');
        setIdeaDescription('');
        setIdeaDetail('');
        setIdeaErrors({});
    };

    const handleIdeaSubmit = async () => {
        const errors: { title?: string; description?: string; detail?: string } = {};
        if (!ideaTitle.trim()) errors.title = 'Title is required';
        if (!ideaDescription.trim()) errors.description = 'Proposed solution is required';
        if (!ideaDetail.trim()) errors.detail = 'Idea detail is required';

        if (Object.keys(errors).length > 0) {
            setIdeaErrors(errors);
            return;
        }

        if (!challenge) return;

        try {
            // Note: Since we don't have an idea creation API documented yet, we will mock the creation 
            // for the UI momentarily, but ideally this calls `ideaService.createIdea(...)`
            const newId = `ID-PENDING-${Math.floor(Math.random() * 1000)}`;

            const summaryIdea = {
                id: newId,
                title: ideaTitle,
                author: 'Current User', // Will be real user
                status: 'Pending',
                appreciations: 0,
                comments: 0,
                views: 0
            };

            setChallenge(prev => prev ? {
                ...prev,
                ideas: [...(prev.ideas || []), summaryIdea]
            } : prev);

            setNewIdeaId(newId);
            setTimeout(() => setNewIdeaId(null), 2000);

            setShowIdeaModal(false);
            resetIdeaForm();
            showToast('Idea posted successfully (Mocked)');
        } catch {
            showToast('Failed to submit idea. Please try again.', 'error');
        }
    };

    const handleDeleteIdea = async (ideaId: string) => {
        if (!challenge) return;

        // Trigger exit animation
        setExitingIdeaIds(prev => [...prev, ideaId]);

        // Wait for animation to finish then remove
        setTimeout(async () => {
            try {
                // Mock delete for now, as delete idea endpoint wasn't provided
                setChallenge(prev => prev ? {
                    ...prev,
                    ideas: prev.ideas.filter(i => i.id !== ideaId)
                } : prev);
                setExitingIdeaIds(prev => prev.filter(id => id !== ideaId));
                showToast('Idea deleted successfully (Mocked)');
            } catch {
                setExitingIdeaIds(prev => prev.filter(id => id !== ideaId));
                showToast('Failed to delete idea. Please try again.', 'error');
            }
        }, 400); // Matches .idea-exit-animate duration
    };

    const handlePostComment = async () => {
        if (!isAuthenticated || !user?.id) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!comment.trim() || !challenge) return;

        try {
            const currentUserId = user.id;

            await commentService.createComment({
                userId: currentUserId,
                comment: comment.trim(),
                type: 'CH',
                typeId: challenge.id
            });

            const newComment = {
                author: user.name || 'Current User',
                avatar: getInitials(user.name),
                avatarColor: 'var(--accent-purple)',
                text: comment.trim(),
                time: 'Just now'
            };

            setChallenge(prev => prev ? {
                ...prev,
                stats: { ...prev.stats, comments: prev.stats.comments + 1 },
                activity: [newComment, ...prev.activity]
            } : prev);

            setComment('');
            showToast('Comment posted successfully');
        } catch {
            showToast('Failed to post comment. Please try again.', 'error');
        }
    };

    const contributorsMap: Record<string, { totalAppreciations: number, initial: string, color: string, authorId?: string }> = {};
    const validIdeas = challenge.ideas || [];
    validIdeas.forEach(idea => {
        if (!contributorsMap[idea.author]) {
            const parts = idea.author.split(' ');
            const initial = parts.length > 1 ? `${parts[0].charAt(0)}${parts[1].charAt(0)}` : idea.author.substring(0, 2).toUpperCase();
            const colors = ['var(--accent-teal)', 'var(--accent-blue)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-orange)'];
            const color = colors[idea.author.charCodeAt(0) % colors.length];
            contributorsMap[idea.author] = { totalAppreciations: 0, initial, color, authorId: idea.authorId };
        }
        contributorsMap[idea.author].totalAppreciations += idea.appreciations;
    });

    const topContributors = Object.entries(contributorsMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.totalAppreciations - a.totalAppreciations)
        .slice(0, 5);

    return (
        <div className={`detail-page-container fade-in`}>

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a onClick={() => navigate('/')}>Home</a>
                <span className="sep">/</span>
                <a onClick={() => navigate('/challenges')}>Challenges</a>
                <span className="sep">/</span>
                <span className="current">{challenge.id}</span>
            </div>

            {/* Page Header */}
            <div className="detail-page-header">
                <div className="detail-page-header-top">
                    <div className="detail-page-header-left">
                        <div className="detail-challenge-id">
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', color: challenge.accentColor ? `var(--accent-${challenge.accentColor})` : 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                            </span>
                            <span>{challenge.id}</span>
                        </div>
                        {editMode ? (
                            <>
                                <textarea className="detail-page-title edit-mode" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                <textarea className="detail-page-subtitle edit-mode" value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} />
                            </>
                        ) : (
                            <>
                                <h1 className="detail-page-title">{challenge.title}</h1>
                                <p className="detail-page-subtitle">{challenge.description}</p>
                            </>
                        )}
                    </div>
                    {isAuthenticated && challenge.owner.name === 'Current User' && (
                        <div className="detail-page-header-right">
                            {editMode ? (
                                <>
                                    <button className="btn-save btn-sm" onClick={toggleEdit}>Save</button>
                                    <button className="btn-cancel btn-sm" onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <button className="btn-secondary btn-sm" onClick={toggleEdit}>Edit</button>
                            )}
                        </div>
                    )}
                </div>
                <div className="detail-meta-row">
                    <div className="detail-meta-item" onClick={() => navigate(`/profile/${challenge.owner.id || ''}`)} style={{ cursor: 'pointer' }} title={`View ${challenge.owner.name}'s Profile`}>
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></span>
                        <span>Author: <strong style={{ color: 'var(--accent-blue)' }}>{challenge.owner.name}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
                        <span>Created: <strong>{challenge.createdDate}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg></span>
                        <span>Updated: <strong>{challenge.updatedDate}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        {(() => {
                            const brand = STAGE_BRANDING[challenge.stage] || STAGE_BRANDING['Challenge Submitted'];
                            return (
                                <>
                                    <span className="icon" style={{ color: brand.color }}>
                                        {brand.icon}
                                    </span>
                                    <span className="status-badge" style={{ background: brand.bg, color: brand.color }}>
                                        {challenge.stage}
                                    </span>
                                </>
                            );
                        })()}
                    </div>
                    <div className="detail-meta-item">
                        {(() => {
                            const priority = (challenge.priority as string) || 'Medium';
                            const brand = PRIORITY_BRANDING[priority] || PRIORITY_BRANDING['Medium'];
                            return (
                                <div className="stage-badge" style={{
                                    background: brand.bg,
                                    color: brand.color,
                                    border: `1px solid ${brand.border}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '10px'
                                }}>
                                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: brand.color }} />
                                    {priority} Impact
                                </div>
                            );
                        })()}
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
                                <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></span>
                                <span>Problem Statement</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editProblem} onChange={e => setEditProblem(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{challenge.problemStatement}</div>
                        )}
                    </div>

                    {/* Expected Outcome */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg></span>
                                <span>Expected Outcome</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editOutcome} onChange={e => setEditOutcome(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{challenge.expectedOutcome}</div>
                        )}
                    </div>

                    {/* Additional Details */}
                    <div className="sc-form-section" style={{ marginBottom: '24px' }}>
                        <h2 className="sc-section-title">
                            <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg></span>
                            Additional Details
                        </h2>
                        <div className="sc-section-divider"></div>

                        <div className="sc-form-grid" style={{ marginTop: '16px' }}>
                            {/* OpCo & Platform */}
                            <div className="sc-form-group">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>OpCo</label>
                                <div style={{ fontWeight: 500 }}>{challenge.businessUnit || 'Albert Heijn'}</div>
                            </div>
                            <div className="sc-form-group">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>Platform</label>
                                <div style={{ fontWeight: 500 }}>{challenge.department || 'STP'}</div>
                            </div>

                            <div className="sc-form-group">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>Expected Timeline</label>
                                <div style={{ fontWeight: 500 }}>{challenge.timeline || 'Not specified'}</div>
                            </div>

                            {/* Portfolio Option */}
                            <div className="sc-form-group">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>Portfolio Option</label>
                                <div style={{ fontWeight: 500 }}>{challenge.portfolioOption || 'Not specified'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Context */}
                    <div className="sc-form-section" style={{ marginBottom: '24px' }}>
                        <h2 className="sc-section-title">
                            <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg></span>
                            Additional Context
                        </h2>
                        <div className="sc-section-divider"></div>

                        <div className="sc-form-grid" style={{ marginTop: '16px' }}>
                            {/* Tags */}
                            <div className="sc-form-group sc-full-width">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>Tags</label>
                                <div className="detail-tags-list" style={{ marginTop: '8px' }}>
                                    {challenge.challengeTags && challenge.challengeTags.length > 0 ? (
                                        challenge.challengeTags.map(tag => (
                                            <span key={tag} className="detail-tag">{tag}</span>
                                        ))
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No tags specified</span>
                                    )}
                                </div>
                            </div>

                            {/* Workarounds or Constraints */}
                            <div className="sc-form-group sc-full-width">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>Current Workarounds or Constraints</label>
                                <div style={{ marginTop: '8px', lineHeight: '1.6' }}>{challenge.constraints || 'None specified'}</div>
                            </div>

                            {/* Stakeholders */}
                            <div className="sc-form-group sc-full-width">
                                <label className="sc-form-label" style={{ color: 'var(--text-muted)' }}>Stakeholders or Teams Involved</label>
                                <div style={{ marginTop: '8px', fontWeight: 500 }}>{challenge.stakeholders || 'None specified'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Activity & Comments */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg></span>
                                <span>Comments</span>
                            </div>
                        </div>

                        <div className="detail-activity-feed">
                            {challenge.activity.map((act, i) => (
                                <div key={i} className="detail-activity-item">
                                    <div className="detail-activity-avatar" style={{ background: act.avatarColor, cursor: 'pointer' }} onClick={() => navigate(`/profile/${act.authorId || ''}`)} title={`View ${act.author}'s Profile`}>{act.avatar}</div>
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
                                placeholder="Add a comment..."
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
                                className="btn btn-primary"
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
                    {/* Engagement Stats */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ justifyContent: 'flex-start' }}>
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-4"></path></svg>
                            </span>
                            Engagement Stats
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Views</span>
                            <span className="detail-stat-value blue">{challenge.stats.views}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Votes</span>
                            <span className="detail-stat-value green">{challenge.stats.appreciations}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Comments</span>
                            <span className="detail-stat-value orange">{challenge.stats.comments}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Ideas Submitted</span>
                            <span className="detail-stat-value green">{validIdeas.length}</span>
                        </div>
                    </div>

                    {/* Related Ideas */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z"></path></svg>
                                </span>
                                <span>Solution Ideas</span>
                            </div>
                            <button className="add-idea-btn" onClick={() => { if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; } setShowIdeaModal(true); }}>Add Idea</button>
                        </div>
                        <div className="detail-ideas-list">
                            {validIdeas.filter(idea => ['Accepted', 'In Review', 'Pending'].includes(idea.status)).map(idea => {
                                const isExiting = exitingIdeaIds.includes(idea.id);
                                const isNew = newIdeaId === idea.id;

                                return (
                                    <div
                                        key={idea.id}
                                        className={`detail-linked-challenge ${isExiting ? 'idea-exit-animate' : ''} ${isNew ? 'idea-entry-animate' : ''}`}
                                        style={{ marginBottom: '8px', position: 'relative' }}
                                    >
                                        <div onClick={() => navigate(`/challenges/${challenge.id}/ideas/${idea.id}`)} style={{ cursor: 'pointer', width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div className="challenge-id-text">{idea.id}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '600', background: 'rgba(76, 175, 80, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                                                        {idea.appreciations} <span style={{ fontSize: '10px' }}>likes</span>
                                                    </div>
                                                    {isAuthenticated && idea.author === 'Current User' && (
                                                        <button
                                                            className="idea-delete-action-btn"
                                                            title="Delete Idea"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteIdea(idea.id);
                                                            }}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: '4px',
                                                                cursor: 'pointer',
                                                                color: 'var(--text-muted)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                borderRadius: '4px',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent-red)'}
                                                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <div className="challenge-title-text" style={{ whiteSpace: 'normal', lineHeight: '1.4' }}>{idea.title}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>by {idea.author}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ justifyContent: 'flex-start' }}>
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            </span>
                            Top Contributors
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-end', alignItems: 'center' }}>
                                {(() => {
                                    const allContributorNames = Object.keys(contributorsMap);
                                    const totalContributorsCount = allContributorNames.length;
                                    const displayCount = 5;
                                    const extraCount = totalContributorsCount > displayCount ? totalContributorsCount - displayCount : 0;

                                    if (totalContributorsCount === 0) return <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No contributors yet</div>;

                                    return (
                                        <>
                                            {/* Extra count indicator */}
                                            {extraCount > 0 && (
                                                <div style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    borderRadius: '50%',
                                                    background: 'var(--bg-card-light)',
                                                    border: '2px solid var(--bg-card)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    fontWeight: '700',
                                                    color: 'var(--text-muted)',
                                                    marginLeft: '-10px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                                    zIndex: 0,
                                                    position: 'relative'
                                                }}>
                                                    +{extraCount}
                                                </div>
                                            )}

                                            {/* Top contributors avatars */}
                                            {topContributors.slice(0, displayCount).reverse().map((contributor, i) => (
                                                <div
                                                    key={contributor.name}
                                                    onClick={() => navigate(`/profile/${contributor.authorId || ''}`)}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: contributor.color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '700',
                                                        fontSize: '13px',
                                                        color: '#0d0f1a',
                                                        border: '2px solid var(--bg-card)',
                                                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                                                        cursor: 'pointer',
                                                        marginLeft: i === topContributors.length - 1 ? '0' : '-10px',
                                                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                        zIndex: i + 1,
                                                        position: 'relative'
                                                    }}
                                                    title={`${contributor.name} (${contributor.totalAppreciations} likes)`}
                                                    onMouseOver={e => {
                                                        e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
                                                        e.currentTarget.style.zIndex = '50';
                                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
                                                    }}
                                                    onMouseOut={e => {
                                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                        e.currentTarget.style.zIndex = (i + 1).toString();
                                                        e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
                                                    }}
                                                >
                                                    {contributor.initial}
                                                </div>
                                            ))}
                                        </>
                                    );
                                })()}
                            </div>
                            {Object.keys(contributorsMap).length > 0 && (
                                <div style={{
                                    fontSize: '11px',
                                    color: '#ffffff',
                                    fontWeight: '700',
                                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                    letterSpacing: '0.3px',
                                    textTransform: 'uppercase'
                                }}>
                                    {Object.keys(contributorsMap).length} {Object.keys(contributorsMap).length === 1 ? 'contributor' : 'contributors'}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title" style={{ justifyContent: 'flex-start' }}>
                            <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            </span>
                            Quick Actions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                className={`btn btn-secondary ${hasVoted ? 'active animate-pop' : ''}`}
                                onClick={handleVote}
                                key={`vote-${hasVoted}`}
                                disabled={hasVoted}
                                title={hasVoted ? "You have already voted for this challenge" : ""}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: hasVoted ? 0.7 : 1,
                                    cursor: hasVoted ? 'default' : 'pointer',
                                    color: hasVoted ? 'var(--accent-orange)' : '',
                                    borderColor: hasVoted ? 'var(--accent-orange)' : ''
                                }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={hasVoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                </span>
                                {hasVoted ? 'Voted' : 'Vote for This'}
                            </button>
                            <button
                                className={`btn btn-secondary ${isSubscribed ? 'active animate-pop' : ''}`}
                                onClick={handleSubscribe}
                                key={`sub-${isSubscribed}`}
                                disabled={isSubscribed}
                                title={isSubscribed ? "You are already subscribed to this challenge" : ""}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: isSubscribed ? 0.7 : 1,
                                    cursor: isSubscribed ? 'default' : 'pointer',
                                    color: isSubscribed ? 'var(--accent-green)' : '',
                                    borderColor: isSubscribed ? 'var(--accent-green)' : ''
                                }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isSubscribed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                </span>
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                            {isAuthenticated && challenge.owner.name === 'Current User' && (
                                <button
                                    className="btn btn-danger animate-pop"
                                    onClick={handleDelete}
                                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span>
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Add Idea Modal */}
            {
                showIdeaModal && createPortal(
                    <div className="detail-modal-overlay" onClick={() => setShowIdeaModal(false)}>
                        <div className="detail-modal-dialog" onClick={e => e.stopPropagation()}>
                            <div className="detail-modal-header">
                                <h2>Submit New Idea</h2>
                                <button className="detail-modal-close" onClick={() => setShowIdeaModal(false)}>✕</button>
                            </div>
                            <div className="detail-modal-body">
                                <div className="submit-form-field">
                                    <label>Idea Title <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Enter a descriptive title for your idea..."
                                        value={ideaTitle}
                                        onChange={(e) => {
                                            setIdeaTitle(e.target.value);
                                            if (ideaErrors.title) setIdeaErrors(prev => ({ ...prev, title: undefined }));
                                        }}
                                        style={{ borderColor: ideaErrors.title ? 'var(--accent-red)' : 'var(--border)' }}
                                    />
                                    {ideaErrors.title && <span style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{ideaErrors.title}</span>}
                                    <span className="hint">Keep it concise and descriptive (max 100 characters)</span>
                                </div>
                                <div className="submit-form-field">
                                    <label>Idea Detail <span className="required">*</span></label>
                                    <textarea
                                        placeholder="Describe your idea in detail. How would it work? What are the specific components?"
                                        value={ideaDetail}
                                        onChange={(e) => {
                                            setIdeaDetail(e.target.value);
                                            if (ideaErrors.detail) setIdeaErrors(prev => ({ ...prev, detail: undefined }));
                                        }}
                                        style={{ borderColor: ideaErrors.detail ? 'var(--accent-red)' : 'var(--border)' }}
                                        rows={4}
                                    />
                                    {ideaErrors.detail && <span style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{ideaErrors.detail}</span>}
                                    <span className="hint">Include technical details and specific features</span>
                                </div>
                                <div className="submit-form-field">
                                    <label>Proposed Solution <span className="required">*</span></label>
                                    <textarea
                                        placeholder="Describe your proposed solution at a high level. What is the core idea?"
                                        value={ideaDescription}
                                        onChange={(e) => {
                                            setIdeaDescription(e.target.value);
                                            if (ideaErrors.description) setIdeaErrors(prev => ({ ...prev, description: undefined }));
                                        }}
                                        style={{ borderColor: ideaErrors.description ? 'var(--accent-red)' : 'var(--border)' }}
                                    />
                                    {ideaErrors.description && <span style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{ideaErrors.description}</span>}
                                    <span className="hint">Focus on the value proposition and core concept</span>
                                </div>
                                <div className="submit-form-actions" style={{ padding: '16px 0 0', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button className="btn-cancel" onClick={() => { setShowIdeaModal(false); resetIdeaForm(); }}>Cancel</button>
                                    <button className="btn-save" onClick={handleIdeaSubmit}>Submit Idea</button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Challenge"
                message="Are you sure you want to delete this challenge? This action cannot be undone and will remove it from all views."
                confirmText="Delete Challenge"
            />
        </div >
    );
};
