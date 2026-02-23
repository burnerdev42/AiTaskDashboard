import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        opco: '',
        platform: '',
        email: '',
        password: '',
        role: '',
        about: '',
        interests: [] as string[]
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests };
        });
    };

    const getPasswordStrength = (pwd: string) => {
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        return s;
    };

    const strength = getPasswordStrength(formData.password);

    // Standard Password Policy
    const isPasswordValid = useMemo(() => {
        const pwd = formData.password;
        if (!pwd) return false;
        if (pwd.length < 8) return false;
        if (!/[A-Z]/.test(pwd)) return false;
        if (!/[a-z]/.test(pwd)) return false;
        if (!/[0-9]/.test(pwd)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return false;
        return true;
    }, [formData.password]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    const isFormValid = isEmailValid && isPasswordValid;
    const isReadyToSubmit = isFormValid && !!formData.name.trim() && !!formData.opco && !!formData.platform && !!formData.role.trim() && formData.interests.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.opco || !formData.platform || !formData.role.trim() || !isFormValid) {
            showToast('Please fill out all required fields correctly. Password or email might be invalid.', 'error');
            return;
        }

        const { success, error: apiError } = await register({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            opco: formData.opco,
            platform: formData.platform,
            about: formData.about,
            interests: formData.interests,
        });

        if (success) {
            showToast(`Registration successful! Welcome, ${formData.name}`);
            navigate('/');
        } else {
            showToast(apiError || 'Registration failed. Please try again.', 'error');
        }
    };

    const interestsList = [
        'Customer Experience', 'Finance & Ops', 'Supply Chain', 'Product & Data',
        'Manufacturing', 'Sustainability', 'Logistics', 'Retail Ops'
    ];

    return (
        <div className="register-page-container">
            <div className="form-card">
                <div className="form-header" style={{ marginBottom: 24 }}>
                    <div className="icon-circle" style={{
                        width: 80, height: 80, fontSize: 40, marginBottom: 28,
                        background: 'linear-gradient(135deg, rgba(240,184,112,0.15), rgba(94,234,212,0.15))',
                        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent-teal)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        margin: '0 auto 28px auto'
                    }}>∞</div>
                    <h2 style={{ fontSize: 24, marginBottom: 4 }}>Join the Innovation Pipeline</h2>
                    <p style={{ fontSize: 14 }}>Register to submit challenges, share ideas, and drive impact</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>Full Name <span className="req">*</span></label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* OpCo */}
                    <div className="form-group">
                        <label>OpCo <span className="req">*</span></label>
                        <select
                            value={formData.opco}
                            onChange={(e) => setFormData({ ...formData, opco: e.target.value, platform: '' })}
                        >
                            <option value="" disabled>Select your OpCo</option>
                            <option value="Albert Heijn">Albert Heijn</option>
                            <option value="GSO">GSO</option>
                            <option value="GET">GET</option>
                            <option value="BecSee">BecSee</option>
                        </select>
                    </div>

                    {/* Platform */}
                    <div className="form-group">
                        <label>Platform <span className="req">*</span></label>
                        <select
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            disabled={!formData.opco}
                        >
                            <option value="" disabled>Select your platform</option>
                            {formData.opco === 'Albert Heijn' && (
                                <>
                                    <option value="STP">STP</option>
                                    <option value="CTP">CTP</option>
                                    <option value="RBP">RBP</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Contact Email */}
                    <div className="form-group">
                        <label>Contact Email <span className="req">*</span></label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="helper">Use your corporate email address</div>
                    </div>

                    {/* Role */}
                    <div className="form-group">
                        <label>Role / Job Title <span className="req">*</span></label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="" disabled>Select your Technical Role</option>
                            <option value="Innovation Lead">Innovation Lead</option>
                            <option value="AI / ML Engineer">AI / ML Engineer</option>
                            <option value="IoT & Digital Twin Lead">IoT & Digital Twin Lead</option>
                            <option value="Data Science Lead">Data Science Lead</option>
                            <option value="Full-Stack Developer">Full-Stack Developer</option>
                            <option value="UX / Design Lead">UX / Design Lead</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Cloud Architect">Cloud Architect</option>
                            <option value="Data Engineer">Data Engineer</option>
                            <option value="DevOps Lead">DevOps Lead</option>
                            <option value="Contributor">Contributor</option>
                        </select>
                    </div>

                    {/* About */}
                    <div className="form-group">
                        <label>About Me</label>
                        <textarea
                            placeholder="Share a brief overview of your expertise and what you're passionate about..."
                            value={formData.about}
                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                padding: '12px',
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: '#fff',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password <span className="req">*</span></label>
                        <div className="password-wrapper" style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="toggle-pass"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, marginBottom: 8 }}>
                            Must be at least 8 characters, including uppercase, lowercase, number, and special character.
                        </div>
                        <div className={`strength-bar s${strength}`}>
                            <span></span><span></span><span></span><span></span>
                        </div>
                    </div>

                    {/* Area of Interest */}
                    <div className="form-group">
                        <label>Area of Interest</label>
                        <p className="helper" style={{ marginTop: 0, marginBottom: 10 }}>Select one or more problem categories you're interested in</p>
                        <div className="interest-chips">
                            {interestsList.map(interest => (
                                <div
                                    key={interest}
                                    className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                                    onClick={() => handleInterestToggle(interest)}
                                >
                                    <span className="chip-check">✓</span> {interest}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="submit-form-actions" style={{ padding: '16px 0 0', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <Link to="/" className="btn-cancel btn-sm" style={{ flex: 1 }}>
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: isReadyToSubmit ? 1 : 0.6,
                                cursor: isReadyToSubmit ? 'pointer' : 'not-allowed'
                            }}
                            disabled={!isReadyToSubmit}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="divider">or</div>

                    {/* Quick SSO */}
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', marginBottom: 16 }}>
                        <button
                            type="button"
                            className="btn sso-btn"
                            style={{ marginBottom: 0 }}
                            disabled
                        >
                            <Lock size={16} />
                            Register with Corporate SSO
                        </button>
                        <div className="coming-soon-badge">
                            Soon
                        </div>
                    </div>
                </form>

                <div className="form-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};
