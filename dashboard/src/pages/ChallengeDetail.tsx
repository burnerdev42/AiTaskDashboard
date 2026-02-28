import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { ChallengeDetailData, Idea } from '../types';
import { storage } from '../services/storage';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

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
        color: 'var(--accent-green)', bg: 'rgba(102,187,106,.15)',
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
    const [ideaStatusFilter, setIdeaStatusFilter] = useState('Active');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const details = storage.getChallengeDetails();
        let found = details.find(c => c.id.toLowerCase() === id?.toLowerCase());

        if (!found) {
            // If the challenge is not in the detailed mock array, try to find it in the basic challenges array
            const basicChallenge = storage.getChallenges().find(c => c.id.toLowerCase() === id?.toLowerCase());

            if (basicChallenge) {
                // Dynamically construct a ChallengeDetailData object
                found = {
                    ...basicChallenge,
                    problemStatement: basicChallenge.description,
                    summary: basicChallenge.summary || basicChallenge.description.substring(0, 100),
                    expectedOutcome: 'Pending detailed assessment',
                    businessUnit: 'Global',
                    department: 'Cross-functional',
                    priority: basicChallenge.impact || 'Medium',
                    estimatedImpact: 'TBD',
                    challengeTags: basicChallenge.tags || [],
                    timeline: 'TBD',
                    portfolioOption: 'TBD',
                    constraints: 'None specified yet',
                    stakeholders: 'TBD',
                    ideas: [],
                    team: basicChallenge.team?.map(t => ({ ...t, role: 'Member', avatar: t.avatar || '', avatarColor: t.avatarColor || 'var(--accent-blue)' })) || [],
                    activity: [],
                    createdDate: 'Recently',
                    updatedDate: 'Just now'
                } as ChallengeDetailData;
            }
        }

        // Simulate API loading
        const timer = setTimeout(() => {
            setChallenge(found || null);
            if (found) {
                setEditTitle(found.title);
                setEditSubtitle(found.summary);
                setEditProblem(found.problemStatement);
                setEditOutcome(found.expectedOutcome);
            }
            setIsLoading(false);
        }, 1000);

        if (searchParams.get('edit') === 'true') {
            setEditMode(true);
        }

        return () => clearTimeout(timer);
    }, [id, searchParams]);

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

    const toggleEdit = () => {
        if (editMode) {
            // Save
            setChallenge(prev => prev ? {
                ...prev,
                title: editTitle,
                summary: editSubtitle,
                problemStatement: editProblem,
                expectedOutcome: editOutcome,
            } : prev);
        }
        setEditMode(!editMode);
    };

    const cancelEdit = () => {
        setEditTitle(challenge.title);
        setEditSubtitle(challenge.summary);
        setEditProblem(challenge.problemStatement);
        setEditOutcome(challenge.expectedOutcome);
        setEditMode(false);
    };

    const handleVote = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setChallenge(prev => prev ? {
            ...prev,
            stats: { ...prev.stats, appreciations: prev.stats.appreciations + (hasVoted ? -1 : 1) }
        } : prev);
        setHasVoted(!hasVoted);
        showToast(hasVoted ? 'Vote removed' : 'Thanks for voting!');
    };

    const handleSubscribe = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setIsSubscribed(!isSubscribed);
        showToast(isSubscribed ? 'Unsubscribed from challenge' : 'Subscribed to challenge updates!');
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (challenge) {
            try {
                storage.deleteChallenge(challenge.id);
                showToast('Challenge deleted successfully');
                navigate('/challenges');
            } catch {
                showToast('Failed to delete challenge. Please try again.', 'error');
            }
        }
    };

    const resetIdeaForm = () => {
        setIdeaTitle('');
        setIdeaDescription('');
        setIdeaDetail('');
        setIdeaErrors({});
    };

    const handleIdeaSubmit = () => {
        const errors: { title?: string; description?: string; detail?: string } = {};
        if (!ideaTitle.trim()) errors.title = 'Title is required';
        if (!ideaDescription.trim()) errors.description = 'Proposed solution is required';
        if (!ideaDetail.trim()) errors.detail = 'Idea detail is required';

        if (Object.keys(errors).length > 0) {
            setIdeaErrors(errors);
            return;
        }

        if (!challenge) return;

        // Generate a new ID
        const currentIdeas = storage.getIdeaDetails();
        const nextIdNumber = currentIdeas.length > 0
            ? Math.max(...currentIdeas.map(i => {
                const parts = i.id.split('-');
                if (parts.length > 1) {
                    const parsed = parseInt(parts[1].replace(/\D/g, ''), 10);
                    return isNaN(parsed) ? 0 : parsed;
                }
                return 0;
            })) + 1
            : 1;
        const newId = `ID-${String(nextIdNumber).padStart(4, '0')}`;

        const newIdea: Idea = {
            id: newId,
            title: ideaTitle,
            description: ideaDescription,
            status: 'Pending',
            owner: {
                name: 'Current User',
                avatar: 'CU',
                avatarColor: 'var(--accent-purple)',
                role: 'Contributor'
            },
            linkedChallenge: { id: challenge.id, title: challenge.title },
            tags: [],
            stats: { appreciations: 0, comments: 0, views: 0 },
            problemStatement: challenge.problemStatement,
            proposedSolution: ideaDetail,
            expectedImpact: 'TBD',
            submittedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            lastUpdated: 'Just now',
            activity: [],
            approvalStatus: 'Pending'
        };

        try {
            // Save to storage
            storage.addIdea(challenge.id, newIdea);

            // Update local state - the UI uses challenge.ideas (which are summary objects)
            const summaryIdea = {
                id: newIdea.id,
                title: newIdea.title,
                author: newIdea.owner.name,
                status: newIdea.status,
                appreciations: newIdea.stats.appreciations,
                comments: newIdea.stats.comments,
                views: newIdea.stats.views
            };

            setChallenge(prev => prev ? {
                ...prev,
                ideas: [...(prev.ideas || []), summaryIdea]
            } : prev);

            setNewIdeaId(newId);
            setTimeout(() => setNewIdeaId(null), 2000);

            setShowIdeaModal(false);
            resetIdeaForm();
            showToast('Idea submitted — waiting for admin approval');
        } catch {
            showToast('Failed to submit idea. Please try again.', 'error');
        }
    };

    const handleDeleteIdea = (ideaId: string) => {
        if (!challenge) return;

        // Trigger exit animation
        setExitingIdeaIds(prev => [...prev, ideaId]);

        // Wait for animation to finish then remove
        setTimeout(() => {
            try {
                storage.deleteIdea(challenge.id, ideaId);
                setChallenge(prev => prev ? {
                    ...prev,
                    ideas: prev.ideas.filter(i => i.id !== ideaId)
                } : prev);
                setExitingIdeaIds(prev => prev.filter(id => id !== ideaId));
                showToast('Idea deleted successfully');
            } catch {
                setExitingIdeaIds(prev => prev.filter(id => id !== ideaId));
                showToast('Failed to delete idea. Please try again.', 'error');
            }
        }, 400); // Matches .idea-exit-animate duration
    };

    const handlePostComment = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!comment.trim()) return;

        const newComment = {
            author: 'Current User', // In a real app, this would be the logged-in user
            avatar: 'CU',
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
    };

    // Calculate top contributors for the sidebar
    const contributorsMap: Record<string, { totalAppreciations: number, initial: string, color: string }> = {};
    const validIdeas = challenge.ideas || [];
    validIdeas.forEach(idea => {
        if (!contributorsMap[idea.author]) {
            const parts = idea.author.split(' ');
            const initial = parts.length > 1 ? `${parts[0].charAt(0)}${parts[1].charAt(0)}` : idea.author.substring(0, 2).toUpperCase();
            const colors = ['var(--accent-teal)', 'var(--accent-blue)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-orange)'];
            const color = colors[idea.author.charCodeAt(0) % colors.length];
            contributorsMap[idea.author] = { totalAppreciations: 0, initial, color };
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

            {/* Pending Approval Banner */}
            {challenge.approvalStatus === 'Pending' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255,238,88,.08)',
                    border: '1px solid rgba(255,238,88,.25)',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,238,88,.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-yellow)', marginBottom: '2px' }}>Pending Admin Approval</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>This challenge is waiting for an admin to review and approve it. Some features are limited until then.</div>
                    </div>
                </div>
            )}

            {challenge.approvalStatus === 'Rejected' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(239,83,80,.08)',
                    border: '1px solid rgba(239,83,80,.25)',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(239,83,80,.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '2px' }}>Challenge Declined</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>This challenge has been reviewed and declined by an admin.</div>
                        {(challenge as any).rejectionReason && (
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', padding: '8px 12px', background: 'rgba(239,83,80,.06)', borderRadius: '8px', borderLeft: '3px solid var(--accent-red)' }}>
                                <strong>Reason:</strong> {(challenge as any).rejectionReason}
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                                <p className="detail-page-subtitle">{challenge.summary}</p>
                            </>
                        )}
                    </div>
                    <div className="detail-page-header-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {!editMode && challenge.approvalStatus !== 'Pending' && challenge.approvalStatus !== 'Rejected' && (
                            <button
                                className="btn btn-primary"
                                style={{ height: '38px', padding: '0 20px', fontSize: '13px' }}
                                onClick={() => { if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; } setShowIdeaModal(true); }}
                            >
                                Post Idea
                            </button>
                        )}
                        {isAuthenticated && (challenge.owner.name === 'Current User' || user?.role === 'Admin') && (
                            <>
                                {editMode ? (
                                    <>
                                        <button className="btn btn-primary" style={{ height: '38px', padding: '0 20px', fontSize: '13px' }} onClick={toggleEdit}>Save</button>
                                        <button className="btn btn-secondary" style={{ height: '38px', padding: '0 20px', fontSize: '13px' }} onClick={cancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-secondary" style={{ height: '38px', padding: '0 20px', fontSize: '13px' }} onClick={toggleEdit}>Edit</button>
                                        {user?.role === 'Admin' && (
                                            <button className="btn btn-secondary" style={{ height: '38px', padding: '0 20px', fontSize: '13px', color: 'var(--accent-red)', borderColor: 'rgba(239, 83, 80, 0.2)' }} onClick={handleDelete}>Delete</button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="detail-meta-row">
                    <div className="detail-meta-item" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} title="View Profile">
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
                    {challenge.approvalStatus !== 'Pending' && challenge.approvalStatus !== 'Rejected' && (
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
                                        <div className="detail-activity-avatar" style={{ background: act.avatarColor, cursor: 'pointer' }} onClick={() => navigate('/profile')} title={`View ${act.author}'s Profile`}>{act.avatar}</div>
                                        <div className="detail-activity-content">
                                            <div className="detail-activity-header">
                                                <span className="detail-activity-author" style={{ cursor: 'pointer', color: 'var(--text)' }} onClick={() => navigate('/profile')} title={`View ${act.author}'s Profile`} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text)'}>{act.author}</span>
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
                    )}
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
                            <span className="detail-stat-value blue">247</span>
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

                    {/* Submitted Ideas — Highlighted Section */}
                    <div className="detail-sidebar-section" style={{ background: 'linear-gradient(135deg, rgba(232,167,88,.08), rgba(240,184,112,.05))', border: '2px solid var(--accent-teal)' }}>
                        <div className="detail-sidebar-title" style={{ justifyContent: 'space-between', color: 'var(--accent-teal)', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z"></path></svg>
                                </span>
                                <span>Submitted Ideas</span>
                            </div>
                            <span style={{ background: 'rgba(232,167,88,.2)', color: 'var(--accent-teal)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>{validIdeas.length}</span>
                        </div>
                        {/* Idea Filter Tabs */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                            {[
                                { id: 'All', dot: 'var(--accent-teal)', count: validIdeas.length },
                                { id: 'Active', dot: 'var(--accent-green)', count: validIdeas.filter(i => i.status === 'Accepted' || i.status === 'In Review').length },
                                { id: 'Pending', dot: 'var(--accent-yellow)', count: validIdeas.filter(i => i.status === 'Pending').length },
                                { id: 'Declined', dot: 'var(--accent-red)', count: validIdeas.filter(i => i.status === 'Declined').length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setIdeaStatusFilter(tab.id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 12px',
                                        borderRadius: '16px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        border: '1px solid ' + (ideaStatusFilter === tab.id ? 'var(--accent-teal)' : 'var(--border)'),
                                        background: ideaStatusFilter === tab.id ? 'rgba(232,167,88,.12)' : 'var(--bg-card)',
                                        color: ideaStatusFilter === tab.id ? 'var(--accent-teal)' : 'var(--text-secondary)',
                                        transition: 'all 0.2s',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', color: tab.dot }}>
                                        {tab.id === 'All' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>}
                                        {tab.id === 'Active' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                                        {tab.id === 'Pending' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                                        {tab.id === 'Declined' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
                                    </span>
                                    {tab.id}
                                    <span style={{ background: 'rgba(255,255,255,.08)', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>{tab.count}</span>
                                </button>
                            ))}
                        </div>
                        <div className="detail-ideas-list">
                            {(() => {
                                const filteredIdeas = validIdeas.filter(idea => {
                                    if (ideaStatusFilter === 'Active') {
                                        return idea.status === 'Accepted' || idea.status === 'In Review';
                                    } else if (ideaStatusFilter === 'Pending') {
                                        return idea.status === 'Pending';
                                    } else if (ideaStatusFilter === 'Declined') {
                                        return idea.status === 'Declined';
                                    }
                                    return true;
                                });

                                if (filteredIdeas.length === 0) {
                                    return (
                                        <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            <div style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.5 }}>💡</div>
                                            <div>{ideaStatusFilter === 'All' ? 'No ideas submitted yet' : `No ${ideaStatusFilter.toLowerCase()} ideas for this challenge`}</div>
                                        </div>
                                    );
                                }

                                return filteredIdeas.map(idea => {
                                    const isExiting = exitingIdeaIds.includes(idea.id);
                                    const isNew = newIdeaId === idea.id;

                                    return (
                                        <div
                                            key={idea.id}
                                            className={`detail-linked-challenge ${isExiting ? 'idea-exit-animate' : ''} ${isNew ? 'idea-entry-animate' : ''}`}
                                            style={{ marginBottom: '8px', position: 'relative' }}
                                        >
                                            <div onClick={() => navigate(`/challenges/${challenge.id?.toLowerCase()}/ideas/${idea.id?.toLowerCase()}`)} style={{ cursor: 'pointer', width: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <div className="challenge-id-text">{idea.id}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '600', background: 'rgba(76, 175, 80, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                                                            {idea.appreciations} <span style={{ fontSize: '10px' }}>likes</span>
                                                        </div>
                                                        {isAuthenticated && (idea.author === 'Current User' || user?.role === 'Admin') && (
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
                                });
                            })()}
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
                                                    onClick={() => navigate('/profile')}
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
                    {challenge.approvalStatus !== 'Pending' && challenge.approvalStatus !== 'Rejected' && (
                        <div className="detail-sidebar-section">
                            <div className="detail-sidebar-title" style={{ justifyContent: 'flex-start' }}>
                                <span className="icon" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', color: 'var(--accent-teal)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                </span>
                                Quick Actions
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button
                                    className={`btn btn-secondary ${hasVoted ? 'animate-pop' : ''}`}
                                    onClick={handleVote}
                                    key={`vote-${hasVoted}`}
                                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', color: hasVoted ? 'var(--accent-blue)' : 'inherit', borderColor: hasVoted ? 'var(--accent-blue)' : 'var(--border)' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                        {hasVoted ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                        )}
                                    </span>
                                    {hasVoted ? 'Voted' : 'Vote for This'}
                                </button>
                                <button
                                    className={`btn btn-secondary ${isSubscribed ? 'animate-pop' : ''}`}
                                    onClick={handleSubscribe}
                                    key={`sub-${isSubscribed}`}
                                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', color: isSubscribed ? 'var(--accent-green)' : 'inherit', borderColor: isSubscribed ? 'var(--accent-green)' : 'var(--border)' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                        {isSubscribed ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M9 11l2 2 4-4"></path></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                        )}
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
                    )}
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
            />
        </div>
    );
};
