import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challengeCards } from '../data/challengeData';
import { SubmitChallengeModal } from '../components/challenges/SubmitChallengeModal';

const IMPACT_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const IMPACT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Critical: { bg: 'rgba(239, 83, 80, .12)', text: '#ef5350', border: 'rgba(239, 83, 80, .25)' },
    High: { bg: 'rgba(255, 167, 38, .12)', text: '#ffa726', border: 'rgba(255, 167, 38, .25)' },
    Medium: { bg: 'rgba(255, 238, 88, .12)', text: '#ffee58', border: 'rgba(255, 238, 88, .25)' },
    Low: { bg: 'rgba(102, 187, 106, .12)', text: '#66bb6a', border: 'rgba(102, 187, 106, .25)' },
};
const STAGE_COLORS: Record<string, string> = {
    Ideation: 'var(--accent-blue)',
    Prototype: 'var(--accent-orange)',
    Pilot: 'var(--accent-teal)',
    Scale: 'var(--accent-green)',
};

export const IdeaSolutionCards: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNewChallenge = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setIsModalOpen(true);
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
        if (impact === 'Critical') return '🔴';
        if (impact === 'High') return '🟠';
        if (impact === 'Medium') return '🟡';
        return '🟢';
    };

    return (
        <>
            {/* Toolbar */}
            <div className="ideas-toolbar">
                <div className="ideas-toolbar-left">
                    <h2>
                        <span>🎯</span> Challenges
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
                    <input
                        type="text"
                        className="detail-form-input"
                        placeholder="🔍 Search challenges..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className="ideas-btn-new" onClick={handleNewChallenge}>
                        ✨ New Challenge
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="ideas-cards-grid">
                {filteredCards.map(card => {
                    const impactStyle = IMPACT_COLORS[card.impact] || IMPACT_COLORS.Low;
                    return (
                        <div key={card.id} className="idea-solution-card" onClick={() => navigate(`/challenges/${card.id}`)}>

                            {/* Card ID Header */}
                            <div className="idea-card-id-header">
                                <div className="idea-card-id-info">
                                    <div className="idea-card-number">
                                        <span className="bulb">🎯</span>
                                        {card.challengeNumber}
                                    </div>
                                    <div className="challenge-card-badges">
                                        <span
                                            className="challenge-stage-badge"
                                            style={{ background: STAGE_COLORS[card.stage] || 'var(--accent-teal)' }}
                                        >
                                            {card.stage}
                                        </span>
                                        <span
                                            className="challenge-impact-badge"
                                            style={{
                                                background: impactStyle.bg,
                                                color: impactStyle.text,
                                                borderColor: impactStyle.border,
                                            }}
                                        >
                                            {getImpactIcon(card.impact)} {card.impact} Impact
                                        </span>
                                    </div>
                                </div>
                                <div className="idea-card-edit-icon" onClick={(e) => { e.stopPropagation(); navigate(`/challenges/${card.id}?edit=true`); }}>✏️</div>
                            </div>

                            {/* Challenge Body */}
                            <div className="idea-card-solution-body">
                                <div className="idea-card-solution-title">{card.title}</div>
                                <p className="challenge-card-desc">{card.description}</p>
                                <div className="challenge-card-ideas-count">
                                    <span>💡</span>
                                    <span>{card.ideasCount} ideas submitted</span>
                                </div>
                            </div>

                            {/* Meta Footer */}
                            <div className="idea-card-meta-section">
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon">⏱️</span>
                                    <span>Effort</span>
                                    <span className="meta-val">{card.effort}</span>
                                </div>
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon">💰</span>
                                    <span>Value</span>
                                    <span className="meta-val money">{card.value}</span>
                                </div>
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon">👤</span>
                                    <span>Owner</span>
                                    <div className="challenge-card-owner">
                                        <div className="mini-av" style={{ background: card.owner.color }}>{card.owner.initial}</div>
                                        <span>{card.owner.name}</span>
                                    </div>
                                </div>
                                <div className="idea-card-meta-row">
                                    <span className="meta-icon">👥</span>
                                    <span>Team</span>
                                    <div className="idea-card-team-avatars">
                                        {card.team.map((t, i) => (
                                            <div key={i} className="mini-av" style={{ background: t.color }}>{t.initial}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <SubmitChallengeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
