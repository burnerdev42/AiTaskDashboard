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
        interests: [] as string[],
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                opco: user.opco || '',
                platform: user.platform || '',
                interests: user.interests || [],
            });
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        // Map id to state key (e.g., editName -> name)
        const key = id.replace('edit', '').toLowerCase();
        // Handle special casing if needed, but 'name', 'opco', 'platform' match straightforward mapping if we force lowercase. 
        // Actually, let's just use explicit mapping or name attribute.
        // Let's use name attribute on inputs.
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
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
        if (user) {
            await updateUser(formData);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                opco: user.opco || '',
                platform: user.platform || '',
                interests: user.interests || [],
            });
        }
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

                        <div className="profile-badges">
                            <span className="badge badge-opco" id="badgeOpco">{user.opco || 'Global'}</span>
                            <span className="badge badge-platform" id="badgePlatform">{user.platform || 'General'}</span>
                            <span className="badge badge-role">{user.role || 'Innovator'}</span>
                        </div>

                        <div className="profile-meta">
                            <div className="meta-item">
                                <span className="label">Member since</span>
                                <span className="value">Jan 2026</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Innovation Score</span>
                                <span className="value" style={{ color: 'var(--accent-gold)' }}>847</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Rank</span>
                                <span className="value">#12 of 64</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '18px' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'left' }}>Areas of Interest</div>
                            <div className="interest-tags" id="interestTags">
                                {user.interests && user.interests.length > 0 ? (
                                    user.interests.map(i => <span key={i} className="interest-tag">{i}</span>)
                                ) : (
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No interests selected</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="btn-sm btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <button className="btn-sm btn-logout" onClick={handleLogout}>Sign Out</button>
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
                            <div className="form-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    required
                                />
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

                            <div className="form-field">
                                <label>Operating Company</label>
                                <select
                                    name="opco"
                                    value={formData.opco}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select OpCo</option>
                                    <option value="TCS — India">TCS — India</option>
                                    <option value="TCS — USA">TCS — USA</option>
                                    <option value="TCS — UK">TCS — UK</option>
                                    <option value="TCS — Europe">TCS — Europe</option>
                                    <option value="TCS — APAC">TCS — APAC</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Platform / Domain</label>
                                <select
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Platform</option>
                                    <option value="BFSI">BFSI</option>
                                    <option value="Technology & Services">Technology & Services</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Retail & CPG">Retail & CPG</option>
                                    <option value="Life Sciences">Life Sciences</option>
                                    <option value="Communications">Communications</option>
                                </select>
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
                                <button type="submit" className="btn-sm btn-save">Save Changes</button>
                                <button type="button" className="btn-sm btn-cancel" onClick={handleCancel}>Cancel</button>
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
                        <div className="stat-icon" style={{ color: 'var(--accent-red)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Streak Days</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-yellow)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg></div>
                        <div className="stat-value">8</div>
                        <div className="stat-label">Total Ideas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-blue)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg></div>
                        <div className="stat-value">3</div>
                        <div className="stat-label">Challenges</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--accent-gold)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg></div>
                        <div className="stat-value">Top 5%</div>
                        <div className="stat-label">Contributor</div>
                    </div>
                </div>

                {/* ── Activity Feed ──────────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></span> Recent Activity
                    </div>
                    <ul className="activity-feed">
                        <li className="activity-item" onClick={() => navigate('/challenges/c1/ideas/i1')} style={{ cursor: 'pointer' }}>
                            <div className="activity-dot dot-idea"></div>
                            <div className="activity-body">
                                <div className="activity-text">
                                    Submitted a new idea <strong>"AI-based Lead Scoring"</strong> for <strong>Sales Optimization</strong> challenge.
                                </div>
                                <div className="activity-time">2 hours ago</div>
                            </div>
                        </li>
                        <li className="activity-item" onClick={() => navigate('/challenges/c2/ideas/i2')} style={{ cursor: 'pointer' }}>
                            <div className="activity-dot dot-comment"></div>
                            <div className="activity-body">
                                <div className="activity-text">
                                    Commented on <strong>"Automated Invoice Processing"</strong>.
                                </div>
                                <div className="activity-time">Yesterday at 4:15 PM</div>
                            </div>
                        </li>
                        <li className="activity-item" onClick={() => navigate('/challenges/c3')} style={{ cursor: 'pointer' }}>
                            <div className="activity-dot dot-challenge"></div>
                            <div className="activity-body">
                                <div className="activity-text">
                                    Joined the <strong>"Sustainability in Tech"</strong> challenge.
                                </div>
                                <div className="activity-time">Feb 14, 2026</div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* ── Recent Submissions ──────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg></span> Recent Submissions
                    </div>
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
                                <td>Sustainability Challenge</td>
                                <td>Feb 18, 2026</td>
                                <td><span className="status-pill status-active">Active</span></td>
                            </tr>
                            <tr onClick={() => navigate('/challenges/c1/ideas/ID-0204')} style={{ cursor: 'pointer' }}>
                                <td className="id-col">ID-0204</td>
                                <td>AI-based Lead Scoring</td>
                                <td>Feb 16, 2026</td>
                                <td><span className="status-pill status-eval">Evaluation</span></td>
                            </tr>
                            <tr onClick={() => navigate('/challenges/c1/ideas/ID-0198')} style={{ cursor: 'pointer' }}>
                                <td className="id-col">ID-0198</td>
                                <td>Voice Command Dashboard</td>
                                <td>Feb 10, 2026</td>
                                <td><span className="status-pill status-pilot">Pilot</span></td>
                            </tr>
                            <tr onClick={() => navigate('/challenges/c1/ideas/ID-0185')} style={{ cursor: 'pointer' }}>
                                <td className="id-col">ID-0185</td>
                                <td>Legacy System Migration Bot</td>
                                <td>Jan 28, 2026</td>
                                <td><span className="status-pill status-parked">Parked</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ── Contribution Graph ──────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg></span> Contribution Graph
                    </div>
                    <div className="contrib-chart">
                        {/* Mock data bars */}
                        <div className="contrib-bar" style={{ height: '40%' }} data-val="12"></div>
                        <div className="contrib-bar" style={{ height: '65%' }} data-val="24"></div>
                        <div className="contrib-bar" style={{ height: '30%' }} data-val="8"></div>
                        <div className="contrib-bar" style={{ height: '85%' }} data-val="32"></div>
                        <div className="contrib-bar" style={{ height: '50%' }} data-val="18"></div>
                        <div className="contrib-bar" style={{ height: '95%' }} data-val="45"></div>
                        <div className="contrib-bar" style={{ height: '60%' }} data-val="22"></div>
                    </div>
                    <div className="contrib-months">
                        <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
