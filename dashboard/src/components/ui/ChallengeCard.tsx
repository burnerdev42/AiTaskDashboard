import React from 'react';
import { type Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
    challenge: Challenge;
}

// Helper config for stats display
const STAT_CONFIG: Record<string, { icon: string; label: string; colorVar: string; color: string }> = {
    appreciations: { icon: '👍', label: 'Appreciations', colorVar: '--accent-green', color: '#66bb6a' },
    votes: { icon: '🏆', label: 'Votes', colorVar: '--accent-orange', color: '#ffa726' },
    comments: { icon: '💬', label: 'Comments', colorVar: '--accent-blue', color: '#f0b870' }, // using header blue-ish gold or standard blue
    savings: { icon: '💡', label: 'Savings', colorVar: '--accent-purple', color: '#ab47bc' },
    roi: { icon: '📈', label: 'ROI', colorVar: '--accent-teal', color: '#e8a758' },
    members: { icon: '👥', label: 'Members', colorVar: '--accent-blue', color: '#42a5f5' },
    accuracy: { icon: '🎯', label: 'Accuracy', colorVar: '--accent-pink', color: '#ec407a' }, // pink/red
    active: { icon: '⚡', label: 'Active', colorVar: '--accent-yellow', color: '#ffee58' },
    alerts: { icon: '🔔', label: 'Alerts', colorVar: '--accent-red', color: '#ef5350' },
    units: { icon: '📦', label: 'Units', colorVar: '--accent-teal', color: '#26a69a' },
    methods: { icon: '🔬', label: 'Methods', colorVar: '--accent-gold', color: '#ffd54f' }
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    const navigate = useNavigate();

    // Get first 5 stats to display
    const displayStats = Object.entries(challenge.stats).slice(0, 5).map(([key, value]) => {
        const config = STAT_CONFIG[key] || { icon: '🔹', label: key, colorVar: '--text-secondary', color: '#b0bec5' };
        return { key, value, ...config };
    });

    return (
        <div
            className="challenge-card"
            data-accent={challenge.accentColor}
            onClick={() => navigate(`/challenges/${challenge.id}`)}
        >
            <div className="challenge-top">
                <div className="challenge-icon">
                    {/* Mapping icons based on title or type for now, as they aren't in the data model explicitly yet */}
                    {challenge.title.includes('Customer') ? '✅' :
                        challenge.title.includes('Bot') ? '🤖' :
                            challenge.title.includes('Warehouse') ? '📦' :
                                challenge.title.includes('Forecasting') ? '🧠' : '📱'}
                </div>
                <div className="challenge-top-info">
                    <div className="challenge-badge-row">
                        {challenge.tags?.map(tag => (
                            <span key={tag} className={`challenge-badge ${tag === 'Highlighted' ? 'highlighted' : tag === 'Most Appreciated' ? 'appreciated' : 'top-voted'}`}>
                                {tag === 'Highlighted' && '⭐'}
                                {tag === 'Most Appreciated' && '🏅'}
                                {tag === 'Top Voted' && '🏆'}
                                {' ' + tag}
                            </span>
                        ))}
                        <span className="challenge-stage-badge">
                            {challenge.stage === 'Scale' && '📈'}
                            {challenge.stage === 'Pilot' && '🚀'}
                            {challenge.stage === 'Prototype' && '🔧'}
                            {challenge.stage === 'Ideation' && '💡'}
                            {' ' + challenge.stage}
                        </span>
                    </div>
                    <h3>{challenge.title}</h3>
                    <p className="challenge-desc">{challenge.description}</p>
                    <div className="challenge-owner">
                        <span className="owner-avatar" style={{ background: challenge.owner.avatarColor }}>{challenge.owner.avatar}</span>
                        <span>{challenge.owner.name} &middot; {challenge.id}</span>
                    </div>
                </div>
            </div>
            <div className="challenge-right">
                {displayStats.map((stat) => (
                    <div className="challenge-stat" key={stat.key}>
                        <div
                            className="stat-icon"
                            style={{
                                background: `${stat.color}26`, // 15% opacity (hex 26)
                                color: stat.color
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
