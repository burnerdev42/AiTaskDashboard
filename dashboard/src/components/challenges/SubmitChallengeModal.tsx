import React, { useState, useEffect } from 'react';

interface SubmitChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SubmitChallengeModal: React.FC<SubmitChallengeModalProps> = ({ isOpen, onClose }) => {
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
    const [revenueImpact, setRevenueImpact] = useState('');
    const [costSavings, setCostSavings] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [constraints, setConstraints] = useState('');
    const [stakeholders, setStakeholders] = useState('');

    // Draft loading
    useEffect(() => {
        if (isOpen) {
            setShowSuccess(false);
            const draft = localStorage.getItem('challenge_draft');
            if (draft) {
                try {
                    const data = JSON.parse(draft);
                    setTitle(data.title || '');
                    setDepartment(data.department || '');
                    setBusinessUnit(data.businessUnit || '');
                    setProblemStatement(data.problemDesc || '');
                    setExpectedOutcome(data.outcomeDesc || '');
                    setTimeline(data.timeline || '');
                    setBudget(data.budget || '');
                    setImpact(data.impact || '');
                    setRevenueImpact(data.revenueImpact || '');
                    setCostSavings(data.costSavings || '');
                    setTags(data.tags || []);
                    setConstraints(data.constraints || '');
                    setStakeholders(data.stakeholders || '');
                } catch (e) {
                    console.error("Failed to load draft", e);
                }
            }
        }
    }, [isOpen]);

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
        setImpact(''); setRevenueImpact(''); setCostSavings('');
        setTags([]); setTagInput('');
        setConstraints(''); setStakeholders('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.removeItem('challenge_draft');
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            resetForm();
            onClose();
        }, 2500);
    };

    const handleSaveDraft = () => {
        const formData = {
            title, businessUnit, department,
            problemDesc: problemStatement, outcomeDesc: expectedOutcome,
            timeline, budget, impact, revenueImpact, costSavings,
            tags, constraints, stakeholders
        };
        localStorage.setItem('challenge_draft', JSON.stringify(formData));
        alert('Draft saved successfully! You can continue editing later.');
    };

    const getCharClass = (len: number, max: number) => {
        if (len === max) return 'char-counter limit';
        if (len > max * 0.9) return 'char-counter warning';
        return 'char-counter';
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-dialog submit-challenge-modal">
                <div className="modal-header">
                    <h2>🎯 Submit New Challenge</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {/* Success Message */}
                    {showSuccess && (
                        <div className="submit-success-msg show">
                            <span className="submit-success-icon">✅</span>
                            <div className="submit-success-content">
                                <div className="submit-success-title">Challenge Submitted Successfully!</div>
                                <div className="submit-success-text">Your challenge has been submitted and will be reviewed by the innovation team. You'll receive a notification once it's published.</div>
                            </div>
                        </div>
                    )}

                    {!showSuccess && (
                        <form onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="sc-section-icon">📝</span> Basic Information
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
                                            onChange={(e) => setTitle(e.target.value)}
                                            maxLength={100}
                                            required
                                        />
                                        <div className={getCharClass(title.length, 100)}>{title.length} / 100</div>
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Business Unit <span className="sc-required">*</span></label>
                                        <select className="sc-form-select" value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)} required>
                                            <option value="">Select business unit</option>
                                            <option value="customer-experience">Customer Experience</option>
                                            <option value="finance-ops">Finance &amp; Operations</option>
                                            <option value="supply-chain">Supply Chain</option>
                                            <option value="manufacturing">Manufacturing</option>
                                            <option value="product-data">Product &amp; Data</option>
                                            <option value="it-infrastructure">IT &amp; Infrastructure</option>
                                            <option value="hr-people">HR &amp; People</option>
                                            <option value="sustainability">Sustainability</option>
                                        </select>
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Department <span className="sc-required">*</span></label>
                                        <input
                                            type="text"
                                            className="sc-form-input"
                                            placeholder="e.g., Customer Success"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Problem Statement */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="sc-section-icon">❗</span> Problem Statement
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
                                            onChange={(e) => setProblemStatement(e.target.value)}
                                            maxLength={1000}
                                            required
                                        ></textarea>
                                        <div className={getCharClass(problemStatement.length, 1000)}>{problemStatement.length} / 1000</div>
                                        <div className="sc-help-text">💡 Tip: Include specific data points, affected stakeholders, and current workarounds if any.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Expected Outcome */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="sc-section-icon">🎯</span> Expected Outcome
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
                                            onChange={(e) => setExpectedOutcome(e.target.value)}
                                            maxLength={800}
                                            required
                                        ></textarea>
                                        <div className={getCharClass(expectedOutcome.length, 800)}>{expectedOutcome.length} / 800</div>
                                        <div className="sc-help-text">💡 Tip: Use SMART criteria - Specific, Measurable, Achievable, Relevant, Time-bound.</div>
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
                                        <label className="sc-form-label">Estimated Budget Range</label>
                                        <select className="sc-form-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                                            <option value="">Select budget range</option>
                                            <option value="under-50k">Under €50K</option>
                                            <option value="50k-100k">€50K - €100K</option>
                                            <option value="100k-250k">€100K - €250K</option>
                                            <option value="250k-500k">€250K - €500K</option>
                                            <option value="500k-plus">€500K+</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Impact & Priority */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="sc-section-icon">📊</span> Impact &amp; Priority
                                </h2>
                                <div className="sc-section-divider"></div>
                                <div className="sc-form-grid">
                                    <div className="sc-form-group sc-full-width">
                                        <label className="sc-form-label">Business Impact Level <span className="sc-required">*</span></label>
                                        <div className="sc-impact-selector">
                                            {(['Critical', 'High', 'Medium', 'Low'] as const).map((level) => (
                                                <div key={level} className="sc-impact-option">
                                                    <input
                                                        type="radio"
                                                        name="impact"
                                                        id={`impact-${level.toLowerCase()}`}
                                                        checked={impact === level}
                                                        onChange={() => setImpact(level)}
                                                        required={impact === ''}
                                                    />
                                                    <label htmlFor={`impact-${level.toLowerCase()}`}>
                                                        <div className="sc-impact-icon">
                                                            {level === 'Critical' ? '🔴' : level === 'High' ? '🟠' : level === 'Medium' ? '🟡' : '🟢'}
                                                        </div>
                                                        <div className="sc-impact-label">{level}</div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Annual Revenue Impact</label>
                                        <input
                                            type="text"
                                            className="sc-form-input"
                                            placeholder="e.g., €2M revenue retention"
                                            value={revenueImpact}
                                            onChange={(e) => setRevenueImpact(e.target.value)}
                                        />
                                    </div>
                                    <div className="sc-form-group">
                                        <label className="sc-form-label">Cost Savings Potential</label>
                                        <input
                                            type="text"
                                            className="sc-form-input"
                                            placeholder="e.g., €500K annual savings"
                                            value={costSavings}
                                            onChange={(e) => setCostSavings(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Context */}
                            <div className="sc-form-section">
                                <h2 className="sc-section-title">
                                    <span className="sc-section-icon">📎</span> Additional Context
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
                                        <div className="sc-help-text">💡 Suggested tags: Customer Experience, Digital Transformation, AI/ML, Automation, Analytics, etc.</div>
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
                            <div className="sc-form-actions">
                                <button type="button" className="sc-btn sc-btn-secondary" onClick={onClose}>✖️ Cancel</button>
                                <button type="button" className="sc-btn sc-btn-secondary" onClick={handleSaveDraft}>💾 Save Draft</button>
                                <button type="submit" className="sc-btn sc-btn-primary">🚀 Submit Challenge</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
