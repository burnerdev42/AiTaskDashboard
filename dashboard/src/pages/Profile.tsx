import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

export const Profile: React.FC = () => {
    const { user, logout, updateUser, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        opco: '',
        platform: '',
        role: '',
        about: '',
        interests: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user && !isLoading) {
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
    }, [user, isLoading]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, name } = e.target;

        if (name === 'opco') {
            setFormData(prev => ({ ...prev, opco: value, platform: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

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
            showToast('Please fill in all mandatory fields.', 'error');
            return;
        }

        if (user) {
            await updateUser(formData);
            showToast('Profile updated successfully!');
            setIsEditing(false);
            setErrors({});

            // Trigger loading state for feedback
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1200);
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

    const handleDeleteAccount = async () => {
        const success = await deleteAccount();
        if (success) {
            showToast('Account deleted successfully. We\'re sorry to see you go!');
            navigate('/');
        } else {
            showToast('Failed to delete account. Please try again.', 'error');
        }
    };

    if (!user) {
        return (
            <div className="detail-page-container fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <div className="breadcrumb">
                    <a onClick={() => navigate('/')}>Home</a>
                    <span className="sep">/</span>
                    <span className="current">Profile</span>
                </div>
                <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '24px', boxShadow: 'var(--shadow-lg)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', opacity: 0.8 }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: '700' }}>User Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', marginInline: 'auto' }}>This user profile does not exist or the account has been deleted. The user may have removed their account from the platform.</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                            style={{
                                minWidth: '160px',
                                height: '42px',
                                padding: '0 24px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '14px'
                            }}
                        >
                            Go to Home
                        </button>
                        <button
                            className="btn-cancel"
                            onClick={() => navigate('/login')}
                            style={{
                                minWidth: '160px',
                                height: '42px',
                                padding: '0 24px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '14px'
                            }}
                        >
                            Sign In
                        </button>
                    </div>
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
        'Customer Experience', 'Finance & Ops', 'Supply Chain', 'Product & Data',
        'Manufacturing', 'Sustainability', 'Logistics', 'Retail Ops'
    ];

    return (
        <div className="profile-container" id="profileContainer">
            {/* ── Left: Profile Card ───────────────── */}
            <aside className="profile-card">

                {/* View Mode */}
                {!isEditing && (
                    <div className="view-mode" id="viewMode">
                        <div className="profile-avatar" id="profileAvatar">
                            {isLoading ? (
                                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '50%' }}></div>
                            ) : (
                                typeof user.avatar === 'string' && user.avatar.length > 2 ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : getInitials(user.name)
                            )}
                        </div>
                        <div className="profile-name" id="profileName">
                            {isLoading ? <div className="skeleton-text" style={{ width: '140px', height: '28px', margin: '0 auto' }}></div> : user.name}
                        </div>
                        <div className="profile-email" id="profileEmail">
                            {isLoading ? <div className="skeleton-text" style={{ width: '180px', height: '16px', margin: '8px auto 0' }}></div> : user.email}
                        </div>

                        <div className="profile-meta" style={{ marginTop: '20px' }}>
                            <div className="meta-item">
                                <span className="label">Role</span>
                                <span className="value">{isLoading ? <div className="skeleton-text" style={{ width: '80px', height: '14px' }}></div> : (user.role || 'Contributor')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">OpCo</span>
                                <span className="value">{isLoading ? <div className="skeleton-text" style={{ width: '100px', height: '14px' }}></div> : (user.opco || 'N/A')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Platform</span>
                                <span className="value">{isLoading ? <div className="skeleton-text" style={{ width: '120px', height: '14px' }}></div> : (user.platform || 'N/A')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Member since</span>
                                <span className="value">Jan 2026</span>
                            </div>
                        </div>

                        {(isLoading || user.about) && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Me</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {isLoading ? (
                                        <>
                                            <div className="skeleton-text" style={{ width: '100%', height: '14px', marginBottom: '6px' }}></div>
                                            <div className="skeleton-text" style={{ width: '90%', height: '14px', marginBottom: '6px' }}></div>
                                            <div className="skeleton-text" style={{ width: '40%', height: '14px' }}></div>
                                        </>
                                    ) : (
                                        user.about
                                    )}
                                </div>
                            </div>
                        )}

                        {(isLoading || (user.interests && user.interests.length > 0)) && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Areas of Interest</div>
                                <div className="interest-tags" id="interestTags">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: '70px', height: '24px', borderRadius: '12px' }}></div>)
                                    ) : (
                                        user.interests?.map(i => <span key={i} className="interest-tag">{i}</span>)
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="profile-actions" style={{ marginTop: '24px' }}>
                            <button className="btn-edit" onClick={() => setIsEditing(true)} disabled={isLoading} style={{ width: '100%' }}>
                                Edit Profile
                            </button>
                            <button className="btn-logout" onClick={handleLogout} disabled={isLoading} style={{ width: '100%' }}>
                                Sign Out
                            </button>
                            <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(true)} disabled={isLoading} style={{ width: '100%' }}>
                                Delete Account
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
                                    <option value="Albert Heijn">Albert Heijn</option>
                                    <option value="GSO">GSO</option>

                                    <option value="BecSee">BecSee</option>
                                </select>
                                {errors.opco && <span className="error-message">{errors.opco}</span>}
                            </div>

                            <div className={`form-field ${errors.platform ? 'error' : ''}`}>
                                <label>Platform / Domain <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <select
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleInputChange}
                                    disabled={!formData.opco}
                                >
                                    <option value="">Select Platform</option>
                                    {formData.opco === 'Albert Heijn' && (
                                        <>
                                            <option value="STP">STP</option>
                                            <option value="CTP">CTP</option>
                                            <option value="RBP">RBP</option>
                                        </>
                                    )}
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
                                <button
                                    type="submit"
                                    className="btn-save"
                                    style={{
                                        flex: 1,
                                        opacity: (!formData.name.trim() || !formData.role.trim() || !formData.opco || !formData.platform) ? 0.6 : 1,
                                        cursor: (!formData.name.trim() || !formData.role.trim() || !formData.opco || !formData.platform) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Save Changes
                                </button>
                                <button type="button" className="btn-cancel" onClick={handleCancel} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </aside>

            {/* ── Right: Profile Content ───────────────── */}
            <div className="profile-content">

                {/* ── Stats Row ──────────────────────── */}
                <div className="stats-row">
                    {[
                        { label: 'Challenges', color: 'var(--accent-blue)', icon: <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />, line: <line x1="4" y1="22" x2="4" y2="15" />, val: 3 },
                        { label: 'Ideas', color: 'var(--accent-yellow)', icon: <path d="M9 18h6" />, extra: <path d="M10 22h4" />, main: <path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" />, val: 8 },
                        { label: 'Score', color: 'var(--accent-gold)', circle: <circle cx="12" cy="8" r="7" />, poly: <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />, val: 847 },
                        { label: 'Engagement', color: 'var(--accent-pink)', heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, val: 36 }
                    ].map((s, idx) => (
                        <div key={idx} className="stat-card">
                            <div className="stat-icon" style={{ color: s.color }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    {s.icon} {s.line} {s.extra} {s.main} {s.circle} {s.poly} {s.heart}
                                </svg>
                            </div>
                            <div className="stat-value">{isLoading ? <div className="skeleton-text" style={{ width: '40px', height: '28px', margin: '4px 0' }}></div> : s.val}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Activity Feed ──────────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></span> Recent Activity
                    </div>
                    <div className="scroll-area">
                        <ul className="activity-feed">
                            {isLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <li key={i} className="activity-item">
                                        <div className="activity-icon-wrapper skeleton" style={{ width: '28px', height: '28px', borderRadius: '50%' }}></div>
                                        <div className="activity-body">
                                            <div className="skeleton-text" style={{ width: '85%', height: '14px', marginBottom: '6px' }}></div>
                                            <div className="skeleton-text" style={{ width: '30%', height: '12px' }}></div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <>
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
                                </>
                            )}
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
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i}>
                                            <td><div className="skeleton-text" style={{ width: '50px', height: '14px' }}></div></td>
                                            <td><div className="skeleton-text" style={{ width: '150px', height: '14px' }}></div></td>
                                            <td><div className="skeleton-text" style={{ width: '80px', height: '14px' }}></div></td>
                                            <td><div className="skeleton" style={{ width: '70px', height: '20px', borderRadius: '10px' }}></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr onClick={() => navigate('/challenges/c4')} style={{ cursor: 'pointer' }}>
                                            <td className="id-col">CH-007</td>
                                            <td>Sustainability Tech</td>
                                            <td>Feb 18, 2026</td>
                                            <td><span className="status-pill status-ideation">Ideation</span></td>
                                        </tr>
                                        <tr onClick={() => navigate('/challenges/c1/ideas/id-0204')} style={{ cursor: 'pointer' }}>
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
                                    </>
                                )}
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
                                                className={`heatmap-cell ${isLoading ? 'skeleton' : (level > 0 ? `level-${level}` : '')}`}
                                                style={{ animationDelay: `${i * 0.003}s` }}
                                                title={isLoading ? 'Loading...' : (level === 0 ? 'No activity' : `${level * 2} contributions`)}
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

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be permanently removed."
                confirmText="Delete Account"
                type="danger"
            />
        </div>
    );
};
