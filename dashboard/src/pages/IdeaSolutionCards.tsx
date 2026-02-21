import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challengeCards } from '../data/challengeData';

const IMPACT_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const IMPACT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Critical: { bg: 'rgba(239, 83, 80, .12)', text: '#ef5350', border: 'rgba(239, 83, 80, .25)' },
    High: { bg: 'rgba(255, 167, 38, .12)', text: '#ffa726', border: 'rgba(255, 167, 38, .25)' },
    Medium: { bg: 'rgba(255, 238, 88, .12)', text: '#ffee58', border: 'rgba(255, 238, 88, .25)' },
    Low: { bg: 'rgba(102, 187, 106, .12)', text: '#66bb6a', border: 'rgba(102, 187, 106, .25)' },
};

const STAGE_BRANDING: Record<string, { color: string, bg: string, icon: React.ReactNode }> = {
    'Challenge Submitted': {
        color: 'var(--accent-red)', bg: 'rgba(239,83,80,.15)',
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg>
    },
    'Ideation & Evaluation': {
        color: 'var(--accent-yellow)', bg: 'rgba(255,238,88,.12)',
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    },
    'POC & Pilot': {
        color: 'var(--accent-blue)', bg: 'rgba(240,184,112,.15)',
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    },
    'Scaled & Deployed': {
        color: 'var(--accent-gold)', bg: 'rgba(255,213,79,.12)',
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
    },
    'Parking Lot': {
        color: 'var(--accent-grey)', bg: 'rgba(120,144,156,.15)',
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>
    }
};

export const IdeaSolutionCards: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const handleNewChallenge = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
        navigate('/challenges/submit');
    };

    const filteredCards = challengeCards.filter(card => {
        // Impact filter
        if (activeFilter !== 'All' && card.impact !== activeFilter) {
            return false;
        }
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return card.title.toLowerCase().includes(term) || card.description.toLowerCase().includes(term);
        }
        return true;
    });

    const getImpactIcon = (impact: string) => {
        const color = impact === 'Critical' ? '#ef5350' : impact === 'High' ? '#ffa726' : impact === 'Medium' ? '#ffee58' : '#66bb6a';
        return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 4 }} />;
    };

    return (
        <>
            {/* Toolbar */}
            <div className="ideas-toolbar">
                <div className="ideas-toolbar-left">
                    <h2>
                        Challenges
                        <span className="ideas-total-badge">{filteredCards.length} challenges</span>
                    </h2>
                    <div className="ideas-toolbar-filters">
                        {/* Desktop: Button Group */}
                        <div className="desktop-filters">
                            {IMPACT_FILTERS.map(filter => (
                                <button
                                    key={filter}
                                    className={`ideas-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter !== 'All' && getImpactIcon(filter)} {filter}
                                </button>
                            ))}
                        </div>

                        {/* Mobile: Select Dropdown */}
                        <div className="mobile-filters">
                            <label className="mobile-filter-label">Filter by Impact:</label>
                            <div className="mobile-select-wrapper">
                                <select
                                    value={activeFilter}
                                    onChange={(e) => setActiveFilter(e.target.value)}
                                    className="mobile-filter-select"
                                >
                                    {IMPACT_FILTERS.map(filter => (
                                        <option key={filter} value={filter}>
                                            {filter === 'All' ? 'All Impacts' : `${filter} Impact`}
                                        </option>
                                    ))}
                                </select>
                                <span className="select-arrow">▼</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ideas-toolbar-actions">
                    <div
                        className={`search-expand-wrapper ${isSearchExpanded || searchTerm ? 'expanded' : ''}`}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    >
                        <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>
                        <input
                            type="text"
                            className="detail-form-input search-expand-input"
                            placeholder={isSearchExpanded || searchTerm ? "Search challenges..." : ""}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchExpanded(true)}
                            onBlur={() => setIsSearchExpanded(false)}
                            style={{ paddingLeft: '36px' }}
                        />
                    </div>
                    <button className="ideas-btn-new" onClick={handleNewChallenge}>
                        New Challenge
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="ideas-cards-grid">
                {filteredCards.map(card => {
                    const impactStyle = IMPACT_COLORS[card.impact] || IMPACT_COLORS.Low;
                    return (
                        <div key={card.id} className="idea-solution-card" onClick={() => navigate(`/challenges/${card.id}`)}>

                            {/* Corner: ID badge top-left, Edit icon top-right */}
                            <div className="challenge-id-badge">
                                {card.challengeNumber}
                            </div>
                            {isAuthenticated && card.owner.name === 'Current User' && (
                                <div className="idea-card-edit-icon" onClick={(e) => { e.stopPropagation(); navigate(`/challenges/${card.id}?edit=true`); }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></div>
                            )}

                            {/* Badges row */}
                            <div className="challenge-header-row">
                                <span
                                    className="challenge-impact-badge"
                                    style={{
                                        background: impactStyle.bg,
                                        color: impactStyle.text,
                                        borderColor: impactStyle.border,
                                        opacity: 0.9
                                    }}
                                >
                                    {getImpactIcon(card.impact)} {card.impact} Impact
                                </span>
                                {(() => {
                                    const brand = STAGE_BRANDING[card.stage] || STAGE_BRANDING['Challenge Submitted'];
                                    return (
                                        <div className="stage-badge" style={{ background: brand.bg, color: brand.color, display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '10px', border: `1px solid ${brand.color}33`, width: 'max-content' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>{brand.icon}</span>
                                            {card.stage}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Challenge Body */}
                            <div className="idea-card-solution-body">
                                <div className="idea-card-solution-title">{card.title}</div>
                                <p className="challenge-card-desc">{card.description}</p>
                            </div>

                            {/* Meta Footer */}
                            <div className="idea-card-meta-section">
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></span>
                                    <span>Author</span>
                                    <div className="challenge-card-owner">
                                        <span style={{ fontWeight: '500' }}>{card.owner.name}</span>
                                    </div>
                                </div>
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg></span>
                                    <span>Platform</span>
                                    <span className="meta-val">Business Unit</span>
                                </div>
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
                                    <span>Submitted on</span>
                                    <span className="meta-val">Jan 15, 2026</span>
                                </div>
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>
                                    <span>Top Contributors</span>
                                    <div className="idea-card-team-avatars">
                                        {card.team.slice(0, 5).map((t, i) => (
                                            <div
                                                key={i}
                                                className="mini-av"
                                                data-tooltip={t.name}
                                                style={{
                                                    background: t.color,
                                                    fontWeight: '600',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                    border: '2px solid white',
                                                    cursor: 'help'
                                                }}
                                            >
                                                {t.initial}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div >
        </>
    );
};
