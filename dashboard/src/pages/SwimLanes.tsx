import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { type SwimLaneCard, type ChallengeStage } from '../types';
import { useAuth } from '../context/AuthContext';

export const SwimLanes: React.FC = () => {
    const [cards, setCards] = useState<SwimLaneCard[]>([]);
    const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
    const [dragOverLaneId, setDragOverLaneId] = useState<string | null>(null);
    const [dropIndex, setDropIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const draggedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => {
            setCards(storage.getSwimLanes());
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    /* ── Lane Icon SVGs – outlined, inheriting lane color via currentColor ── */
    const S = 22;
    const laneIcons: Record<string, React.ReactNode> = {
        'Challenge Submitted': (
            <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg>
        ),
        'Ideation & Evaluation': (
            <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        ),
        'POC & Pilot': (
            <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        ),
        'Scaled & Deployed': (
            <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
        ),
        'Parking Lot': (
            <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>
        ),
    };

    const lanes: {
        id: ChallengeStage | 'Parking Lot';
        title: string;
        max: number;
        color: string;
        laneClass: string;
        widthLabel: string;
        addLabel: string;
        footerLabel: string;
        badgeBg: string;
    }[] = [
            { id: 'Challenge Submitted', title: 'Challenge<br/>Submitted', max: 6, color: 'var(--accent-red)', laneClass: 'challenge', widthLabel: 'New problems & opportunities', addLabel: 'Add Challenge', footerLabel: 'Challenges submitted', badgeBg: 'rgba(239,83,80,.15)' },
            { id: 'Ideation & Evaluation', title: 'Ideation &<br/>Evaluation', max: 15, color: 'var(--accent-yellow)', laneClass: 'ideation-evaluation', widthLabel: 'Brainstorm & feasibility', addLabel: 'Add Idea/Evaluation', footerLabel: 'To be Evaluated', badgeBg: 'rgba(255,238,88,.12)' },
            { id: 'POC & Pilot', title: 'POC &<br/>Pilot', max: 8, color: 'var(--accent-blue)', laneClass: 'poc-pilot', widthLabel: 'Build & validate prototypes', addLabel: 'Add POC/Pilot', footerLabel: 'Prototypes running', badgeBg: 'rgba(240,184,112,.15)' },
            { id: 'Scaled & Deployed', title: 'Scaled &<br/>Deployed', max: 8, color: 'var(--accent-gold)', laneClass: 'deployed', widthLabel: 'Live in production', addLabel: 'Add Deployment', footerLabel: 'In production', badgeBg: 'rgba(255,213,79,.12)' },
            { id: 'Parking Lot', title: 'Parking<br/>Lot', max: 8, color: 'var(--accent-grey)', laneClass: 'parking', widthLabel: 'Paused or deferred items', addLabel: 'Park Item', footerLabel: 'Items parked', badgeBg: 'rgba(120,144,156,.15)' },
        ];

    const getCardsByLane = (laneId: string) => cards.filter(c => c.stage === laneId);

    /* ── Drag & Drop Handlers ── */
    const handleDragStart = (e: React.DragEvent, cardId: string) => {
        setDraggedCardId(cardId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        draggedRef.current = e.target as HTMLElement;
        setTimeout(() => {
            if (draggedRef.current) draggedRef.current.classList.add('dragging');
        }, 0);
    };

    const handleDragEnd = () => {
        if (draggedRef.current) {
            draggedRef.current.classList.remove('dragging');
            draggedRef.current = null;
        }
        setDraggedCardId(null);
        setDragOverLaneId(null);
        setDropIndex(0);
    };

    const handleLaneDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = useCallback((e: React.DragEvent, laneId: string) => {
        e.preventDefault();
        setDragOverLaneId(laneId);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent, laneEl: HTMLElement) => {
        // Only clear if truly leaving the lane (not entering a child)
        if (!laneEl.contains(e.relatedTarget as Node)) {
            setDragOverLaneId(null);
            setDropIndex(0);
        }
    }, []);

    /* ── Per-card dragOver: detect insertion index via midpoint ── */
    const handleCardDragOver = useCallback((e: React.DragEvent, laneId: string, cardIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const newIndex = e.clientY < midY ? cardIndex : cardIndex + 1;

        setDragOverLaneId(laneId);
        setDropIndex(newIndex);
    }, []);

    /* ── Empty area dragOver (after all cards) ── */
    const handleEmptyAreaDragOver = useCallback((e: React.DragEvent, laneId: string, totalCards: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setDragOverLaneId(laneId);
        setDropIndex(totalCards);
    }, []);

    const handleDrop = (e: React.DragEvent, laneId: string) => {
        e.preventDefault();
        setDragOverLaneId(null);
        if (draggedCardId) {
            // Update storage for stage change
            storage.updateSwimLaneCardStage(draggedCardId, laneId);

            // Reorder in state: remove card, insert at dropIndex
            setCards(prev => {
                const draggedCard = prev.find(c => c.id === draggedCardId);
                if (!draggedCard) return prev;

                // Remove dragged card from array
                const without = prev.filter(c => c.id !== draggedCardId);

                // Get cards in the target lane (without the dragged card)
                const targetLaneCards = without.filter(c => c.stage === laneId);
                const otherCards = without.filter(c => c.stage !== laneId);

                // Clamp dropIndex
                const clampedIndex = Math.min(dropIndex, targetLaneCards.length);

                // Insert dragged card at the correct position
                const updatedCard = { ...draggedCard, stage: laneId as ChallengeStage | 'Parking Lot' };
                targetLaneCards.splice(clampedIndex, 0, updatedCard);

                return [...otherCards, ...targetLaneCards];
            });
        }
        setDropIndex(0);
    };

    /* ── Priority color helper ── */
    const priorityColor = (p: string) =>
        (p === 'High' || p === 'Critical') ? '#ef5350' : p === 'Medium' ? '#ffa726' : '#66bb6a';

    /* ── Mobile: active lane tab ── */
    const [activeLaneIndex, setActiveLaneIndex] = useState(0);

    const handleNewChallenge = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/challenges/submit');
    };

    return (
        <div className="main-wrapper" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

            {/* ═══ FLOW DIRECTION BANNER ════════════════ */}
            <div className="flow-banner">
                <span>Flow Direction</span>
                <div className="flow-arrow"></div>
            </div>

            {/* ═══ MOBILE LANE TABS (hidden on desktop) ═══ */}
            <div className="mobile-lane-tabs">
                {lanes.map((lane, index) => (
                    <button
                        key={lane.id}
                        className={`mobile-lane-tab ${index === activeLaneIndex ? 'active' : ''}`}
                        style={{
                            '--tab-color': lane.color,
                        } as React.CSSProperties}
                        onClick={() => setActiveLaneIndex(index)}
                    >
                        <span className="mobile-lane-tab-icon">{laneIcons[lane.id]}</span>
                        <span className="mobile-lane-tab-label" dangerouslySetInnerHTML={{ __html: lane.title.replace('<br/>', ' ') }} />
                        <span className="mobile-lane-tab-count" style={{ background: lane.badgeBg, color: lane.color }}>
                            {getCardsByLane(lane.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* ═══ SWIM LANES ══════════════════════════= */}
            <div className="lanes-wrapper" style={{ flex: 1 }}>
                {lanes.map((lane, laneIndex) => {
                    const laneCards = getCardsByLane(lane.id);
                    const isDragOver = dragOverLaneId === lane.id && draggedCardId !== null;

                    return (
                        <div
                            key={lane.id}
                            className={`lane ${lane.laneClass} ${laneIndex === activeLaneIndex ? 'lane-mobile-active' : 'lane-mobile-hidden'}`}
                            onDragOver={handleLaneDragOver}
                            onDragEnter={(e) => handleDragEnter(e, lane.id)}
                            onDragLeave={(e) => handleDragLeave(e, e.currentTarget)}
                            onDrop={(e) => handleDrop(e, lane.id)}
                        >
                            {/* ── Lane Header ── */}
                            <div className="lane-header">
                                <div className="stage-icon" style={{ color: lane.color }}>{laneIcons[lane.id]}</div>
                                <h3 dangerouslySetInnerHTML={{ __html: lane.title }} />
                                <span className="width-tag">{lane.widthLabel}</span>
                            </div>

                            {/* ── Lane Body ── */}
                            <div className={`lane-body ${isDragOver ? 'drag-over' : ''} ${!isLoading ? 'fade-in' : ''}`}>
                                {isLoading ? (
                                    // Show 3 skeletons per lane while loading
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="lane-card-skeleton">
                                            <div className="skeleton lane-card-skeleton-title"></div>
                                            <div className="skeleton lane-card-skeleton-desc"></div>
                                            <div className="skeleton lane-card-skeleton-desc" style={{ width: '60%' }}></div>
                                            <div className="lane-card-skeleton-meta">
                                                <div className="skeleton" style={{ width: '60px', height: '12px' }}></div>
                                                <div className="skeleton" style={{ width: '40px', height: '12px' }}></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    laneCards.map((card, cardIndex) => (
                                        <React.Fragment key={card.id}>
                                            {/* Show placeholder BEFORE this card if dropIndex matches */}
                                            {isDragOver && dropIndex === cardIndex && (
                                                <div className="card drag-preview"></div>
                                            )}
                                            <div
                                                className="card"
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, card.id)}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={(e) => handleCardDragOver(e, lane.id, cardIndex)}
                                                onClick={() => navigate(`/challenges/${card.id}`)}
                                            >
                                                <span className="card-drag-handle">⠿</span>
                                                <div className="card-title">{card.title}</div>
                                                <div className="card-desc">{card.summary || card.description || `Innovation project ${card.id}`}</div>
                                                <div className="card-meta">
                                                    <span className="card-id">
                                                        <span className="card-priority" style={{ background: priorityColor(card.priority) }}></span>
                                                        {`CH-${card.id.replace(/\D/g, '')}`}
                                                    </span>
                                                    <span className="card-owner">{card.owner}</span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))
                                )}

                                {/* Show placeholder at BOTTOM if dropIndex equals total card count */}
                                {isDragOver && dropIndex >= laneCards.length && (
                                    <div className="card drag-preview"></div>
                                )}

                                {/* Empty area to catch dragOver when below all cards */}
                                <div
                                    className="empty-slot"
                                    onDragOver={(e) => handleEmptyAreaDragOver(e, lane.id, laneCards.length)}
                                    onClick={handleNewChallenge}
                                >
                                    {lane.addLabel}
                                </div>
                            </div>

                            {/* ── Lane Footer ── */}
                            <div className="lane-footer">
                                <span className="max-label">{lane.footerLabel}</span>
                                <span className="count-badge" style={{ background: lane.badgeBg, color: lane.color }}>
                                    {laneCards.length}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
