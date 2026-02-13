import type { ChallengeDetailData, ChallengeCardData } from '../../types/challenge';

export const MOCK_CHALLENGE_DETAILS: ChallengeDetailData[] = [
    {
        id: 'CH-01',
        title: 'Reduce Customer Churn by 15%',
        description: 'High-value segment losing 8% QoQ due to poor onboarding experience. Need to identify root causes and implement retention strategies.',
        stage: 'Ideation',
        owner: { name: 'Ravi Patel', avatar: 'RP', avatarColor: 'var(--accent-teal)' },
        accentColor: 'teal',
        stats: { appreciations: 42, comments: 8, votes: 42 },
        tags: ['Highlighted'],
        problemStatement: `Our premium customer segment (lifetime value >$10K) is experiencing an alarming 8% quarter-over-quarter churn rate. Exit interviews indicate that 63% of departing customers cite frustration with the onboarding process. Competitors are offering smoother digital experiences, and we're losing market share as a result.

Key pain points identified:
• Onboarding takes 14+ days vs industry average of 3-5 days
• Complex KYC process with multiple document submissions
• Lack of real-time progress tracking
• Minimal product education during initial weeks`,
        expectedOutcome: `Reduce customer churn from 8% to below 3% within 6 months by implementing an improved onboarding experience.

Success metrics:
• Onboarding completion time reduced to 5 days or less
• Customer satisfaction score (CSAT) for onboarding >4.5/5
• First-month product activation rate >80%
• Reduce churn in first 90 days by 50%`,
        businessUnit: 'Customer Experience',
        department: 'Customer Success',
        priority: 'High',
        estimatedImpact: '$2M annual revenue retention',
        challengeTags: ['Customer Experience', 'Retention', 'Onboarding', 'Digital Transformation'],
        ideas: [
            { id: 'IDX-001', title: 'AI Churn Prediction Model', author: 'S. Banerjee', status: 'Ideation', appreciations: 24, comments: 7, views: 156 }, // Ideas in challenge detail often simple objects, leaving strings for now if not using full Idea type
            { id: 'IDX-002', title: 'Gamified Onboarding Flow', author: 'M. Singh', status: 'Ideation', appreciations: 18, comments: 5, views: 132 },
            { id: 'IDX-003', title: 'Personalized Tutorial System', author: 'A. Basu', status: 'Evaluation', appreciations: 31, comments: 12, views: 203 },
            { id: 'IDX-004', title: 'Retention Offer Engine', author: 'R. Sharma', status: 'Evaluation', appreciations: 27, comments: 9, views: 178 },
            { id: 'IDX-005', title: 'Customer Health Dashboard', author: 'P. Kumar', status: 'POC', appreciations: 22, comments: 6, views: 145 },
            { id: 'IDX-006', title: 'Smart Segmentation AI', author: 'N. Reddy', status: 'Ideation', appreciations: 15, comments: 4, views: 98 },
            { id: 'IDX-007', title: 'Automated Account Alerts', author: 'V. Gupta', status: 'Ideation', appreciations: 19, comments: 3, views: 112 },
            { id: 'IDX-008', title: 'Customer Journey Analytics', author: 'D. Mehta', status: 'Evaluation', appreciations: 29, comments: 11, views: 187 },
        ],
        team: [
            { name: 'Ravi Patel', avatar: 'RP', avatarColor: 'var(--accent-teal)', role: 'Owner' },
            { name: 'Sarita Banerjee', avatar: 'SB', avatarColor: 'var(--accent-blue)', role: 'Contributor' },
            { name: 'Amit Basu', avatar: 'AB', avatarColor: 'var(--accent-green)', role: 'Contributor' },
        ],
        activity: [
            { author: 'Ravi Patel', avatar: 'RP', avatarColor: 'var(--accent-teal)', text: 'Created this challenge. Looking for innovative solutions to address our onboarding friction points.', time: '2 days ago' },
            { author: 'Sarita Banerjee', avatar: 'SB', avatarColor: 'var(--accent-blue)', text: "I've been researching ML-based churn prediction models. We could identify at-risk customers earlier in their journey. Would love to collaborate on this!", time: '1 day ago' },
            { author: 'Amit Basu', avatar: 'AB', avatarColor: 'var(--accent-green)', text: 'Have we looked at gamification for the onboarding process? Interactive tutorials with milestone rewards could significantly improve engagement.', time: '5 hours ago' },
        ],
        createdDate: 'Jan 15, 2026',
        updatedDate: 'Feb 10, 2026',
    },
];

export const MOCK_CHALLENGE_CARDS: ChallengeCardData[] = [
    {
        id: 'CH-01', challengeNumber: 'CH-01',
        title: 'Reduce Customer Churn by 15%',
        description: 'High-value segment losing 8% QoQ due to poor onboarding. Need to identify root causes and implement retention strategies.',
        stage: 'Ideation', impact: 'Critical', ideasCount: 8,
        effort: '12 weeks', value: '€2M/year',
        owner: { name: 'Ravi Patel', initial: 'RP', color: 'var(--accent-teal)' },
        team: [{ name: 'Ravi', initial: 'R', color: 'var(--accent-teal)' }, { name: 'Sarita', initial: 'S', color: 'var(--accent-blue)' }, { name: 'Amit', initial: 'A', color: 'var(--accent-green)' }],
    },
    // ... Additional cards can be added here
];
