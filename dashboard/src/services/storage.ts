import { type Idea, type ChallengeDetailData, type Challenge, type ChallengeStage, type Notification, type SwimLaneCard, type User } from '../types';
import { MOCK_CHALLENGES, MOCK_NOTIFICATIONS, MOCK_SWIMLANES, MOCK_USERS } from './mockData';
import { challengeDetails as MOCK_CHALLENGE_DETAILS, ideaDetails as MOCK_IDEA_DETAILS } from '../data/challengeData';

const STORAGE_KEYS = {
    USERS: 'app_users_v2',
    CHALLENGES: 'app_challenges_v2',
    NOTIFICATIONS: 'app_notifications_v2',
    SWIMLANES: 'app_swimlanes_v2',
    CURRENT_USER: 'app_current_user_v2',
    CHALLENGE_DETAILS: 'app_challenge_details_v2',
    IDEA_DETAILS: 'app_idea_details_v2'
};

export const storage = {
    initialize: () => {
        try {
            if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
            }

            // Always refresh volatile data to pick up latest mock data structure changes
            localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
            localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(MOCK_SWIMLANES));

            if (MOCK_CHALLENGE_DETAILS && MOCK_CHALLENGE_DETAILS.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(MOCK_CHALLENGE_DETAILS));
            }
            if (MOCK_IDEA_DETAILS && MOCK_IDEA_DETAILS.length > 0) {
                localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(MOCK_IDEA_DETAILS));
            }
        } catch (e) {
            console.error('Failed to initialize storage:', e);
        }
    },

    getUsers: (): User[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USERS);
            return data ? JSON.parse(data) : MOCK_USERS;
        } catch {
            return MOCK_USERS;
        }
    },

    getChallenges: (): Challenge[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
            return data ? JSON.parse(data) : MOCK_CHALLENGES;
        } catch {
            return MOCK_CHALLENGES;
        }
    },

    getChallengeDetails: (): ChallengeDetailData[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CHALLENGE_DETAILS);
            return data && data !== 'undefined' ? JSON.parse(data) : MOCK_CHALLENGE_DETAILS;
        } catch {
            return MOCK_CHALLENGE_DETAILS;
        }
    },

    getIdeaDetails: (): Idea[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.IDEA_DETAILS);
            return data && data !== 'undefined' ? JSON.parse(data) : MOCK_IDEA_DETAILS;
        } catch {
            return MOCK_IDEA_DETAILS;
        }
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

    updateUser: (updatedUser: User) => {
        const users = storage.getUsers();
        const index = users.findIndex(u => u.email === updatedUser.email);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            // Also update current user if it matches
            const currentUser = storage.getCurrentUser();
            if (currentUser && currentUser.email === updatedUser.email) {
                storage.setCurrentUser(users[index]);
            }
            return true;
        }
        return false;
    },

    updateChallenge: (challenge: Challenge) => {
        const challenges = storage.getChallenges();
        const index = challenges.findIndex(c => c.id === challenge.id);
        if (index !== -1) {
            challenges[index] = challenge;
            localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
        }
    },

    updateChallengeDetail: (challengeDetail: ChallengeDetailData) => {
        const details = storage.getChallengeDetails();
        const index = details.findIndex(d => d.id === challengeDetail.id);
        if (index !== -1) {
            details[index] = challengeDetail;
            localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(details));
        }
    },

    updateIdea: (idea: Idea) => {
        const ideas = storage.getIdeaDetails();
        const index = ideas.findIndex(i => i.id === idea.id);
        if (index !== -1) {
            ideas[index] = idea;
            localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(ideas));
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
    },

    deleteChallenge: (id: string) => {
        const challenges = storage.getChallenges();
        const updatedChallenges = challenges.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(updatedChallenges));

        const swimlanes = storage.getSwimLanes();
        const updatedSwimlanes = swimlanes.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(updatedSwimlanes));

        const details = storage.getChallengeDetails();
        const updatedDetails = details.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(updatedDetails));
    },

    deleteIdea: (challengeId: string, ideaId: string) => {
        const ideas = storage.getIdeaDetails();
        const updatedIdeas = ideas.filter(i => i.id !== ideaId);
        localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(updatedIdeas));

        const challengeDetails = storage.getChallengeDetails();
        const challengeIndex = challengeDetails.findIndex(c => c.id === challengeId);
        if (challengeIndex !== -1) {
            challengeDetails[challengeIndex].ideas = challengeDetails[challengeIndex].ideas.filter(
                (i: any) => i.id !== ideaId
            );
            localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(challengeDetails));
        }
    }
};
