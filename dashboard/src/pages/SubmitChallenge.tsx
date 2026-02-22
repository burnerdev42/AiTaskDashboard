import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SubmitChallenge: React.FC = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [businessUnit, setBusinessUnit] = useState('');
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

    const resetForm = () => {
        setTitle(''); setDepartment(''); setBusinessUnit('');
        setProblemStatement(''); setExpectedOutcome('');
        setTimeline(''); setBudget('');
        setImpact('');
        setTags([]); setTagInput('');
        setConstraints(''); setStakeholders('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const errors: Record<string, string> = {};
        if (!title.trim()) errors.title = 'Challenge title is required';
        if (!businessUnit) errors.businessUnit = 'OpCo is required';
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

        setShowSuccess(true);
        setFormErrors({});
        setTimeout(() => {
            setShowSuccess(false);
            resetForm();
            navigate('/challenges');
        }, 2500);
    };


    const getCharClass = (len: number, max: number) => {
        if (len === max) return 'char-counter limit';
        if (len > max * 0.9) return 'char-counter warning';
        return 'char-counter';
    };

    return (
        <div className="submit-challenge-container">
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
                {showSuccess && (
                    <div className="submit-success-overlay active" style={{ position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: '16px' }}>
                        <div className="submit-success-card" style={{ transform: 'none', position: 'static' }}>
                            <div className="submit-success-icon"></div>
                            <div className="submit-success-title">Challenge Submitted!</div>
                            <div className="submit-success-text">
                                Your challenge has been submitted successfully. Team members can now view and submit ideas.
                            </div>
                            <button className="sc-btn sc-btn-primary" onClick={() => navigate('/challenges')}>
                                Back to Challenges
                            </button>
                        </div>
                    </div>
                )}

                {!showSuccess && (
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
                                        <option value="GET">GET</option>
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
                                        <option value="customer-value-driver">Customer Value Driver</option>
                                        <option value="non-strategic-product-management">Non Strategic Product Management</option>
                                        <option value="tech-enabler">Tech Enabler</option>
                                        <option value="maintenance">Maintenance</option>
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
                )}
            </div>
        </div >
    );
};
