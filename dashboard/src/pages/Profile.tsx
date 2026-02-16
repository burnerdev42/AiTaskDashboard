import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="login-prompt" id="loginPrompt">
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

    // Hepler to get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="profile-container" id="profileContainer">
            {/* ── Left: Profile Card ───────────────── */}
            <aside className="profile-card">
                <div className="view-mode" id="viewMode">
                    <div className="profile-avatar" id="profileAvatar">
                        {typeof user.avatar === 'string' ? user.avatar : getInitials(user.name)}
                    </div>
                    <div className="profile-name" id="profileName">{user.name}</div>
                    <div className="profile-email" id="profileEmail">{user.email}</div>

                    <div className="profile-badges">
                        <span className="badge badge-opco" id="badgeOpco">{user.opco || 'Global'}</span>
                        <span className="badge badge-platform" id="badgePlatform">{user.platform || 'General'}</span>
                        <span className="badge badge-role">Innovator</span>
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
                        <div className="interest-tags" id="interestTags">
                            <span className="interest-tag">Customer Experience</span>
                            <span className="interest-tag">Product & Data</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn-sm btn-edit" onClick={() => alert('Edit mode not implemented yet')}>✏️ Edit Profile</button>
                        <button className="btn-sm btn-logout" onClick={handleLogout}>🚪 Sign Out</button>
                    </div>
                </div>
            </aside>

            {/* ── Right: Profile Content ───────────────── */}
            <div className="profile-content">

                {/* ── Stats Row ──────────────────────── */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Streak Days</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💡</div>
                        <div className="stat-value">8</div>
                        <div className="stat-label">Total Ideas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚀</div>
                        <div className="stat-value">3</div>
                        <div className="stat-label">Challenges</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-value">Top 5%</div>
                        <div className="stat-label">Contributor</div>
                    </div>
                </div>

                {/* ── Activity Feed ──────────────────── */}
                <div className="section-card">
                    <div className="section-title">
                        <span className="icon">⚡</span> Recent Activity
                    </div>
                    <ul className="activity-feed">
                        <li className="activity-item">
                            <div className="activity-dot dot-idea"></div>
                            <div className="activity-body">
                                <div className="activity-text">
                                    Submitted a new idea <strong>"AI-based Lead Scoring"</strong> for <strong>Sales Optimization</strong> challenge.
                                </div>
                                <div className="activity-time">2 hours ago</div>
                            </div>
                        </li>
                        <li className="activity-item">
                            <div className="activity-dot dot-comment"></div>
                            <div className="activity-body">
                                <div className="activity-text">
                                    Commented on <strong>"Automated Invoice Processing"</strong>.
                                </div>
                                <div className="activity-time">Yesterday at 4:15 PM</div>
                            </div>
                        </li>
                        <li className="activity-item">
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
                        <span className="icon">📂</span> Recent Submissions
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
                            <tr>
                                <td className="id-col">ID-204</td>
                                <td>AI-based Lead Scoring</td>
                                <td>Feb 16, 2026</td>
                                <td><span className="status-pill status-eval">Evaluation</span></td>
                            </tr>
                            <tr>
                                <td className="id-col">ID-198</td>
                                <td>Voice Command Dashboard</td>
                                <td>Feb 10, 2026</td>
                                <td><span className="status-pill status-pilot">Pilot</span></td>
                            </tr>
                            <tr>
                                <td className="id-col">ID-185</td>
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
                        <span className="icon">📊</span> Contribution Graph
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
