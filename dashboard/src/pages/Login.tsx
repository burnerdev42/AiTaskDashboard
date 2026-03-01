import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Clock } from 'lucide-react';
import { storage } from '../services/storage';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const from = '/';

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    // Standard Password Policy:
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
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
        setIsPending(false);

        if (!isFormValid) {
            showToast('Please enter a valid email and a valid password.', 'error');
            return;
        }

        // Check for pending registrations dynamically
        if (storage.isEmailPending(email)) {
            setIsPending(true);
            return;
        }

        const success = await login(email.toLowerCase().trim());
        if (success) {
            showToast('Welcome back! You have signed in successfully.');
            // Force a hard reload to ensure all state and protected routes remount correctly
            window.location.href = from;
        } else {
            showToast('Login failed. Please check your credentials or register.', 'error');
        }
    };

    return (
        <div className="register-page-container">
            <div className="form-card">
                <div className="form-header" style={{ marginBottom: 24 }}>
                    <div className="icon-circle premium-logo" style={{
                        width: 80, height: 80, fontSize: 40, marginBottom: 28,
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px auto'
                    }}>∞</div>
                    <h2 style={{ fontSize: 24, marginBottom: 4 }}>Welcome Back</h2>
                    <p style={{ fontSize: 14 }}>Sign in to continue to Innovation Pipeline</p>
                </div>

                {isPending && (
                    <div className="pending-banner">
                        <div className="pending-title">
                            <Clock size={16} />
                            <span>Account Pending Approval</span>
                        </div>
                        <div className="pending-detail">
                            Your registration is being reviewed by an admin.<br />
                            You’ll be able to sign in once your account is approved.
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address <span className="req">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            autoFocus
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
                        {password && !isPasswordValid ? (
                            <div style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 6 }}>
                                Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                            </div>
                        ) : (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                Must be at least 8 characters, including uppercase, lowercase, number, and special character.
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            opacity: isFormValid ? 1 : 0.6,
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
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
                            style={{ width: '100%', marginBottom: 0 }}
                            disabled
                        >
                            <Lock size={16} />
                            Sign in with Corporate SSO
                        </button>
                        <div className="coming-soon-badge">
                            Soon
                        </div>
                    </div>

                    <div className="signin-footer">
                        Don't have an account? <Link to="/register">Register now</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};
