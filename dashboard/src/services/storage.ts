import { type Challenge, type ChallengeStage, type Notification, type SwimLaneCard, type User } from '../types';
import { MOCK_CHALLENGES, MOCK_NOTIFICATIONS, MOCK_SWIMLANES, MOCK_USERS } from './mockData';

const STORAGE_KEYS = {
    USERS: 'app_users_v2',
    CHALLENGES: 'app_challenges_v2',
    NOTIFICATIONS: 'app_notifications_v2',
    SWIMLANES: 'app_swimlanes_v2',
    CURRENT_USER: 'app_current_user_v2'
};

export const storage = {
    initialize: () => {
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
        }

        // Always refresh volatile data to pick up latest mock data structure changes
        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
        localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(MOCK_SWIMLANES));
    },

    getUsers: (): User[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    getChallenges: (): Challenge[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHALLENGES) || '[]');
    },

    getSwimLanes: (): SwimLaneCard[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SWIMLANES) || '[]');
    },

    getNotifications: (): Notification[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    },

    getCurrentUser: (): User | null => {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    setCurrentUser: (user: User | null) => {
        if (user) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    },

    addUser: (user: User) => {
        const users = storage.getUsers();
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    updateChallenge: (challenge: Challenge) => {
        const challenges = storage.getChallenges();
        const index = challenges.findIndex(c => c.id === challenge.id);
        if (index !== -1) {
            challenges[index] = challenge;
            localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
        }
    },

    updateSwimLaneCardStage: (cardId: string, newStage: string) => {
        const cards = storage.getSwimLanes();
        const index = cards.findIndex(c => c.id === cardId);
        if (index !== -1) {
            cards[index].stage = newStage as ChallengeStage | 'Parking Lot';
            localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(cards));
            return true;
        }
        return false;
    },

    markNotificationRead: (id: string) => {
        const notifications = storage.getNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].unread = false;
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        }
    },

    markAllNotificationsRead: () => {
        const notifications = storage.getNotifications();
        notifications.forEach(n => n.unread = false);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    },

    deleteNotification: (id: string) => {
        const notifications = storage.getNotifications();
        const updatedNotifications = notifications.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
    }
};
