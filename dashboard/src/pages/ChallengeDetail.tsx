import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challengeDetails } from '../data/challengeData';
import type { ChallengeDetailData } from '../types';

export const ChallengeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const [challenge, setChallenge] = useState<ChallengeDetailData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [showIdeaModal, setShowIdeaModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editSubtitle, setEditSubtitle] = useState('');
    const [editProblem, setEditProblem] = useState('');
    const [editOutcome, setEditOutcome] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Find by id or default to first
        const found = challengeDetails.find(c => c.id === id) || challengeDetails[0];
        setChallenge(found);
        setEditTitle(found.title);
        setEditSubtitle(found.description);
        setEditProblem(found.problemStatement);
        setEditOutcome(found.expectedOutcome);
        // Auto-enable edit mode if ?edit=true
        if (searchParams.get('edit') === 'true') {
            setEditMode(true);
        }
    }, [id, searchParams]);

    if (!challenge) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

    const toggleEdit = () => {
        if (editMode) {
            // Save
            setChallenge(prev => prev ? {
                ...prev,
                title: editTitle,
                description: editSubtitle,
                problemStatement: editProblem,
                expectedOutcome: editOutcome,
            } : prev);
        }
        setEditMode(!editMode);
    };

    const cancelEdit = () => {
        setEditTitle(challenge.title);
        setEditSubtitle(challenge.description);
        setEditProblem(challenge.problemStatement);
        setEditOutcome(challenge.expectedOutcome);
        setEditMode(false);
    };

    const getStatusClass = (status: string) => status.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="detail-page-container">

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
                            <span className="priority-dot"></span>
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
                    <div className="detail-page-header-right">
                        {editMode ? (
                            <>
                                <button className="btn btn-primary" onClick={toggleEdit}>💾 Save</button>
                                <button className="btn btn-secondary" onClick={cancelEdit}>✖️ Cancel</button>
                            </>
                        ) : (
                            <button className="btn btn-secondary" onClick={toggleEdit}>✏️ Edit</button>
                        )}
                    </div>
                </div>
                <div className="detail-meta-row">
                    <div className="detail-meta-item">
                        <span className="icon">👤</span>
                        <span>Owner: <strong>{challenge.owner.name}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon">📅</span>
                        <span>Created: <strong>{challenge.createdDate}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon">🔄</span>
                        <span>Updated: <strong>{challenge.updatedDate}</strong></span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="icon">🏷️</span>
                        <span className={`status-badge ${getStatusClass('Challenge Submitted')}`}>⚫ Challenge Submitted</span>
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
                            <div className="detail-section-content">{challenge.problemStatement}</div>
                        )}
                    </div>

                    {/* Expected Outcome */}
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon">🎯</span>
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
                    <div className="detail-content-section">
                        <div className="detail-section-header">
                            <div className="detail-section-title">
                                <span className="icon">📋</span>
                                <span>Additional Details</span>
                            </div>
                        </div>
                        <div className="detail-form-grid">
                            <div className="detail-form-group">
                                <label className="detail-form-label">Business Unit</label>
                                <input type="text" className="detail-form-input" value={challenge.businessUnit} readOnly={!editMode} />
                            </div>
                            <div className="detail-form-group">
                                <label className="detail-form-label">Department</label>
                                <input type="text" className="detail-form-input" value={challenge.department} readOnly={!editMode} />
                            </div>
                            <div className="detail-form-group">
                                <label className="detail-form-label">Priority</label>
                                <select className="detail-form-select" disabled={!editMode} value={challenge.priority}>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div className="detail-form-group">
                                <label className="detail-form-label">Estimated Impact</label>
                                <input type="text" className="detail-form-input" value={challenge.estimatedImpact} readOnly={!editMode} />
                            </div>
                            <div className="detail-form-group full-width">
                                <label className="detail-form-label">Tags</label>
                                <div className="detail-tags-list">
                                    {challenge.challengeTags.map(tag => (
                                        <span key={tag} className="detail-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
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
                            {challenge.activity.map((act, i) => (
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
                            <textarea className="detail-comment-input" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
                            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => { if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; } /* post comment logic */ }}>💬 Post Comment</button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside>
                    {/* Engagement Stats */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">📊 Engagement Stats</div>
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
                            <span className="detail-stat-value green">{challenge.ideas.length}</span>
                        </div>
                    </div>

                    {/* Related Ideas */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">
                            <span>💡 Solution Ideas</span>
                            <button className="add-idea-btn" onClick={() => { if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; } setShowIdeaModal(true); }}>✨ Add Idea</button>
                        </div>
                        <div className="detail-ideas-list">
                            {challenge.ideas.map(idea => (
                                <div key={idea.id} className="detail-idea-item" onClick={() => navigate(`/challenges/${challenge.id}/ideas/${idea.id}`)}>
                                    <div className="detail-idea-title">{idea.title}</div>
                                    <div className="detail-idea-meta">
                                        <span>by {idea.author}</span>
                                        <span className={`detail-idea-badge ${idea.status.toLowerCase()}`}>{idea.status}</span>
                                    </div>
                                    <div className="detail-idea-stats">
                                        <span>👍 {idea.appreciations}</span>
                                        <span>💬 {idea.comments}</span>
                                        <span>👁️ {idea.views}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">👥 Team Members</div>
                        <div className="detail-team-members">
                            {challenge.team.map(member => (
                                <div key={member.name} className="detail-team-member">
                                    <div className="detail-team-member-avatar" style={{ background: member.avatarColor }}>{member.avatar}</div>
                                    <div>
                                        <div className="detail-team-member-name">{member.name}</div>
                                        <div className="detail-team-member-role">{member.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="detail-sidebar-section">
                        <div className="detail-sidebar-title">⚡ Quick Actions</div>
                        <div className="detail-quick-actions">
                            <button className="btn btn-secondary">👍 Vote for This</button>
                            <button className="btn btn-secondary" onClick={() => { if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; } setShowIdeaModal(true); }}>💡 Submit Idea</button>
                            <button className="btn btn-secondary">🔔 Subscribe</button>
                            <button className="btn btn-danger">🗑️ Delete</button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Add Idea Modal */}
            {showIdeaModal && (
                <div className="detail-modal-overlay" onClick={() => setShowIdeaModal(false)}>
                    <div className="detail-modal-dialog" onClick={e => e.stopPropagation()}>
                        <div className="detail-modal-header">
                            <h2>💡 Submit New Idea</h2>
                            <button className="detail-modal-close" onClick={() => setShowIdeaModal(false)}>✕</button>
                        </div>
                        <div className="detail-modal-body">
                            <div className="submit-form-field">
                                <label>Idea Title <span className="required">*</span></label>
                                <input type="text" placeholder="Enter a descriptive title for your idea..." />
                                <span className="hint">Keep it concise and descriptive (max 100 characters)</span>
                            </div>
                            <div className="submit-form-field">
                                <label>Solution Description <span className="required">*</span></label>
                                <textarea placeholder="Describe your solution in detail. What problem does it solve? How would it work?" />
                                <span className="hint">Include technical details, benefits, and expected outcomes</span>
                            </div>
                            <div className="submit-form-field">
                                <label>Category</label>
                                <select>
                                    <option value="">Select a category</option>
                                    <option value="technology">Technology/Automation</option>
                                    <option value="process">Process Improvement</option>
                                    <option value="customer">Customer Experience</option>
                                    <option value="data">Data & Analytics</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="submit-form-field">
                                <label>Expected Impact</label>
                                <input type="text" placeholder="e.g., 20% efficiency gain, €500K annual savings" />
                                <span className="hint">Quantify the potential business impact if possible</span>
                            </div>
                            <div className="submit-form-actions" style={{ padding: '16px 0 0', borderTop: '1px solid var(--border)' }}>
                                <button className="btn btn-secondary" onClick={() => setShowIdeaModal(false)}>✖️ Cancel</button>
                                <button className="btn btn-primary" onClick={() => setShowIdeaModal(false)}>🚀 Submit Idea</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
