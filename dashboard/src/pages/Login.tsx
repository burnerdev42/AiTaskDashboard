import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email);
        if (success) {
            navigate(from, { replace: true });
        } else {
            setError('User not found. Try admin@ananta.azurewebsites.net');
        }
    };

    return (
        <div className="register-page-container">
            <div className="form-card">
                <div className="form-header">
                    <div className="icon-circle">∞</div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue to Innovation Pipeline</p>
                </div>

                {error && <div style={{ color: 'var(--accent-red)', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address <span className="req">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@ananta.azurewebsites.net"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password <span className="req">*</span></label>
                        <input
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Sign In
                    </button>

                    <div className="divider">or</div>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginBottom: 8 }}
                        onClick={() => alert('SSO integration placeholder')}
                    >
                        🔐&nbsp;&nbsp;Sign in with Corporate SSO
                    </button>

                    <div className="form-footer">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>

                    <div style={{ marginTop: 20, padding: 12, background: 'rgba(232,167,88,.08)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                        For demo: Use <strong style={{ color: 'var(--text-primary)' }}>admin@ananta.azurewebsites.net</strong>
                    </div>
                </form>
            </div>
        </div>
    );
};
