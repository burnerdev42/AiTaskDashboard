import type { Notification } from '../../types/notification';
// import { NotificationType } from '../../enums/notificationEnums';

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'New Challenge: Reduce Churn',
        text: 'Ravi Patel posted a new challenge needing your expertise.',
        time: '2 hrs ago',
        unread: true,
        type: 'challenge',
        link: '/challenges/CH-01'
    },
    {
        id: '2',
        title: 'Idea Approved',
        text: 'Your idea "AI Churn Prediction" has been approved for evaluation.',
        time: '1 day ago',
        unread: false,
        type: 'idea',
        link: '/challenges/CH-01/ideas/IDX-001'
    },
    {
        id: '3',
        title: 'System Maintenance',
        text: 'System will be down for maintenance on Sunday at 2 AM.',
        time: '2 days ago',
        unread: false,
        type: 'status',
        link: '#'
    }
];
