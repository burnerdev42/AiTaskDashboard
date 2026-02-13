import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../features/profile/hooks/useProfile';
import { OPCOS, PLATFORMS, INTEREST_OPTIONS } from '../enums/profileEnums';
import './Profile.css';

// Extended User interface for local state (mocking backend data)
interface ExtendedUserProfile {
    name: string;
    email: string;
    opco: string;
    platform: string;
    interests: string[];
}


/**
 * Profile page component.
 * Displays user stats, contribution chart, submissions, and activity feed.
 * Allows editing basic profile information (name, opco, platform, interests).
 */
export const Profile: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for profile data
    const [profileData, setProfileData] = useState<ExtendedUserProfile>({
        name: '',
        email: '',
        opco: 'TCS — India',
        platform: 'BFSI',
        interests: ['Customer Experience', 'Product & Data']
    });


    const { data: dashboardData, isLoading, error } = useProfile();

    useEffect(() => {
        if (user && (profileData.name !== user.name || profileData.email !== user.email)) {
            // eslint-disable-next-line
            setProfileData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user, profileData.name, profileData.email]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically call an API to update the user profile
        // For now, we just exit edit mode as the state is already updated via onChange
        setIsEditing(false);
        // You might want to update the global AuthContext user name if it changed
        alert('✅ Profile updated successfully!');
    };

    const toggleInterest = (interest: string) => {
        setProfileData(prev => {
            const newInterests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests: newInterests };
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="login-prompt">
                <div className="icon-circle">🔒</div>
                <h2>Sign in to view your profile</h2>
                <p>Access your submissions, track your ideas, and see your impact.</p>
                <div className="btn-group">
                    <Link to="/login" className="btn-go-signin">Sign In</Link>
                    <Link to="/register" className="btn-go-register">Register</Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading profile...</div>;
    }

    if (error) {
        return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--accent-red)' }}>Error: {error}</div>;
    }

    const initials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="profile-container">
            {/* ── Left: Profile Card ───────────────── */}
            <aside className="profile-card">
                {!isEditing ? (
                    /* View Mode */
                    <div className="view-mode">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-name">{profileData.name}</div>
                        <div className="profile-email">{profileData.email}</div>

                        <div className="profile-badges">
                            <span className="badge badge-opco">{profileData.opco}</span>
                            <span className="badge badge-platform">{profileData.platform}</span>
                            <span className="badge badge-role">{user?.role || 'Innovator'}</span>
                        </div>

                        <div className="profile-meta">
                            <div className="meta-item">
                                <span className="label">Member since</span>
                                <span className="value">Jan 2026</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Innovation Score</span>
                                <span className="value" style={{ color: 'var(--accent-gold)' }}>⭐ 847</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Rank</span>
                                <span className="value">#12 of 64</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '18px' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'left' }}>Areas of Interest</div>
                            <div className="interest-tags">
                                {profileData.interests.map(interest => (
                                    <span key={interest} className="interest-tag">{interest}</span>
                                ))}
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="btn-sm btn-edit" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                            <button className="btn-sm btn-logout" onClick={handleLogout}>🚪 Sign Out</button>
                        </div>
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="edit-form">
                        <div className="profile-avatar">{initials}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>Edit Your Profile</div>

                        <form onSubmit={handleSave}>
                            <div className="form-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                />
                            </div>

                            <div className="form-field">
                                <label>Operating Company</label>
                                <select
                                    value={profileData.opco}
                                    onChange={e => setProfileData({ ...profileData, opco: e.target.value })}
                                    required
                                >
                                    <option value="">Select OpCo</option>
                                    {OPCOS.map(opco => (
                                        <option key={opco} value={opco}>{opco}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Platform / Domain</label>
                                <select
                                    value={profileData.platform}
                                    onChange={e => setProfileData({ ...profileData, platform: e.target.value })}
                                    required
                                >
                                    <option value="">Select Platform</option>
                                    {PLATFORMS.map(platform => (
                                        <option key={platform} value={platform}>{platform}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Areas of Interest</label>
                                <div className="interest-chips">
                                    {INTEREST_OPTIONS.map(option => (
                                        <div
                                            key={option}
                                            className={`interest-chip ${profileData.interests.includes(option) ? 'selected' : ''}`}
                                            onClick={() => toggleInterest(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button type="submit" className="btn-sm btn-save">💾 Save Changes</button>
                                <button type="button" className="btn-sm btn-cancel" onClick={() => setIsEditing(false)}>✖️ Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </aside>

            {/* ── Right: Content ───────────────────── */}
            <div className="profile-content">
                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-value">{dashboardData?.stats.challenges || 0}</div>
                        <div className="stat-label">Challenges</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💡</div>
                        <div className="stat-value">{dashboardData?.stats.ideas || 0}</div>
                        <div className="stat-label">Ideas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚀</div>
                        <div className="stat-value">{dashboardData?.stats.inPilot || 0}</div>
                        <div className="stat-label">In Pilot</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">€</div>
                        <div className="stat-value">{dashboardData?.stats.valueImpact || '0'}</div>
                        <div className="stat-label">Value Impact</div>
                    </div>
                </div>

                {/* Contribution Chart */}
                <div className="section-card">
                    <div className="section-title"><span className="icon">📊</span> Monthly Contributions</div>
                    <div className="contrib-chart">
                        {dashboardData?.contributions.map((val, idx) => (
                            <div
                                key={idx}
                                className="contrib-bar"
                                style={{ height: `${val * 10}%` }}
                                data-val={val}
                            />
                        ))}
                    </div>
                    <div className="contrib-months">
                        {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map(month => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-title"><span className="icon">📋</span> My Submissions</div>
                    <table className="submissions-table">
                        <thead>
                            <tr><th>ID</th><th>Title</th><th>Type</th><th>Status</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            {dashboardData?.submissions.map(sub => (
                                <tr key={sub.id} onClick={() => navigate(sub.link)}>
                                    <td className="id-col">{sub.id}</td>
                                    <td>{sub.title}</td>
                                    <td>{sub.type}</td>
                                    <td><span className={`status-pill status-${sub.status.toLowerCase()}`}>{sub.status}</span></td>
                                    <td style={{ color: 'var(--text-muted)' }}>{sub.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Activity */}
                <div className="section-card">
                    <div className="section-title"><span className="icon">⚡</span> Recent Activity</div>
                    <ul className="activity-feed">
                        {dashboardData?.activities.map((act, idx) => (
                            <li key={idx} className="activity-item">
                                <div className={`activity-dot dot-${act.type}`}></div>
                                <div className="activity-body">
                                    <div className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }} />
                                    <div className="activity-time">{act.time}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};
