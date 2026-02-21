import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamMemberProps {
    avatar: string;
    name: string;
    role: string;
    bio: string;
    stats: Record<string, string | number>;
    color: string;
}

export const TeamMember: React.FC<TeamMemberProps> = ({ avatar, name, role, bio, stats, color }) => {
    const navigate = useNavigate();

    return (
        <div className="team-card" onClick={() => navigate('/profile', { state: { name, role, avatar, bio, stats, color } })} style={{ cursor: 'pointer' }}>
            <div className="team-avatar" style={{ background: `var(--accent-${color})` }}>{avatar}</div>
            <h4>{name}</h4>
            <div className="team-role">{role}</div>
            <p className="team-bio">{bio}</p>
            <div className="team-stats">
                {Object.entries(stats).map(([k, v]) => (
                    <div className="team-stat-item" key={k}>
                        <div className="ts-value" style={{ color: `var(--accent-${color})` }}>{v}</div>
                        <div className="ts-label">{k}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
