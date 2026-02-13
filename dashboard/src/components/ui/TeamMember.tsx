import React from 'react';

interface TeamMemberProps {
    avatar: string;
    name: string;
    role: string;
    bio: string;
    stats: Record<string, string | number>;
    color: string;
}

export const TeamMember: React.FC<TeamMemberProps> = ({ avatar, name, role, bio, stats, color }) => (
    <div className="team-card">
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
