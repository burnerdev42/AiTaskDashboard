import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { IdeaService } from '../services/ideaService';
import { ChallengeService } from '../services/challengeService';
import type { Idea, Challenge } from '../types';

export const IdeaDetail: React.FC = () => {
    const { challengeId, ideaId } = useParams<{ challengeId: string; ideaId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [idea, setIdea] = useState<Idea | null>(null);
    const [parentChallenge, setParentChallenge] = useState<Challenge | null>(null);
    const [comment, setComment] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editProblem, setEditProblem] = useState('');
    const [editSolution, setEditSolution] = useState('');
    const [editImpact, setEditImpact] = useState('');
    const [editPlan, setEditPlan] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (challengeId) {
                try {
                    const c = await ChallengeService.getById(challengeId);
                    setParentChallenge(c);
                } catch (e) {
                    console.error("Failed to load parent challenge", e);
                }
            }

            if (ideaId) {
                try {
                    const found = await IdeaService.getById(ideaId);
                    setIdea(found);
                    setEditTitle(found.title);
                    setEditDescription(found.description);
                    setEditProblem(found.problemStatement || '');
                    setEditSolution(found.proposedSolution || '');
                    setEditImpact(found.expectedImpact || '');
                    setEditPlan(found.implementationPlan || '');
                    if (searchParams.get('edit') === 'true') {
                        setEditMode(true);
                    }
                } catch (e) {
                    console.error("Failed to load idea", e);
                }
            }
        };
        loadData();
    }, [challengeId, ideaId, searchParams]);

    if (!idea) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

    const toggleEdit = () => {
        if (editMode) {
            setIdea(prev => prev ? {
                ...prev,
                title: editTitle,
                description: editDescription,
                problemStatement: editProblem,
                proposedSolution: editSolution,
                expectedImpact: editImpact,
                implementationPlan: editPlan,
            } : prev);
        }
        setEditMode(!editMode);
    };

    const cancelEdit = () => {
        setEditTitle(idea.title);
        setEditDescription(idea.description);
        setEditProblem(idea.problemStatement || '');
        setEditSolution(idea.proposedSolution || '');
        setEditImpact(idea.expectedImpact || '');
        setEditPlan(idea.implementationPlan || '');
        setEditMode(false);
    };

    return (
        <div className="detail-page-container">

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a onClick={() => navigate('/')}>Home</a>
                <span className="sep">/</span>
                <a onClick={() => navigate('/challenges')}>Challenges</a>
                <span className="sep">/</span>
                <a onClick={() => navigate(`/challenges/${challengeId}`)}>
                    {parentChallenge ? parentChallenge.title : challengeId}
                </a>
                <span className="sep">/</span>
                <span className="current">{idea.id}</span>
            </div>

            {/* Page Header */}
            <div className="detail-page-header">
                <div className="detail-page-header-top">
                    <div className="detail-page-header-left">
                        <div className="detail-idea-id">
                            <span className="icon">💡</span>
                            <span>{idea.id}</span>
                        </div>
                        {editMode ? (
                            <>
                                <textarea className="detail-page-title edit-mode" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                <textarea className="detail-page-subtitle edit-mode" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                            </>
                        ) : (
                            <>
                                <h1 className="detail-page-title">{idea.title}</h1>
                                <p className="detail-page-subtitle">{idea.description}</p>
                            </>
                        )}
                        <div className="header-badges">
                            <span className={`status-badge ${idea.status.toLowerCase()}`}>⚫ {idea.status}</span>
                            {idea.impactLevel && (
                                <span className="detail-tag">📊 {idea.impactLevel} Impact</span>
                            )}
                            {idea.tags.map(tag => (
                                <span key={tag} className="detail-tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="detail-page-header-right">
                        {editMode ? (
                            <>
                                <button className="btn btn-primary" onClick={toggleEdit}>💾 Save</button>
                                <button className="btn btn-secondary" onClick={cancelEdit}>✖️ Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-secondary" onClick={toggleEdit}>✏️ Edit</button>
                                <button className="btn btn-primary">👍 Appreciate</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="detail-meta-row">
                    <div className="detail-meta-item">
                        <span className="icon">👤</span>
                        <span>Author: <strong>{idea.owner.name}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon">📅</span>
                        <span>Submitted: <strong>{idea.submittedDate}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon">🔄</span>
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
                                <span className="icon">❗</span>
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
                                <span className="icon">🛠️</span>
                                <span>Proposed Solution</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editSolution} onChange={e => setEditSolution(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{idea.proposedSolution}</div>
                        )}
                    </div>

                    {/* Expected Impact */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon">📊</span>
                                <span>Expected Impact</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editImpact} onChange={e => setEditImpact(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{idea.expectedImpact}</div>
                        )}
                    </div>

                    {/* Implementation Approach */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon">📋</span>
                                <span>Implementation Approach</span>
                            </div>
                        </div>
                        {editMode ? (
                            <textarea className="detail-section-content edit-mode" value={editPlan} onChange={e => setEditPlan(e.target.value)} />
                        ) : (
                            <div className="detail-section-content">{idea.implementationPlan}</div>
                        )}
                    </div>

                    {/* Activity & Comments */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon">💬</span>
                                <span>Activity & Comments</span>
                            </div>
                        </div>

                        <div className="detail-activity-feed">
                            {idea.activity?.map((act, i) => (
                                <div key={i} className="detail-activity-item">
                                    <div className="detail-activity-avatar" style={{ background: act.avatarColor }}>{act.avatar}</div>
                                    <div className="detail-activity-content">
                                        <div className="detail-activity-header">
                                            <span className="detail-activity-author">{act.author}</span>
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
                            />
                            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>💬 Post Comment</button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside>
                    {/* Linked Challenge */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">🔗 Parent Challenge</div>
                        <a
                            className="detail-linked-challenge"
                            onClick={() => navigate(`/challenges/${challengeId}`)}
                        >
                            <span className="challenge-icon">🎯</span>
                            <div>
                                <div className="challenge-id-text">{challengeId}</div>
                                <div className="challenge-title-text">{parentChallenge?.title || 'View Challenge'}</div>
                            </div>
                        </a>
                    </div>

                    {/* Engagement Stats */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">📊 Metrics</div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Appreciations</span>
                            <span className="detail-stat-value green">{idea.stats.appreciations}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Comments</span>
                            <span className="detail-stat-value orange">{idea.stats.comments}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Views</span>
                            <span className="detail-stat-value blue">{idea.stats.views}</span>
                        </div>
                        {idea.expectedSavings && (
                            <div className="detail-stat-row">
                                <span className="detail-stat-label">Expected Savings</span>
                                <span className="detail-stat-value green">{idea.expectedSavings}</span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">📋 Details</div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Status</span>
                            <span className={`status-badge ${idea.status.toLowerCase()}`}>{idea.status}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Impact Level</span>
                            <span className={`detail-tag`}>{idea.impactLevel || 'N/A'}</span>
                        </div>
                        <div className="detail-stat-row">
                            <span className="detail-stat-label">Submitted</span>
                            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{idea.submittedDate}</span>
                        </div>
                    </div>

                    {/* Owner */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">👤 Owner</div>
                        <div className="detail-owner-info">
                            <div className="detail-owner-avatar" style={{ background: idea.owner.avatarColor }}>{idea.owner.avatar}</div>
                            <div>
                                <div className="detail-owner-name">{idea.owner.name}</div>
                                <div className="detail-owner-role">{idea.owner.role || 'Contributor'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">⚡ Quick Actions</div>
                        <div className="detail-quick-actions">
                            <button className="btn btn-primary">👍 Appreciate Idea</button>
                            <button className="btn btn-secondary">🔔 Subscribe</button>
                            <button className="btn btn-secondary">📤 Share</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
