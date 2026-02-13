import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        opco: '',
        platform: '',
        email: '',
        password: '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.interests.length === 0) {
            alert('Please select at least one Area of Interest');
            return;
        }

        // Mock registration logic similar to mockup
        localStorage.setItem('ip_user', JSON.stringify(formData));
        localStorage.setItem('ip_loggedIn', 'true');
        localStorage.setItem('isAuthenticated', 'true');

        alert(`Registration successful! Welcome, ${formData.name}`);
        navigate('/');
    };

    const interestsList = [
        'Customer Experience', 'Finance & Ops', 'Supply Chain', 'Product & Data',
        'Manufacturing', 'Sustainability', 'Logistics', 'Retail Ops'
    ];

    return (
        <div className="register-page-container">
            <div className="form-card">
                <div className="form-header">
                    <div className="icon-circle">🚀</div>
                    <h2>Join the Innovation Pipeline</h2>
                    <p>Register to submit challenges, share ideas, and drive impact</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>Full Name <span className="req">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Priya Sharma"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* OpCo */}
                    <div className="form-group">
                        <label>OpCo (Operating Company) <span className="req">*</span></label>
                        <select
                            required
                            value={formData.opco}
                            onChange={(e) => setFormData({ ...formData, opco: e.target.value })}
                        >
                            <option value="" disabled>Select your OpCo</option>
                            <option>Tensor Workshop — North America</option>
                            <option>Tensor Workshop — Europe</option>
                            <option>Tensor Workshop — UK & Ireland</option>
                            <option>Tensor Workshop — Asia Pacific</option>
                            <option>Tensor Workshop — Latin America</option>
                            <option>Tensor Workshop — Middle East & Africa</option>
                            <option>Tensor Workshop — India</option>
                            <option>Tensor Workshop — Japan</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Platform */}
                    <div className="form-group">
                        <label>Platform / Business Unit <span className="req">*</span></label>
                        <select
                            required
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        >
                            <option value="" disabled>Select your platform</option>
                            <option>BFSI</option>
                            <option>Retail & CPG</option>
                            <option>Manufacturing</option>
                            <option>Life Sciences & Healthcare</option>
                            <option>Communications & Media</option>
                            <option>Technology & Services</option>
                            <option>Energy, Resources & Utilities</option>
                            <option>Government & Public Services</option>
                            <option>Travel & Hospitality</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Contact Email */}
                    <div className="form-group">
                        <label>Contact Email <span className="req">*</span></label>
                        <input
                            type="email"
                            placeholder="priya.sharma@tensorworkshop.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="helper">Use your corporate email address</div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password <span className="req">*</span></label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 8 characters"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="toggle-pass"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
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
                                    <span className="chip-check">✓</span> {interest}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider">or</div>

                    {/* Quick SSO */}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginBottom: 8 }}
                        onClick={() => alert('SSO integration placeholder')}
                    >
                        🔐&nbsp;&nbsp;Register with Corporate SSO
                    </button>

                    {/* Actions */}
                    <div className="form-actions">
                        <Link to="/" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cancel</Link>
                        <button type="submit" className="btn btn-primary">Create Account</button>
                    </div>
                </form>

                <div className="form-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};
