import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { type ChallengeDetailData } from '../types';

export const SubmitChallenge: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();

    // Form State
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [businessUnit, setBusinessUnit] = useState('');
    const [summary, setSummary] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [expectedOutcome, setExpectedOutcome] = useState('');
    const [timeline, setTimeline] = useState('');
    const [budget, setBudget] = useState('');
    const [impact, setImpact] = useState<'Critical' | 'High' | 'Medium' | 'Low' | ''>('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [constraints, setConstraints] = useState('');
    const [stakeholders, setStakeholders] = useState('');

    // Error State
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    // Submission success state
    const [submitted, setSubmitted] = useState(false);
    const [submittedChallengeId, setSubmittedChallengeId] = useState('');

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (submitted) {
            timer = setTimeout(() => {
                navigate('/challenges');
            }, 5000); // 5 seconds
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [submitted, navigate]);


    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const errors: Record<string, string> = {};
        if (!title.trim()) errors.title = 'Challenge title is required';
        if (!businessUnit) errors.businessUnit = 'OpCo is required';
        if (!summary.trim()) errors.summary = 'Challenge summary is required';
        if (!department) errors.department = 'Platform is required';
        if (!problemStatement.trim()) errors.problemStatement = 'Problem statement is required';
        if (!expectedOutcome.trim()) errors.expectedOutcome = 'Expected outcome is required';
        if (!impact) errors.impact = 'Business impact level is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            // Scroll to top of form or first error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const challenges = storage.getChallenges();
        const nextIdNumber = challenges.length > 0
            ? Math.max(...challenges.map(c => {
                const parts = c.id.split('-');
                if (parts.length > 1) {
                    const parsed = parseInt(parts[1].replace(/\D/g, ''), 10);
                    return isNaN(parsed) ? 0 : parsed;
                }
                return 0;
            })) + 1
            : 1;
        const newChallengeId = `CH-${String(nextIdNumber).padStart(3, '0')}`;

        const newChallenge: ChallengeDetailData = {
            id: newChallengeId,
            title,
            summary,
            description: problemStatement,
            stage: 'Challenge Submitted',
            owner: {
                name: 'Current User',
                avatar: 'CU',
                avatarColor: 'var(--accent-purple)'
            },
            accentColor: 'purple',
            stats: {
                appreciations: 0,
                comments: 0
            },
            problemStatement,
            expectedOutcome,
            businessUnit,
            department,
            priority: impact === 'Critical' ? 'High' : (impact || 'Medium') as any,
            estimatedImpact: 'TBD',
            challengeTags: tags,
            timeline,
            portfolioOption: budget,
            constraints,
            stakeholders,
            ideas: [],
            team: [{ name: 'Current User', avatar: 'CU', avatarColor: 'var(--accent-purple)', role: 'Lead' }],
            activity: [],
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            updatedDate: 'Just now',
            impact: impact as any,
            approvalStatus: user?.role === 'Admin' ? 'Approved' : 'Pending'
        };

        try {
            storage.addChallenge(newChallenge);
            setFormErrors({});
            setSubmittedChallengeId(newChallengeId);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            showToast('Failed to submit challenge. Please try again.', 'error');
        }
    };


    const getCharClass = (len: number, max: number) => {
        if (len === max) return 'char-counter limit';
        if (len > max * 0.9) return 'char-counter warning';
        return 'char-counter';
    };

    return (
        <div className="submit-challenge-container">
            {submitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '48px 40px',
                        maxWidth: '520px',
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        {/* Success icon */}
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(102,187,106,.15), rgba(102,187,106,.05))',
                            border: '2px solid var(--accent-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            animation: 'fadeIn 0.5s ease'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Challenge Submitted Successfully
                        </h2>
                        {user?.role === 'Admin' ? (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(102,187,106,.12)',
                                color: 'var(--accent-green)',
                                border: '1px solid rgba(102,187,106,.3)',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                margin: '12px 0 20px'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                Auto-Approved
                            </div>
                        ) : (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(255,238,88,.12)',
                                color: 'var(--accent-yellow)',
                                border: '1px solid rgba(255,238,88,.3)',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                margin: '12px 0 20px'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                Waiting for Admin Approval
                            </div>
                        )}
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
                            Your challenge <strong style={{ color: 'var(--accent-teal)' }}>{submittedChallengeId}</strong> has been submitted successfully.
                            {user?.role !== 'Admin' && ' An admin will review and approve it before it becomes visible to all team members.'}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                            {user?.role !== 'Admin' ? 'You\'ll be notified once the challenge is approved or if any changes are requested.' : 'The challenge is now live and visible to all users.'}<br /><br />
                            Redirecting to challenges shortly...
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                className="btn btn-primary"
                                style={{ height: '40px', padding: '0 24px', fontSize: '13px' }}
                                onClick={() => navigate(`/challenges/${submittedChallengeId}`)}
                            >
                                View Challenge
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ height: '40px', padding: '0 24px', fontSize: '13px' }}
                                onClick={() => navigate('/challenges')}
                            >
                                Back to Challenges
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <a onClick={() => navigate('/')}>Home</a>
                        <span className="sep">/</span>
                        <a onClick={() => navigate('/challenges')}>Challenges</a>
                        <span className="sep">/</span>
                        <span className="current">Submit New Challenge</span>
                    </div>

                    {/* Header */}
                    <div className="submit-challenge-header">
                        <h1 className="submit-challenge-title">
                            Submit New Challenge
                        </h1>
                        <p className="submit-challenge-desc">
                            Define a business challenge that needs innovative solutions. Your challenge will be visible to all team members who can contribute ideas.
                        </p>
                    </div>

                    <div className="submit-form-card" style={{ padding: 0, background: 'transparent' }}>
                        <form onSubmit={handleSubmit} className="sc-form-container" style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            {/* Basic Information */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg></span>
                                    Basic Information
                                </h2>
                                <div className="sc-section-divider"></div>
                                <div className="sc-form-grid">
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">Challenge Title <span className="sc-required">*</span></label>
                                        <input
                                            type="text"
                                            className="sc-form-input"
                                            placeholder="e.g., Reduce Customer Churn by 15%"
                                            value={title}
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                                if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }));
                                            }}
                                            maxLength={100}
                                            style={{ borderColor: formErrors.title ? 'var(--accent-red)' : 'var(--border)' }}
                                        />
                                        {formErrors.title && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px' }}>{formErrors.title}</div>}
                                        <div className={getCharClass(title.length, 100)}>{title.length} / 100</div>
                                    </div>
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">Challenge Summary <span className="sc-required">*</span> <span className="sc-hint">(A concise one-liner for cards and headers)</span></label>
                                        <input
                                            type="text"
                                            className="sc-form-input"
                                            placeholder="e.g., Implementing a GenAI-based, fully autonomous Co-Pilot solution..."
                                            value={summary}
                                            onChange={(e) => {
                                                setSummary(e.target.value);
                                                if (formErrors.summary) setFormErrors(prev => ({ ...prev, summary: '' }));
                                            }}
                                            maxLength={180}
                                            style={{ borderColor: formErrors.summary ? 'var(--accent-red)' : 'var(--border)' }}
                                        />
                                        {formErrors.summary && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px' }}>{formErrors.summary}</div>}
                                        <div className={getCharClass(summary.length, 180)}>{summary.length} / 180</div>
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">OpCo <span className="sc-required">*</span></label>
                                        <select
                                            className="sc-form-select"
                                            value={businessUnit}
                                            onChange={(e) => {
                                                setBusinessUnit(e.target.value);
                                                setDepartment(''); // Reset platform on OpCo change
                                                if (formErrors.businessUnit) setFormErrors(prev => ({ ...prev, businessUnit: '' }));
                                            }}
                                            style={{ borderColor: formErrors.businessUnit ? 'var(--accent-red)' : 'var(--border)' }}
                                        >
                                            <option value="">Select OpCo</option>
                                            <option value="Albert Heijn">Albert Heijn</option>
                                            <option value="GSO">GSO</option>

                                            <option value="BecSee">BecSee</option>
                                        </select>
                                        {formErrors.businessUnit && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px' }}>{formErrors.businessUnit}</div>}
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Platform <span className="sc-required">*</span></label>
                                        <select
                                            className="sc-form-select"
                                            value={department}
                                            onChange={(e) => {
                                                setDepartment(e.target.value);
                                                if (formErrors.department) setFormErrors(prev => ({ ...prev, department: '' }));
                                            }}
                                            disabled={!businessUnit}
                                            style={{ borderColor: formErrors.department ? 'var(--accent-red)' : 'var(--border)' }}
                                        >
                                            <option value="">Select Platform</option>
                                            {businessUnit === 'Albert Heijn' && (
                                                <>
                                                    <option value="STP">STP</option>
                                                    <option value="CTP">CTP</option>
                                                    <option value="RBP">RBP</option>
                                                </>
                                            )}
                                            {businessUnit === 'GSO' && (
                                                <>
                                                    <option value="Global Platform">Global Platform</option>
                                                    <option value="Analytics">Analytics</option>
                                                </>
                                            )}
                                            {businessUnit === 'BecSee' && (
                                                <>
                                                    <option value="Ecommerce">Ecommerce</option>
                                                </>
                                            )}
                                        </select>
                                        {formErrors.department && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px' }}>{formErrors.department}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Problem Statement */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></span>
                                    Problem Statement
                                </h2>
                                <div className="sc-section-divider"></div>
                                <div className="sc-form-grid">
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">
                                            Describe the Problem <span className="sc-required">*</span>
                                            <span className="sc-hint">(Be specific about pain points, metrics, and impact)</span>
                                        </label>
                                        <textarea
                                            className="sc-form-textarea"
                                            placeholder="Describe the business problem in detail. Include current metrics, pain points, and why this needs to be solved now..."
                                            value={problemStatement}
                                            onChange={(e) => {
                                                setProblemStatement(e.target.value);
                                                if (formErrors.problemStatement) setFormErrors(prev => ({ ...prev, problemStatement: '' }));
                                            }}
                                            maxLength={1000}
                                            style={{ borderColor: formErrors.problemStatement ? 'var(--accent-red)' : 'var(--border)' }}
                                        ></textarea>
                                        {formErrors.problemStatement && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px' }}>{formErrors.problemStatement}</div>}
                                        <div className={getCharClass(problemStatement.length, 1000)}>{problemStatement.length} / 1000</div>
                                        <div className="sc-help-text">Tip: Include specific data points, affected stakeholders, and current workarounds if any.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Expected Outcome */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg></span>
                                    Expected Outcome
                                </h2>
                                <div className="sc-section-divider"></div>
                                <div className="sc-form-grid">
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">
                                            What Success Looks Like <span className="sc-required">*</span>
                                            <span className="sc-hint">(Define measurable outcomes and KPIs)</span>
                                        </label>
                                        <textarea
                                            className="sc-form-textarea"
                                            placeholder="Describe the desired outcome, success metrics, and expected benefits..."
                                            value={expectedOutcome}
                                            onChange={(e) => {
                                                setExpectedOutcome(e.target.value);
                                                if (formErrors.expectedOutcome) setFormErrors(prev => ({ ...prev, expectedOutcome: '' }));
                                            }}
                                            maxLength={800}
                                            style={{ borderColor: formErrors.expectedOutcome ? 'var(--accent-red)' : 'var(--border)' }}
                                        ></textarea>
                                        {formErrors.expectedOutcome && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '4px' }}>{formErrors.expectedOutcome}</div>}
                                        <div className={getCharClass(expectedOutcome.length, 800)}>{expectedOutcome.length} / 800</div>
                                        <div className="sc-help-text">Tip: Use SMART criteria - Specific, Measurable, Achievable, Relevant, Time-bound.</div>
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Expected Timeline</label>
                                        <select className="sc-form-select" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                                            <option value="">Select timeline</option>
                                            <option value="1-3-months">1-3 months</option>
                                            <option value="3-6-months">3-6 months</option>
                                            <option value="6-12-months">6-12 months</option>
                                            <option value="12-months-plus">12+ months</option>
                                        </select>
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Portfolio Option</label>
                                        <select className="sc-form-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                                            <option value="">Select portfolio option</option>
                                            <option value="Customer Value Driver">Customer Value Driver</option>
                                            <option value="Non Strategic Product Management">Non Strategic Product Management</option>
                                            <option value="Tech Enabler">Tech Enabler</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Impact & Priority */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg></span>
                                    Impact &amp; Priority
                                </h2>
                                <div className="sc-section-divider"></div>
                                <div className="sc-form-grid">
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">Business Impact Level <span className="sc-required">*</span></label>
                                        <div className="sc-impact-selector" style={{ borderColor: formErrors.impact ? 'var(--accent-red)' : 'transparent', borderStyle: 'solid', borderWidth: '1px', borderRadius: '12px', padding: formErrors.impact ? '4px' : '0' }}>
                                            {(['Critical', 'High', 'Medium', 'Low'] as const).map((level) => (
                                                <div key={level} className="sc-impact-option">
                                                    <input
                                                        type="radio"
                                                        name="impact"
                                                        id={`impact-${level.toLowerCase()}`}
                                                        checked={impact === level}
                                                        onChange={() => {
                                                            setImpact(level);
                                                            if (formErrors.impact) setFormErrors(prev => ({ ...prev, impact: '' }));
                                                        }}
                                                    />
                                                    <label htmlFor={`impact-${level.toLowerCase()}`}>
                                                        <div className="sc-impact-icon">
                                                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: level === 'Critical' ? '#ef5350' : level === 'High' ? '#ffa726' : level === 'Medium' ? '#ffee58' : '#66bb6a' }} />
                                                        </div>
                                                        <div className="sc-impact-label">{level}</div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {formErrors.impact && <div style={{ color: 'var(--accent-red)', fontSize: '11px', marginTop: '8px' }}>{formErrors.impact}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Context */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg></span>
                                    Additional Context
                                </h2>
                                <div className="sc-section-divider"></div>
                                <div className="sc-form-grid">
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">
                                            Tags <span className="sc-hint">(Press Enter or comma to add tags)</span>
                                        </label>
                                        <div className="sc-tags-wrapper">
                                            {tags.map(tag => (
                                                <span key={tag} className="sc-tag-item">
                                                    {tag} <span className="sc-remove-tag" onClick={() => removeTag(tag)}>×</span>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                className="sc-tags-input"
                                                placeholder="Add tags..."
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleAddTag}
                                            />
                                        </div>
                                        <div className="sc-help-text">Suggested tags: Customer Experience, Digital Transformation, AI/ML, Automation, Analytics, etc.</div>
                                    </div>
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">Current Workarounds or Constraints</label>
                                        <textarea
                                            className="sc-form-textarea"
                                            placeholder="Describe any current workarounds, constraints, or previous attempts to solve this problem..."
                                            style={{ minHeight: '80px' }}
                                            value={constraints}
                                            onChange={(e) => setConstraints(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">Stakeholders or Teams Involved</label>
                                        <input
                                            type="text"
                                            className="sc-form-input"
                                            placeholder="e.g., Customer Success team, Product team, IT Infrastructure"
                                            value={stakeholders}
                                            onChange={(e) => setStakeholders(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="submit-form-actions">
                                <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
                                <button type="submit" className="btn-save">Submit Challenge</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};
