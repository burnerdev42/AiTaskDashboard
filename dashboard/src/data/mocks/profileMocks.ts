import type { UserProfileData } from '../../types/user';

export const MOCK_USER_PROFILE: UserProfileData = {
    stats: {
        challenges: 12,
        ideas: 24,
        inPilot: 3,
        valueImpact: '$1.2M'
    },
    contributions: [4, 2, 5, 8, 1, 0, 3, 6, 2, 5, 7, 4], // Monthly activity
    submissions: [
        {
            id: 'CX-improvement',
            title: 'Customer Experience Revamp',
            type: 'Challenge',
            status: 'Active',
            date: '2023-11-15',
            link: '/challenges/CH-01'
        },
        {
            id: 'AI-chatbot',
            title: 'AI Customer Service Bot',
            type: 'Idea',
            status: 'In Pilot',
            date: '2023-11-20',
            link: '/challenges/CH-01/ideas/IDX-001'
        }
    ],
    activities: [
        {
            type: 'comment',
            text: 'Commented on <strong>Supply Chain Optimization</strong>',
            time: '2 hours ago'
        },
        {
            type: 'idea',
            text: 'Submitted new idea <strong>Warehouse Automation</strong>',
            time: '1 day ago'
        },
        {
            type: 'challenge',
            text: 'Created challenge <strong>Reduce Logistics Costs</strong>',
            time: '3 days ago'
        }
    ]
};
