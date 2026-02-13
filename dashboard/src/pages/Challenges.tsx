import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChallengeService } from '../services/challengeService';
import { useEntityList } from '../hooks/useEntityList';
import type { ChallengeCardData } from '../types';

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

/**
 * Challenges Dashboard Page.
 * Displays a grid of challenge cards fetched from the backend.
 * 
 * Features:
 * - Fetches data using `ChallengeService.getCards`.
 * - Provides search and impact-level filtering.
 * - Navigates to Challenge Details on card click.
 */
export const Challenges: React.FC = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data using the centralized hook
    // Falls back to mocks if API fails or is offline
    const { data: challenges, loading, error } = useEntityList<ChallengeCardData>(ChallengeService.getCards);

    // Client-side filtering logic
    // TODO: Move this to backend via `searchAndFilter` API in future
    const filteredCards = (challenges || []).filter(card => {
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

    /**
     * Helper to get the icon for a given impact level.
     */
    const getImpactIcon = (impact: string) => {
        if (impact === 'Critical') return '🔴';
        if (impact === 'High') return '🟠';
        if (impact === 'Medium') return '🟡';
        return '🟢';
    };

    if (loading) return <div className="p-8 text-center">Loading challenges...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading challenges: {error.message}</div>;

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
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                        type="text"
                        className="detail-form-input"
                        placeholder="🔍 Search challenges..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 220 }}
                    />
                    <button className="ideas-btn-new" onClick={() => navigate('/challenges/submit')}>
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
        </>
    );
};
