import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Rocket, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    const [formData, setFormData] = useState({
        name: '',
        opco: '',
        platform: '',
        email: '',
        password: '',
        interests: [] as string[]
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isPendingOverlay, setIsPendingOverlay] = useState(false);
    const [countdown, setCountdown] = useState(10);

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
        if (!/[!@#$%^&*(),.?":{}\|<>]/.test(pwd)) return false;
        return true;
    }, [formData.password]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isFormValid = isEmailValid && isPasswordValid && formData.name && formData.opco && formData.platform && formData.interests.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            showToast('Please fill in all required fields and ensure password meets requirements.', 'error');
            return;
        }

        const success = await register({
            name: formData.name,
            email: formData.email,
            role: 'Contributor', // Default role for new registrations
            opco: formData.opco,
            platform: formData.platform,
            interests: formData.interests,
        });

        if (success) {
            setIsPendingOverlay(true);
        } else {
            showToast('An account with this email already exists or is pending approval.', 'error');
        }
    };

    useEffect(() => {
        let timer: any;
        if (isPendingOverlay && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (isPendingOverlay && countdown === 0) {
            navigate('/login');
        }
        return () => clearInterval(timer);
    }, [isPendingOverlay, countdown, navigate]);

    const interestsList = [
        'Customer Experience', 'Finance & Ops', 'Supply Chain', 'Product & Data',
        'Manufacturing', 'Sustainability', 'Logistics', 'Retail Ops'
    ];

    const opcos = [
        "Albert Heijn", "GSO", "BecSee"
    ];

    const platforms = [
        "STP", "CTP", "RBP"
    ];

    return (
        <div className="register-page-container">
            <div className="form-card">
                <div className="form-header" style={{ marginBottom: 24 }}>
                    <div className="icon-circle" style={{
                        width: 80, height: 80, fontSize: 40, marginBottom: 28,
                        background: 'rgba(232,167,88,0.12)',
                        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent-teal)', margin: '0 auto 28px auto'
                    }}>
                        <Rocket size={40} />
                    </div>
                    <h2 style={{ fontSize: 24, marginBottom: 4 }}>Join the Innovation Pipeline</h2>
                    <p style={{ fontSize: 14 }}>Register to submit challenges, share ideas, and drive impact</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>Full Name <span className="req">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Jane Doe"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* OpCo */}
                    <div className="form-group">
                        <label>OpCo (Operating Company) <span className="req">*</span></label>
                        <select
                            value={formData.opco}
                            onChange={(e) => {
                                setFormData({ ...formData, opco: e.target.value, platform: '' });
                            }}
                            required
                        >
                            <option value="" disabled>Select your OpCo</option>
                            {opcos.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Platform */}
                    <div className="form-group">
                        <label>Platform / Business Unit <span className="req">*</span></label>
                        <select
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            required
                            disabled={!formData.opco}
                        >
                            <option value="" disabled>Select your platform</option>
                            {formData.opco === 'Albert Heijn' ? (
                                platforms.map(p => <option key={p} value={p}>{p}</option>)
                            ) : (
                                <option value="Other">Other</option>
                            )}
                        </select>
                    </div>

                    {/* Contact Email */}
                    <div className="form-group">
                        <label>Contact Email <span className="req">*</span></label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="helper">Use your corporate email address</div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password <span className="req">*</span></label>
                        <div className="password-wrapper" style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
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
                        {formData.password && !isPasswordValid ? (
                            <div style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 6 }}>
                                Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                            </div>
                        ) : (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, marginBottom: 8 }}>
                                Must be at least 8 characters, including uppercase, lowercase, number, and special character.
                            </div>
                        )}
                        <div className={`strength-bar s${strength}`}>
                            <span></span><span></span><span></span><span></span>
                        </div>
                    </div>

                    {/* Area of Interest */}
                    <div className="form-group">
                        <label>Area of Interest <span className="req">*</span></label>
                        <p className="helper" style={{ marginTop: 0, marginBottom: 10 }}>Select one or more problem categories you're interested in</p>
                        <div className="interest-chips">
                            {interestsList.map(interest => (
                                <div
                                    key={interest}
                                    className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                                    onClick={() => handleInterestToggle(interest)}
                                >
                                    <span className="chip-check">
                                        {formData.interests.includes(interest) ? <Check size={10} /> : null}
                                    </span> {interest}
                                </div>
                            ))}
                        </div>
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
                        <div className="coming-soon-badge">Soon</div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions" style={{ marginTop: 32, display: 'flex', gap: '12px' }}>
                        <Link to="/login" className="btn btn-secondary" style={{ flex: 1, textDecoration: 'none' }}>
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                flex: 1,
                                opacity: isFormValid ? 1 : 0.6,
                                cursor: isFormValid ? 'pointer' : 'not-allowed'
                            }}
                            disabled={!isFormValid}
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="form-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>

            {/* Pending Approval Overlay */}
            {isPendingOverlay && (
                <div className="pending-overlay show">
                    <div className="pending-card">
                        <div className="pending-icon-container">
                            <Check size={48} />
                        </div>
                        <h2 className="pending-title" style={{ color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '16px' }}>
                            Registration Submitted!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.7' }}>
                            Your account request has been received. An admin will review and approve your registration shortly.
                        </p>

                        <div className="pending-email-badge">
                            {formData.email}
                        </div>

                        <ul className="pending-steps-list">
                            <li>
                                <span className="step-icon complete">
                                    <Check size={16} />
                                </span>
                                <span>Registration form submitted</span>
                            </li>
                            <li>
                                <span className="step-icon active">2</span>
                                <span>Admin reviews your request</span>
                            </li>
                            <li>
                                <span className="step-icon">3</span>
                                <span>Approval granted & sign in active</span>
                            </li>
                        </ul>

                        <Link to="/login" className="btn btn-primary" style={{ display: 'flex', width: '100%', textDecoration: 'none', justifyContent: 'center', alignItems: 'center', height: '44px' }}>
                            Go to Sign In
                        </Link>

                        <div className="redirect-timer">
                            Automatic redirect in <b>{countdown}s</b>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
