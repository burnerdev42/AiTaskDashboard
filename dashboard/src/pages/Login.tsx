import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const from = location.state?.from?.pathname || '/';

    const isPasswordValid = useMemo(() => {
        if (!password) return false;
        if (password.length < 8) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        return true;
    }, [password]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid = isEmailValid && isPasswordValid;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            showToast('Please enter a valid email and a valid password.', 'error');
            return;
        }

        const { success, error: apiError } = await login(email, password);
        if (success) {
            showToast('Welcome back! You have signed in successfully.');
            navigate(from, { replace: true });
        } else {
            showToast(apiError || 'Login failed. Please check your credentials or register.', 'error');
        }
    };

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
                    <h2 style={{ fontSize: 24, marginBottom: 4 }}>Welcome Back</h2>
                    <p style={{ fontSize: 14 }}>Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address <span className="req">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                        />
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            Enter the email address associated with your account.
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password <span className="req">*</span></label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
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
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        style={{
                            width: '100%',
                            height: '42px',
                            opacity: isFormValid ? 1 : 0.6,
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        disabled={!isFormValid}
                    >
                        Sign In
                    </button>

                    <div className="divider">or</div>

                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                        <button
                            type="button"
                            className="btn sso-btn"
                            style={{ marginBottom: 0 }}
                            disabled
                        >
                            <Lock size={16} />
                            Sign in with Corporate SSO
                        </button>
                        <div className="coming-soon-badge">
                            Soon
                        </div>
                    </div>

                    <div className="form-footer">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>
                </form>
            </div >
        </div >
    );
};
