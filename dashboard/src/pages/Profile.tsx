import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        opco: '',
        platform: '',
        role: '',
        about: '',
        interests: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                opco: user.opco || '',
                platform: user.platform || '',
                role: user.role || '',
                about: user.about || '',
                interests: user.interests || [],
            });
            setErrors({});
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, name } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => {
            const current = prev.interests;
            if (current.includes(interest)) {
                return { ...prev, interests: current.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...current, interest] };
            }
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.role.trim()) newErrors.role = 'Role / Job Title is required';
        if (!formData.opco) newErrors.opco = 'Please select your Operating Company';
        if (!formData.platform) newErrors.platform = 'Please select your Platform / Domain';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (user) {
            await updateUser(formData);
            setIsEditing(false);
            setErrors({});
        }
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        if (user) {
            setFormData({
                name: user.name || '',
                opco: user.opco || '',
                platform: user.platform || '',
                role: user.role || '',
                about: user.about || '',
                interests: user.interests || [],
            });
        }
        setErrors({});
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="login-prompt" id="loginPrompt" style={{ display: 'flex' }}>
                <div className="icon-circle"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
                <h2>Sign in to view your profile</h2>
                <p>Access your submissions, track your ideas, and see your impact.</p>
                <div className="btn-group">
                    <Link to="/login" className="btn-go-signin">Sign In</Link>
                    <Link to="/register" className="btn-go-register">Register</Link>
                </div>
            </div>
        );
    }

    // Colors helper for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const INTEREST_OPTIONS = [
        "Customer Experience", "Product & Data", "Supply Chain",
        "Finance & Ops", "HR & Talent", "Sustainability"
    ];

    return (
        <div className="profile-container" id="profileContainer">
            {/* ── Left: Profile Card ───────────────── */}
            <aside className="profile-card">

                {/* View Mode */}
                {!isEditing && (
                    <div className="view-mode" id="viewMode">
                        <div className="profile-avatar" id="profileAvatar">
                            {typeof user.avatar === 'string' && user.avatar.length > 2 ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : getInitials(user.name)}
                        </div>
                        <div className="profile-name" id="profileName">{user.name}</div>
                        <div className="profile-email" id="profileEmail">{user.email}</div>

                        <div className="profile-meta" style={{ marginTop: '20px' }}>
                            <div className="meta-item">
                                <span className="label">Role</span>
                                <span className="value">{user.role || 'Contributor'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">OpCo</span>
                                <span className="value">{user.opco || 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Platform</span>
                                <span className="value">{user.platform || 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Member since</span>
                                <span className="value">Jan 2026</span>
                            </div>
                        </div>

                        {user.about && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Me</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {user.about}
                                </div>
                            </div>
                        )}

                        {user.interests && user.interests.length > 0 && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Areas of Interest</div>
                                <div className="interest-tags" id="interestTags">
                                    {user.interests.map(i => <span key={i} className="interest-tag">{i}</span>)}
                                </div>
                            </div>
                        )}

                        <div className="profile-actions" style={{ marginTop: '24px' }}>
                            <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                            <button className="btn-logout" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Mode */}
                {isEditing && (
                    <div className="edit-form active" id="editMode">
                        <div className="profile-avatar" id="editAvatar">
                            {getInitials(formData.name || user.name)}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>Edit Your Profile</div>

                        <form id="editProfileForm" onSubmit={handleSave}>
                            <div className={`form-field ${errors.name ? 'error' : ''}`}>
                                <label>Full Name <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>

                            <div className="form-field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    style={{ opacity: 0.7 }}
                                />
                            </div>

                            <div className={`form-field ${errors.role ? 'error' : ''}`}>
                                <label>Role / Job Title <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    placeholder="Enter your role"
                                />
                                {errors.role && <span className="error-message">{errors.role}</span>}
                            </div>

                            <div className={`form-field ${errors.opco ? 'error' : ''}`}>
                                <label>Operating Company <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <select
                                    name="opco"
                                    value={formData.opco}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select OpCo</option>
                                    <option value="TCS — India">TCS — India</option>
                                    <option value="TCS — USA">TCS — USA</option>
                                    <option value="TCS — UK">TCS — UK</option>
                                    <option value="TCS — Europe">TCS — Europe</option>
                                    <option value="TCS — APAC">TCS — APAC</option>
                                </select>
                                {errors.opco && <span className="error-message">{errors.opco}</span>}
                            </div>

                            <div className={`form-field ${errors.platform ? 'error' : ''}`}>
                                <label>Platform / Domain <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <select
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Platform</option>
                                    <option value="BFSI">BFSI</option>
                                    <option value="Technology & Services">Technology & Services</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Retail & CPG">Retail & CPG</option>
                                    <option value="Life Sciences">Life Sciences</option>
                                    <option value="Communications">Communications</option>
                                </select>
                                {errors.platform && <span className="error-message">{errors.platform}</span>}
                            </div>

                            <div className="form-field">
                                <label>About Me</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                                    placeholder="Share a brief overview of your expertise..."
                                    style={{
                                        width: '100%',
                                        minHeight: '80px',
                                        padding: '12px',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        resize: 'vertical',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div className="form-field">
                                <label>Areas of Interest</label>
                                <div className="interest-chips">
                                    {INTEREST_OPTIONS.map(interest => (
                                        <div
                                            key={interest}
                                            className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                                            onClick={() => handleInterestToggle(interest)}
                                        >
                                            {interest}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button type="submit" className="btn-save">Save Changes</button>
                                <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </aside>

            {/* ── Right: Profile Content ───────────────── */}
            <div className="profile-content">

                {/* ── Stats Row ──────────────────────── */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-blue)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                        </div>
                        <div className="stat-value">3</div>
                        <div className="stat-label">Challenges</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-yellow)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg>
                        </div>
                        <div className="stat-value">8</div>
                        <div className="stat-label">Ideas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-gold)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                        </div>
                        <div className="stat-value">847</div>
                        <div className="stat-label">Score</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-pink)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        </div>
                        <div className="stat-value">36</div>
                        <div className="stat-label">Engagement</div>
                    </div>
                </div>

                {/* ── Activity Feed ──────────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></span> Recent Activity
                    </div>
                    <div className="scroll-area">
                        <ul className="activity-feed">
                            <li className="activity-item" onClick={() => navigate('/challenges/c1/ideas/i1')} style={{ cursor: 'pointer' }}>
                                <div className="activity-icon-wrapper dot-idea">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </div>
                                <div className="activity-body">
                                    <div className="activity-text">
                                        Submitted a new idea <strong>"AI-based Lead Scoring"</strong> for <strong>Sales Optimization</strong> challenge.
                                    </div>
                                    <div className="activity-time">2 hours ago</div>
                                </div>
                            </li>
                            <li className="activity-item" onClick={() => navigate('/challenges/c2/ideas/i2')} style={{ cursor: 'pointer' }}>
                                <div className="activity-icon-wrapper dot-comment">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                                </div>
                                <div className="activity-body">
                                    <div className="activity-text">
                                        Commented on <strong>"Automated Invoice Processing"</strong>.
                                    </div>
                                    <div className="activity-time">Yesterday at 4:15 PM</div>
                                </div>
                            </li>
                            <li className="activity-item" onClick={() => navigate('/challenges/c3')} style={{ cursor: 'pointer' }}>
                                <div className="activity-icon-wrapper dot-challenge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                </div>
                                <div className="activity-body">
                                    <div className="activity-text">
                                        Joined the <strong>"Sustainability in Tech"</strong> challenge.
                                    </div>
                                    <div className="activity-time">Feb 14, 2026</div>
                                </div>
                            </li>
                            <li className="activity-item">
                                <div className="activity-icon-wrapper dot-idea">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </div>
                                <div className="activity-body">
                                    <div className="activity-text">Refined the <strong>Predictive Maintenance</strong> algorithm for the Factory 4.0 challenge.</div>
                                    <div className="activity-time">Feb 12, 2026</div>
                                </div>
                            </li>
                            <li className="activity-item">
                                <div className="activity-icon-wrapper dot-pilot">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                </div>
                                <div className="activity-body">
                                    <div className="activity-text">Successfully completed the POC for <strong>Blockchain Supply Tracking</strong>.</div>
                                    <div className="activity-time">Feb 08, 2026</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Recent Submissions ──────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg></span> Recent Submissions
                    </div>
                    <div className="scroll-area">
                        <table className="submissions-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr onClick={() => navigate('/challenges/c4')} style={{ cursor: 'pointer' }}>
                                    <td className="id-col">CH-007</td>
                                    <td>Sustainability Tech</td>
                                    <td>Feb 18, 2026</td>
                                    <td><span className="status-pill status-ideation">Ideation</span></td>
                                </tr>
                                <tr onClick={() => navigate('/challenges/c1/ideas/ID-0204')} style={{ cursor: 'pointer' }}>
                                    <td className="id-col">ID-0204</td>
                                    <td>AI-based Lead Scoring</td>
                                    <td>Feb 16, 2026</td>
                                    <td><span className="status-pill status-accepted">Accepted</span></td>
                                </tr>
                                <tr onClick={() => navigate('/challenges/c1/ideas/ID-0198')} style={{ cursor: 'pointer' }}>
                                    <td className="id-col">ID-0198</td>
                                    <td>Voice Command Dashboard</td>
                                    <td>Feb 10, 2026</td>
                                    <td><span className="status-pill status-declined">Declined</span></td>
                                </tr>
                                <tr onClick={() => navigate('/challenges/c1/ideas/ID-0185')} style={{ cursor: 'pointer' }}>
                                    <td className="id-col">ID-0185</td>
                                    <td>Legacy System Migration Bot</td>
                                    <td>Jan 28, 2026</td>
                                    <td><span className="status-pill status-accepted">Accepted</span></td>
                                </tr>
                                <tr onClick={() => navigate('/challenges/c2')} style={{ cursor: 'pointer' }}>
                                    <td className="id-col">CH-005</td>
                                    <td>Smart Factory 4.0</td>
                                    <td>Jan 20, 2026</td>
                                    <td><span className="status-pill status-pilot">Pilot</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Contribution Graph ──────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4" /></svg></span> Contribution Graph
                    </div>
                    <div className="contribution-heatmap">
                        <div className="heatmap-content">
                            <div className="heatmap-days">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                            </div>
                            <div className="heatmap-main">
                                <div className="heatmap-months">
                                    <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
                                </div>
                                <div className="heatmap-grid">
                                    {[...Array(196)].map((_, i) => {
                                        // Weighted random for a more realistic "ratio" (mostly empty/low, few high)
                                        const r = Math.random();
                                        let level = 0;
                                        if (r > 0.95) level = 4;
                                        else if (r > 0.85) level = 3;
                                        else if (r > 0.70) level = 2;
                                        else if (r > 0.50) level = 1;

                                        return (
                                            <div
                                                key={i}
                                                className={`heatmap-cell ${level > 0 ? `level-${level}` : ''}`}
                                                style={{ animationDelay: `${i * 0.003}s` }}
                                                title={level === 0 ? 'No activity' : `${level * 2} contributions`}
                                            ></div>
                                        );
                                    })}
                                </div>
                                <div className="heatmap-legend">
                                    <span className="legend-label">Ratio:</span>
                                    <div className="legend-boxes">
                                        <div className="legend-box" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                                        <div className="legend-box level-1"></div>
                                        <div className="legend-box level-2"></div>
                                        <div className="legend-box level-3"></div>
                                        <div className="legend-box level-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
