import React from 'react';
import { type Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
    challenge: Challenge;
}

// Helper config for stats display (Standardized set as per user request)
const STAT_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    ideas: { icon: '💡', label: 'Ideas', color: '#ffca28' }, // yellow/gold
    votes: { icon: '🗳️', label: 'Votes', color: '#ffa726' }, // orange
    views: { icon: '👁️', label: 'Views', color: '#42a5f5' }, // blue
    members: { icon: '👥', label: 'Members', color: '#66bb6a' }, // green
    comments: { icon: '💬', label: 'Comments', color: '#8884d8' } // purple-ish
};

const REQUIRED_STATS = ['ideas', 'votes', 'views', 'members', 'comments'];

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
    const navigate = useNavigate();

    // Enforce the specific 5 KPIs for every card
    const displayStats = REQUIRED_STATS.map(key => {
        const config = STAT_CONFIG[key];
        const value = challenge.stats[key] ?? 0;
        return { key, value, ...config };
    });

    return (
        <div
            className="challenge-card"
            data-accent={challenge.accentColor}
            onClick={() => navigate(`/challenges/${challenge.id}`)}
        >
            <div className="challenge-top">
                {/* Icon removed as per user request */}
                <div className="challenge-top-info">
                    <div className="challenge-badge-row">
                        {challenge.tags?.filter(tag => tag !== 'Pilot').slice(0, 1).map(tag => (
                            <span key={tag} className={`challenge-badge ${tag === 'Highlighted' ? 'highlighted' : tag === 'Most Appreciated' ? 'appreciated' : 'top-voted'}`}>
                                {tag === 'Highlighted' && '⭐'}
                                {tag === 'Most Appreciated' && '🏅'}
                                {tag === 'Top Voted' && '🏆'}
                                {' ' + tag}
                            </span>
                        ))}
                        <span className="challenge-stage-badge" data-stage={challenge.stage.toLowerCase()}>
                            {challenge.stage.includes('Scale') && '📈'}
                            {challenge.stage.includes('Pilot') && '🚀'}
                            {challenge.stage.includes('Evaluation') && '🔧'}
                            {challenge.stage.includes('Submitted') && '💡'}
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
