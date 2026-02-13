import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SubmitChallenge: React.FC = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [businessUnit, setBusinessUnit] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [expectedOutcome, setExpectedOutcome] = useState('');
    const [impact, setImpact] = useState<'High' | 'Medium' | 'Low' | ''>('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
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

    const getCharClass = (len: number, max: number) => {
        if (len > max) return 'danger';
        if (len > max * 0.8) return 'warning';
        return '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
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
                    <span>🎯</span> Submit New Challenge
                </h1>
                <p className="submit-challenge-desc">
                    Define a business challenge that needs innovative solutions. Your challenge will be visible to all team members who can contribute ideas.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="submit-form-card">

                    {/* Basic Information */}
                    <div className="submit-form-section">
                        <div className="submit-section-title">📝 Basic Information</div>
                        <div className="submit-form-field">
                            <label>Challenge Title <span className="required">*</span></label>
                            <input
                                type="text"
                                placeholder="Enter a clear, descriptive title..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                            <div className={`submit-char-counter ${getCharClass(title.length, 100)}`}>
                                {title.length}/100
                            </div>
                        </div>
                        <div className="submit-form-row">
                            <div className="submit-form-field">
                                <label>Business Unit <span className="required">*</span></label>
                                <select value={businessUnit} onChange={e => setBusinessUnit(e.target.value)} required>
                                    <option value="">Select Business Unit</option>
                                    <option value="Customer Experience">Customer Experience</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Supply Chain">Supply Chain</option>
                                </select>
                            </div>
                            <div className="submit-form-field">
                                <label>Department <span className="required">*</span></label>
                                <select value={department} onChange={e => setDepartment(e.target.value)} required>
                                    <option value="">Select Department</option>
                                    <option value="Customer Success">Customer Success</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Product">Product</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Problem Statement */}
                    <div className="submit-form-section">
                        <div className="submit-section-title">❗ Problem Statement</div>
                        <div className="submit-form-field">
                            <label>Describe the Problem <span className="required">*</span></label>
                            <textarea
                                placeholder="What is the core problem? Include relevant data, affected stakeholders, and business impact..."
                                value={problemStatement}
                                onChange={e => setProblemStatement(e.target.value)}
                                required
                            />
                            <div className={`submit-char-counter ${getCharClass(problemStatement.length, 2000)}`}>
                                {problemStatement.length}/2000
                            </div>
                            <span className="hint">Be specific — include metrics, timelines, and affected teams if possible</span>
                        </div>
                    </div>

                    {/* Expected Outcome */}
                    <div className="submit-form-section">
                        <div className="submit-section-title">🎯 Expected Outcome</div>
                        <div className="submit-form-field">
                            <label>Desired Results <span className="required">*</span></label>
                            <textarea
                                placeholder="What does success look like? Define measurable goals and success criteria..."
                                value={expectedOutcome}
                                onChange={e => setExpectedOutcome(e.target.value)}
                                required
                            />
                            <div className={`submit-char-counter ${getCharClass(expectedOutcome.length, 1500)}`}>
                                {expectedOutcome.length}/1500
                            </div>
                        </div>
                    </div>

                    {/* Impact & Classification */}
                    <div className="submit-form-section">
                        <div className="submit-section-title">📊 Impact & Classification</div>

                        <div className="submit-form-field">
                            <label>Expected Impact Level <span className="required">*</span></label>
                            <div className="submit-impact-selector">
                                <div
                                    className={`submit-impact-card ${impact === 'Low' ? 'selected' : ''}`}
                                    onClick={() => setImpact('Low')}
                                >
                                    <div className="impact-icon">🔵</div>
                                    <div className="impact-label">Low</div>
                                    <div className="impact-desc">Minor improvements, limited scope</div>
                                </div>
                                <div
                                    className={`submit-impact-card ${impact === 'Medium' ? 'selected' : ''}`}
                                    onClick={() => setImpact('Medium')}
                                >
                                    <div className="impact-icon">🟡</div>
                                    <div className="impact-label">Medium</div>
                                    <div className="impact-desc">Moderate business value, cross-team impact</div>
                                </div>
                                <div
                                    className={`submit-impact-card ${impact === 'High' ? 'selected' : ''}`}
                                    onClick={() => setImpact('High')}
                                >
                                    <div className="impact-icon">🔴</div>
                                    <div className="impact-label">High</div>
                                    <div className="impact-desc">Strategic priority, major revenue/cost impact</div>
                                </div>
                            </div>
                        </div>

                        <div className="submit-form-field" style={{ marginTop: 20 }}>
                            <label>Tags</label>
                            <div className="submit-tags-input-wrapper">
                                {tags.map(tag => (
                                    <span key={tag} className="submit-tag-chip">
                                        {tag}
                                        <span className="remove-tag" onClick={() => removeTag(tag)}>✕</span>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    className="submit-tags-input"
                                    placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add more..."}
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                            <span className="hint">Press Enter to add tags. Examples: AI, Automation, Customer Experience</span>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="submit-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>✖️ Cancel</button>
                        <button type="submit" className="btn btn-primary">🚀 Submit Challenge</button>
                    </div>
                </div>
            </form>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="submit-success-overlay" onClick={() => { setShowSuccess(false); navigate('/'); }}>
                    <div className="submit-success-card" onClick={e => e.stopPropagation()}>
                        <div className="submit-success-icon">🎉</div>
                        <div className="submit-success-title">Challenge Submitted!</div>
                        <div className="submit-success-text">
                            Your challenge has been submitted successfully. Team members can now view and submit ideas.
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
