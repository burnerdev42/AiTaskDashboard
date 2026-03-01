import React, { useMemo } from 'react';
import { type Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../services/storage';

interface ChallengeCardProps {
    challenge: Challenge;
}

/* ── Outlined SVG Icons ── */
const SvgIcon: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 14, children }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', flexShrink: 0 }}>
        {children}
    </svg>
);

// Impact Colors
const IMPACT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Critical: { bg: 'rgba(239, 83, 80, .12)', text: '#ef5350', border: 'rgba(239, 83, 80, .25)' },
    High: { bg: 'rgba(255, 167, 38, .12)', text: '#ffa726', border: 'rgba(255, 167, 38, .25)' },
    Medium: { bg: 'rgba(255, 238, 88, .12)', text: '#ffee58', border: 'rgba(255, 238, 88, .25)' },
    Low: { bg: 'rgba(102, 187, 106, .12)', text: '#66bb6a', border: 'rgba(102, 187, 106, .25)' },
};

const getImpactIcon = (impact: string) => {
    const color = impact === 'Critical' ? '#ef5350' : impact === 'High' ? '#ffa726' : impact === 'Medium' ? '#ffee58' : '#66bb6a';
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 4 }} />;
};

// Tags
const StarIcon = () => <SvgIcon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></SvgIcon>;
const MedalIcon = () => <SvgIcon><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" /></SvgIcon>;
const TrophyIcon = () => <SvgIcon size={13}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></SvgIcon>;

/* ── Swim-Lane Stage Icons — exactly matching SwimLanes.tsx ── */
const stageConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    'Challenge Submitted': {
        color: 'var(--accent-red)',
        icon: <SvgIcon size={11}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></SvgIcon>,
    },
    'Ideation & Evaluation': {
        color: 'var(--accent-yellow)',
        icon: <SvgIcon size={11}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></SvgIcon>,
    },
    'POC & Pilot': {
        color: 'var(--accent-blue)',
        icon: <SvgIcon size={11}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></SvgIcon>,
    },
    'Scaled & Deployed': {
        color: 'var(--accent-green)',
        icon: <SvgIcon size={11}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></SvgIcon>,
    },
    'Parking Lot': {
        color: 'var(--accent-grey)',
        icon: <SvgIcon size={11}><circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></SvgIcon>,
    },
};

/* ── Outlined SVG stat icons replacing emojis ── */
const STAT_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    ideas: {
        color: '#ffca28',
        label: 'Ideas',
        icon: <SvgIcon size={15}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z" /></SvgIcon>,
    },
    votes: {
        color: '#ffa726',
        label: 'Votes',
        icon: <SvgIcon size={15}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></SvgIcon>,
    },
    views: {
        color: '#42a5f5',
        label: 'Views',
        icon: <SvgIcon size={15}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></SvgIcon>,
    },
    members: {
        color: '#66bb6a',
        label: 'Contributors',
        icon: <SvgIcon size={15}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></SvgIcon>,
    },
    comments: {
        color: '#8884d8',
        label: 'Comments',
        icon: <SvgIcon size={15}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></SvgIcon>,
    },
};

const REQUIRED_STATS = ['ideas', 'votes', 'views', 'members', 'comments'];

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    const navigate = useNavigate();

    // Calculate actual metrics from storage
    const actualStats = useMemo(() => {
        const details = storage.getChallengeDetails().find(d => d.id === challenge.id);
        const ideas = details?.ideas || [];

        // Members count: Unique authors who submitted an idea + the challenge owner
        const uniqueMembers = new Set<string>();
        uniqueMembers.add(challenge.owner.name);
        ideas.forEach((i: any) => {
            if (i.author) uniqueMembers.add(i.author);
        });

        // Sum up other metrics across all ideas
        const totalVotes = ideas.reduce((sum: number, idea: any) => sum + Number(idea.appreciations || 0), 0);
        const totalComments = ideas.reduce((sum: number, idea: any) => sum + Number(idea.comments || 0), 0);
        const totalViews = ideas.reduce((sum: number, idea: any) => sum + Number(idea.views || 0), 0) + Number(challenge.stats?.views || 0);

        return {
            ideas: ideas.length,
            votes: totalVotes,
            views: totalViews,
            members: uniqueMembers.size,
            comments: totalComments
        };
    }, [challenge.id, challenge.owner.name, challenge.stats?.views]);

    const displayStats = REQUIRED_STATS.map(key => {
        const config = STAT_CONFIG[key];
        const value = actualStats[key as keyof typeof actualStats] ?? 0;
        return { key, value, ...config };
    });

    const stage = stageConfig[challenge.stage] ?? { color: 'var(--text-muted)', icon: null };

    return (
        <div
            className="challenge-card"
            data-accent={challenge.accentColor}
            onClick={() => navigate(`/challenges/${challenge.id?.toLowerCase()}`)}
        >
            <div className="challenge-top">
                <div className="challenge-top-info">
                    <div className="challenge-badge-row">
                        {challenge.tags?.filter(tag => ['Highlighted', 'Most Appreciated', 'Top Voted'].includes(tag)).map(tag => (
                            <span key={tag} className={`challenge-badge ${tag === 'Highlighted' ? 'highlighted' : tag === 'Most Appreciated' ? 'appreciated' : 'top-voted'}`}>
                                {tag === 'Highlighted' && <StarIcon />}
                                {tag === 'Most Appreciated' && <MedalIcon />}
                                {tag === 'Top Voted' && <TrophyIcon />}
                                {' ' + tag}
                            </span>
                        ))}
                        <span
                            className="challenge-stage-badge"
                            data-stage={challenge.stage.toLowerCase()}
                            style={{ color: stage.color, borderColor: `${stage.color}44`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                            {stage.icon}
                            {challenge.stage}
                        </span>
                        {challenge.impact && (
                            <span
                                className="challenge-impact-badge"
                                style={{
                                    background: (IMPACT_COLORS[challenge.impact] || IMPACT_COLORS.Low).bg,
                                    color: (IMPACT_COLORS[challenge.impact] || IMPACT_COLORS.Low).text,
                                    borderColor: (IMPACT_COLORS[challenge.impact] || IMPACT_COLORS.Low).border,
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                }}
                            >
                                {getImpactIcon(challenge.impact)}
                                {challenge.impact} Impact
                            </span>
                        )}
                    </div>
                    <h3>{challenge.title}</h3>
                    <p className="challenge-desc">{challenge.summary}</p>
                    {challenge.tags && challenge.tags.length > 0 && (
                        <div className="challenge-detail-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', marginBottom: '16px' }}>
                            {challenge.tags.filter(tag => !['Highlighted', 'Most Appreciated', 'Top Voted', 'Pilot'].includes(tag)).map(tag => (
                                <span key={tag} className="tag-pill" style={{
                                    background: 'rgba(255, 193, 7, 0.1)', // Subtle golden background
                                    color: 'var(--accent-gold)',
                                    padding: '5px 12px',
                                    borderRadius: '100px',
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    border: '1px solid rgba(255, 193, 7, 0.3)'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="challenge-owner">
                        <span className="owner-avatar" style={{ background: challenge.owner.avatarColor }}>{challenge.owner.avatar}</span>
                        <span>{challenge.owner.name} &middot; {`CH-${challenge.id.replace(/\D/g, '')}`}</span>
                    </div>
                </div>
            </div>
            <div className="challenge-right">
                {displayStats.map((stat) => (
                    <div className="challenge-stat" key={stat.key}>
                        <div
                            className="stat-icon"
                            style={{
                                background: `${stat.color}26`,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
