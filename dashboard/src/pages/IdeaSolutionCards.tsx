import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { type Challenge } from '../types';


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
        color: 'var(--accent-green)', bg: 'rgba(102,187,106,.15)',
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
    const [statusFilter, setStatusFilter] = useState('Active');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    React.useEffect(() => {
        // Load challenges from storage
        const storedChallenges = storage.getChallenges();
        setChallenges(storedChallenges);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleNewChallenge = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
        navigate('/challenges/submit');
    };

    const filteredCards = challenges.filter(card => {
        // Impact filter
        if (activeFilter !== 'All' && card.impact !== activeFilter) {
            return false;
        }
        // Status filter (Active/Pending/Declined)
        if (statusFilter === 'Active') {
            // Include Approved or those without a status (legacy)
            if (card.approvalStatus === 'Rejected' || card.approvalStatus === 'Pending') return false;
        } else if (statusFilter === 'Pending') {
            if (card.approvalStatus !== 'Pending') return false;
        } else if (statusFilter === 'Declined') {
            if (card.approvalStatus !== 'Rejected') return false;
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesTitle = card.title.toLowerCase().includes(term);
            const matchesDesc = card.description.toLowerCase().includes(term);
            const matchesSummary = card.summary?.toLowerCase().includes(term);
            const matchesTags = card.tags?.some(tag => tag.toLowerCase().includes(term));
            return matchesTitle || matchesDesc || matchesSummary || matchesTags;
        }
        return true;
    });

    const getImpactIcon = (impact: string) => {
        const color = impact === 'Critical' ? '#ef5350' : impact === 'High' ? '#ffa726' : impact === 'Medium' ? '#ffee58' : '#66bb6a';
        return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 6 }} />;
    };

    const getStatusIcon = (statusId: string) => {
        const colors: Record<string, string> = {
            All: '#ffa726',
            Active: '#66bb6a',
            Pending: '#ffee58',
            Declined: '#ef5350'
        };
        const color = colors[statusId] || '#ccc';
        const iconStyle = { display: 'inline-flex', alignItems: 'center', marginRight: 6, color } as React.CSSProperties;

        if (statusId === 'All') {
            return <span style={iconStyle}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg></span>;
        }
        if (statusId === 'Active') {
            return <span style={iconStyle}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></span>;
        }
        if (statusId === 'Pending') {
            return <span style={iconStyle}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>;
        }
        // Declined
        return <span style={iconStyle}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg></span>;
    };

    return (
        <div className={`page-transition ${!isLoading ? 'fade-in' : ''}`}>
            {/* Toolbar: Reverted Styling, Preserved Layout */}
            <div className="ideas-toolbar" style={{
                height: 'auto',
                padding: '24px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '20px',
                background: 'rgba(13, 15, 26, 0.4)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
            }}>
                {/* Row 1: Title & Stats + Global Actions */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                                Challenges
                            </h1>
                            <span className="ideas-total-badge" style={{ marginLeft: '12px' }}>
                                {isLoading ? '...' : `${challenges.length} Total`}
                            </span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Browse, filter, and track all innovation challenges across the pipeline.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div
                            className={`search-expand-wrapper ${isSearchExpanded || searchTerm ? 'expanded' : ''}`}
                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                        >
                            <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none', zIndex: 1, opacity: 0.7 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </span>
                            <input
                                type="text"
                                className="detail-form-input"
                                placeholder={isSearchExpanded || searchTerm ? "Search challenges..." : ""}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchExpanded(true)}
                                onBlur={() => setIsSearchExpanded(false)}
                                style={{
                                    paddingLeft: '36px',
                                    height: '38px',
                                    width: isSearchExpanded || searchTerm ? '280px' : '200px',
                                    fontSize: '13px'
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            className="ideas-btn-new"
                            onClick={handleNewChallenge}
                            disabled={isLoading}
                            style={{ height: '38px', padding: '0 20px', fontSize: '13px' }}
                        >
                            New Challenge
                        </button>
                    </div>
                </div>

                {/* Row 2: Status and Impact Filters - Aligned on same line */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '20px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginRight: '12px', opacity: 0.6 }}>STATUS</span>
                        {[
                            { id: 'All', label: 'All' },
                            { id: 'Active', label: 'Active' },
                            { id: 'Pending', label: 'Pending' },
                            { id: 'Declined', label: 'Declined' }
                        ].map(status => {
                            const countNum = status.id === 'All' ? challenges.length :
                                status.id === 'Active' ? challenges.filter(c => c.approvalStatus !== 'Rejected' && c.approvalStatus !== 'Pending').length :
                                    status.id === 'Pending' ? challenges.filter(c => c.approvalStatus === 'Pending').length :
                                        challenges.filter(c => c.approvalStatus === 'Rejected').length;

                            const isActive = statusFilter === status.id;

                            return (
                                <button
                                    key={status.id}
                                    className={`sub-filter ${isActive ? 'active' : ''}`}
                                    onClick={() => setStatusFilter(status.id)}
                                    style={{
                                        padding: '7px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {getStatusIcon(status.id)}
                                    <span style={{ fontWeight: 700 }}>{status.label}</span>
                                    <span style={{
                                        marginLeft: '8px',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        padding: '1px 7px',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        opacity: isActive ? 1 : 0.7,
                                        minWidth: '20px',
                                        textAlign: 'center'
                                    }}>
                                        {isLoading ? '0' : countNum}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px', opacity: 0.2 }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginRight: '12px', opacity: 0.6 }}>IMPACT</span>
                        <div className="desktop-filters" style={{ display: 'flex', gap: '10px' }}>
                            {IMPACT_FILTERS.map(filter => {
                                const isActive = activeFilter === filter;
                                return (
                                    <button
                                        key={filter}
                                        className={`sub-filter ${isActive ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(filter)}
                                        disabled={isLoading}
                                        style={{
                                            padding: '7px 16px'
                                        }}
                                    >
                                        {filter !== 'All' && getImpactIcon(filter)}
                                        <span style={{ fontWeight: 700 }}>{filter}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Select Dropdown (hidden on desktop via css class if needed, but keeping for functionality) */}
            <div className="mobile-filters" style={{ padding: '16px 40px', display: 'none' }}>
                <label className="mobile-filter-label">Filter by Impact:</label>
                <div className="mobile-select-wrapper">
                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="mobile-filter-select"
                        disabled={isLoading}
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

            {/* Empty State / Grid Container */}
            <div className="ideas-cards-grid" style={{ padding: '40px' }}>
                {isLoading ? (
                    // Premium Shimmer Skeletons
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="idea-solution-card skeleton" style={{ padding: '28px', minHeight: '320px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="idea-card-skeleton-header" style={{ marginBottom: '24px' }}>
                                <div className="skeleton" style={{ width: '100px', height: '24px', borderRadius: '12px' }}></div>
                                <div className="skeleton" style={{ width: '120px', height: '24px', borderRadius: '12px' }}></div>
                            </div>
                            <div className="idea-card-skeleton-body">
                                <div className="skeleton" style={{ width: '80%', height: '32px', borderRadius: '8px', marginBottom: '16px' }}></div>
                                <div className="skeleton" style={{ width: '100%', height: '18px', borderRadius: '4px', marginBottom: '8px' }}></div>
                                <div className="skeleton" style={{ width: '90%', height: '18px', borderRadius: '4px', marginBottom: '8px' }}></div>
                                <div className="skeleton" style={{ width: '60%', height: '18px', borderRadius: '4px' }}></div>
                            </div>
                            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    {[1, 2, 3].map(j => <div key={j} className="skeleton" style={{ width: '50px', height: '18px', borderRadius: '9px' }}></div>)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredCards.length > 0 ? (
                    filteredCards.map(card => {
                        const impactStyle = IMPACT_COLORS[card.impact || 'Low'] || IMPACT_COLORS.Low;
                        return (
                            <div key={card.id} className="idea-solution-card fade-in" onClick={() => navigate(`/challenges/${card.id?.toLowerCase()}`)} style={{ transition: 'all 0.3s ease' }}>
                                <div className="challenge-id-badge">{card.id}</div>
                                {isAuthenticated && card.owner.name === 'Current User' && (
                                    <div className="idea-card-edit-icon" onClick={(e) => { e.stopPropagation(); navigate(`/challenges/${card.id?.toLowerCase()}?edit=true`); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    </div>
                                )}

                                <div className="challenge-header-row">
                                    {(() => {
                                        const brand = STAGE_BRANDING[card.stage] || STAGE_BRANDING['Challenge Submitted'];
                                        return (
                                            <div className="stage-badge" style={{ background: brand.bg, color: brand.color, display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '14px', fontWeight: '700', fontSize: '11px', border: `1px solid ${brand.color}33` }}>
                                                {brand.icon}
                                                {card.stage}
                                            </div>
                                        );
                                    })()}
                                    <span className="challenge-impact-badge" style={{ background: impactStyle.bg, color: impactStyle.text, borderColor: impactStyle.border, fontWeight: 700, fontSize: '11px', borderRadius: '14px' }}>
                                        {getImpactIcon(card.impact || 'Low')} {card.impact || 'Low'} Impact
                                    </span>
                                </div>

                                <div className="idea-card-solution-body">
                                    <div className="idea-card-solution-title">{card.title}</div>
                                    <p className="challenge-card-desc">{card.summary}</p>
                                    {card.tags && card.tags.length > 0 && (
                                        <div className="challenge-tags-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                                            {card.tags.map(tag => (
                                                <span key={tag} className="challenge-tag-pill">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="idea-card-meta-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginTop: 'auto' }}>
                                    <div className="idea-card-meta-row" style={{ marginBottom: '10px' }}>
                                        <span className="meta-icon" style={{ opacity: 0.5 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></span>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Author: <span style={{ fontWeight: '700', color: 'var(--text-primary)', marginLeft: '6px' }}>{card.owner.name}</span></span>
                                    </div>
                                    <div className="idea-card-meta-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span className="meta-icon" style={{ opacity: 0.5 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>Jan 15, 2026</span>
                                        </div>
                                        <div className="idea-card-team-avatars">
                                            {(card.team || []).slice(0, 4).map((t, i) => (
                                                <div key={i} className="mini-av" data-tooltip={t.name} style={{
                                                    background: t.avatarColor,
                                                    border: '2px solid var(--bg-card)',
                                                    zIndex: 5 - i,
                                                    width: '26px',
                                                    height: '26px',
                                                    fontSize: '10px',
                                                    marginLeft: i === 0 ? 0 : '-10px',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                }}>{t.avatar}</div>
                                            ))}
                                            {card.team && card.team.length > 4 && (
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    marginLeft: '8px',
                                                    fontWeight: 700
                                                }}>+{card.team.length - 4}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '120px 0',
                        background: 'rgba(13, 15, 26, 0.3)',
                        borderRadius: '24px',
                        border: '2px dashed rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{ fontSize: '64px', opacity: 0.2 }}>🔍</div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700 }}>No results for your criteria</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Try selecting a different status or broadening your search</p>
                        </div>
                        <button
                            onClick={() => { setStatusFilter('Active'); setActiveFilter('All'); setSearchTerm(''); }}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '10px 24px',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
