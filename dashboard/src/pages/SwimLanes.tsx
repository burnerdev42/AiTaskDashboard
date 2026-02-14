import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { type SwimLaneCard, type ChallengeStage } from '../types';

export const SwimLanes: React.FC = () => {
    const [cards, setCards] = useState<SwimLaneCard[]>([]);
    const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
    const [dragOverLaneId, setDragOverLaneId] = useState<string | null>(null);
    const [dropIndex, setDropIndex] = useState<number>(0);
    const navigate = useNavigate();
    const draggedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCards(storage.getSwimLanes());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    /* ── Lane Definitions (matching swim-lane.html) ── */
    const lanes: {
        id: ChallengeStage | 'Parking Lot';
        title: string;
        icon: string;
        max: number;
        widthClass: 'w-sm' | 'w-md';
        color: string;
        laneClass: string;
        widthLabel: string;
        addLabel: string;
        footerLabel: string;
        badgeBg: string;
    }[] = [
            { id: 'Ideation', title: 'Challenge<br/>Submitted', icon: '🔴', max: 6, widthClass: 'w-sm', color: 'var(--accent-red)', laneClass: 'challenge', widthLabel: 'New problems & opportunities', addLabel: '+ Add Challenge', footerLabel: 'Challenges submitted', badgeBg: 'rgba(239,83,80,.15)' },
            { id: 'Prototype', title: 'Ideation &<br/>Evaluation', icon: '🟡', max: 15, widthClass: 'w-md', color: 'var(--accent-yellow)', laneClass: 'ideation-evaluation', widthLabel: 'Brainstorm & feasibility', addLabel: '+ Add Idea/Evaluation', footerLabel: 'Ideas available', badgeBg: 'rgba(255,238,88,.12)' },
            { id: 'Pilot', title: 'POC &<br/>Pilot', icon: '🔵', max: 8, widthClass: 'w-md', color: 'var(--accent-blue)', laneClass: 'poc-pilot', widthLabel: 'Build & validate prototypes', addLabel: '+ Add POC/Pilot', footerLabel: 'Prototypes running', badgeBg: 'rgba(240,184,112,.15)' },
            { id: 'Scale', title: 'Deployed', icon: '⭐', max: 8, widthClass: 'w-md', color: 'var(--accent-gold)', laneClass: 'deployed', widthLabel: 'Live in production', addLabel: '+ Add Deployment', footerLabel: 'In production', badgeBg: 'rgba(255,213,79,.12)' },
            { id: 'Parking Lot', title: 'Parking<br/>Lot', icon: '⚪', max: 8, widthClass: 'w-sm', color: 'var(--accent-grey)', laneClass: 'parking', widthLabel: 'Paused or deferred items', addLabel: '+ Park Item', footerLabel: 'Items parked', badgeBg: 'rgba(120,144,156,.15)' },
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
        p === 'High' ? 'var(--accent-red)' : p === 'Medium' ? 'var(--accent-orange)' : 'var(--accent-green)';

    /* ── Mobile: active lane tab ── */
    const [activeLaneIndex, setActiveLaneIndex] = useState(0);

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
                        <span className="mobile-lane-tab-icon">{lane.icon}</span>
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
                            className={`lane ${lane.laneClass} ${lane.widthClass} ${laneIndex === activeLaneIndex ? 'lane-mobile-active' : 'lane-mobile-hidden'}`}
                            onDragOver={handleLaneDragOver}
                            onDragEnter={(e) => handleDragEnter(e, lane.id)}
                            onDragLeave={(e) => handleDragLeave(e, e.currentTarget)}
                            onDrop={(e) => handleDrop(e, lane.id)}
                        >
                            {/* ── Lane Header ── */}
                            <div className="lane-header">
                                <div className="stage-icon" style={{ background: lane.color }}>{lane.icon}</div>
                                <h3 dangerouslySetInnerHTML={{ __html: lane.title }} />
                                <span className="width-tag">{lane.widthLabel}</span>
                            </div>

                            {/* ── Lane Body ── */}
                            <div className={`lane-body ${isDragOver ? 'drag-over' : ''}`}>
                                {laneCards.map((card, cardIndex) => (
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
                                            onClick={() => navigate('/challenges/1')}
                                        >
                                            <span className="card-drag-handle">⠿</span>
                                            <div className="card-title">{card.title}</div>
                                            <div className="card-desc">{card.description || `Innovation project ${card.id}`}</div>
                                            <div className="card-meta">
                                                <span className="card-id">
                                                    <span className="card-priority" style={{ background: priorityColor(card.priority) }}></span>
                                                    {card.id.toUpperCase()}
                                                </span>
                                                <span className="card-owner">{card.owner}</span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}

                                {/* Show placeholder at BOTTOM if dropIndex equals total card count */}
                                {isDragOver && dropIndex >= laneCards.length && (
                                    <div className="card drag-preview"></div>
                                )}

                                {/* Empty area to catch dragOver when below all cards */}
                                <div
                                    className="empty-slot"
                                    onDragOver={(e) => handleEmptyAreaDragOver(e, lane.id, laneCards.length)}
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
