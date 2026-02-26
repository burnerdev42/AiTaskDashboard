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
    IDEA_DETAILS: 'app_idea_details_v2',
    PENDING_REGISTRATIONS: 'ip_pending_registrations',
    REJECTED_REGISTRATIONS: 'ip_rejected_registrations',
    ADMIN_LOGS: 'app_admin_logs_v2'
};

export const storage = {
    initialize: () => {
        try {
            // Migration: Replace legacy CHG- IDs with standard CH- IDs across all storage items
            [
                STORAGE_KEYS.CHALLENGES,
                STORAGE_KEYS.CHALLENGE_DETAILS,
                STORAGE_KEYS.IDEA_DETAILS,
                STORAGE_KEYS.SWIMLANES,
                STORAGE_KEYS.NOTIFICATIONS
            ].forEach(key => {
                const data = localStorage.getItem(key);
                if (data && data.includes('CHG-')) {
                    localStorage.setItem(key, data.replace(/CHG-/g, 'CH-'));
                }
            });

            const existingUsersJson = localStorage.getItem(STORAGE_KEYS.USERS);
            if (!existingUsersJson) {
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
            } else {
                // Ensure new mock users (like admin@ananta.tcs.com) are added even if storage already exists
                const existingUsers: User[] = JSON.parse(existingUsersJson);
                let updated = false;
                MOCK_USERS.forEach(mockUser => {
                    if (!existingUsers.find(u => u.email.toLowerCase() === mockUser.email.toLowerCase())) {
                        existingUsers.push(mockUser);
                        updated = true;
                    }
                });
                if (updated) {
                    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers));
                }
            }

            if (!localStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
            }

            if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
                localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
            }

            if (!localStorage.getItem(STORAGE_KEYS.SWIMLANES)) {
                localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(MOCK_SWIMLANES));
            }

            if (!localStorage.getItem(STORAGE_KEYS.CHALLENGE_DETAILS) && MOCK_CHALLENGE_DETAILS && MOCK_CHALLENGE_DETAILS.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(MOCK_CHALLENGE_DETAILS));
            }

            if (!localStorage.getItem(STORAGE_KEYS.IDEA_DETAILS) && MOCK_IDEA_DETAILS && MOCK_IDEA_DETAILS.length > 0) {
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
        const challenges = storage.getChallenges();
        return challenges.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            owner: c.owner.name,
            priority: (c.impact === 'Critical' ? 'High' : c.impact || 'Medium') as 'High' | 'Medium' | 'Low',
            stage: c.stage as SwimLaneCard['stage'],
            type: 'standard' as const,
        }));
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

    deleteUser: (email: string) => {
        const users = storage.getUsers();
        const updatedUsers = users.filter(u => u.email !== email);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

        const currentUser = storage.getCurrentUser();
        if (currentUser && currentUser.email === email) {
            storage.setCurrentUser(null);
        }
        return true;
    },

    getPendingRegistrations: (): any[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATIONS);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    getRejectedRegistrations: (): any[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.REJECTED_REGISTRATIONS);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    addPendingRegistration: (data: any) => {
        const pending = storage.getPendingRegistrations();
        if (!pending.find(p => p.email.toLowerCase() === data.email.toLowerCase())) {
            pending.push(data);
            localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pending));
            return true;
        }
        return false;
    },

    isEmailPending: (email: string): boolean => {
        const pending = storage.getPendingRegistrations();
        return pending.some(p => p.email.toLowerCase() === email.toLowerCase());
    },

    approveRegistration: (email: string) => {
        const pending = storage.getPendingRegistrations();
        const userToApprove = pending.find(p => p.email.toLowerCase() === email.toLowerCase());

        if (userToApprove) {
            // 1. Remove from pending
            const updatedPending = pending.filter(p => p.email.toLowerCase() !== email.toLowerCase());
            localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(updatedPending));

            // 2. Add to active users
            const users = storage.getUsers();
            const newUser: User = {
                ...userToApprove,
                status: 'active',
                id: userToApprove.id || Date.now().toString()
            };
            users.push(newUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    rejectRegistration: (email: string) => {
        const pending = storage.getPendingRegistrations();
        const rejectedReg = pending.find(r => r.email.toLowerCase() === email.toLowerCase());
        const updatedPending = pending.filter(p => p.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(updatedPending));

        if (rejectedReg) {
            const rejected = storage.getRejectedRegistrations();
            rejected.push({ ...rejectedReg, rejectedAt: new Date().toISOString() });
            localStorage.setItem(STORAGE_KEYS.REJECTED_REGISTRATIONS, JSON.stringify(rejected));
        }
        return true;
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
        const challenges = storage.getChallenges();
        const index = challenges.findIndex(c => c.id === cardId);
        if (index !== -1) {
            challenges[index].stage = newStage as ChallengeStage;
            localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
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

        // Cascade delete: remove all ideas linked to this challenge
        const details = storage.getChallengeDetails();
        const challengeDetail = details.find(d => d.id === id);
        if (challengeDetail && challengeDetail.ideas && challengeDetail.ideas.length > 0) {
            const ideaIds = challengeDetail.ideas.map((i: any) => i.id);
            const allIdeas = storage.getIdeaDetails();
            const updatedIdeas = allIdeas.filter(i => !ideaIds.includes(i.id));
            localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(updatedIdeas));
        }

        const updatedDetails = details.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(updatedDetails));
    },

    deleteIdea: (challengeId: string, ideaId: string) => {
        const ideas = storage.getIdeaDetails();
        const updatedIdeas = ideas.filter(i => i.id !== ideaId);
        localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(updatedIdeas));

        // Also remove from swim lanes if it exists there
        const swimlanes = storage.getSwimLanes();
        const updatedSwimlanes = swimlanes.filter(s => s.id !== ideaId);
        localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(updatedSwimlanes));

        const challengeDetails = storage.getChallengeDetails();
        const challengeIndex = challengeDetails.findIndex(c => c.id === challengeId);
        if (challengeIndex !== -1) {
            challengeDetails[challengeIndex].ideas = challengeDetails[challengeIndex].ideas.filter(
                (i: any) => i.id !== ideaId
            );
            localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(challengeDetails));
        }
    },

    addIdea: (challengeId: string, idea: Idea) => {
        // Update Idea Details (for global idea list / detail view)
        const ideas = storage.getIdeaDetails();
        ideas.push(idea);
        localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(ideas));

        // Update specific challenge's idea list
        const challengeDetails = storage.getChallengeDetails();
        const challengeIndex = challengeDetails.findIndex(c => c.id === challengeId);

        const summaryIdea = {
            id: idea.id,
            title: idea.title,
            author: idea.owner.name,
            status: idea.status,
            appreciations: idea.stats.appreciations,
            comments: idea.stats.comments,
            views: idea.stats.views
        };

        if (challengeIndex !== -1) {
            if (!challengeDetails[challengeIndex].ideas) {
                challengeDetails[challengeIndex].ideas = [];
            }
            challengeDetails[challengeIndex].ideas.push(summaryIdea);
            localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(challengeDetails));
        } else {
            // Handle dynamically constructed challenges that aren't in detailed storage yet
            const basicChallenges = storage.getChallenges();
            const basicIndex = basicChallenges.findIndex(c => c.id === challengeId);
            if (basicIndex !== -1) {
                // If it's a basic challenge, we should probably promote it to a detailed one
                // but for now let's just ensure we have it in detailed storage if we're adding ideas
                const mockDetails = storage.getChallengeDetails();
                const newDetail = {
                    ...basicChallenges[basicIndex],
                    problemStatement: basicChallenges[basicIndex].description,
                    expectedOutcome: 'Pending detailed assessment',
                    businessUnit: 'Global',
                    department: 'Cross-functional',
                    priority: basicChallenges[basicIndex].impact || 'Medium',
                    estimatedImpact: 'TBD',
                    challengeTags: basicChallenges[basicIndex].tags || [],
                    timeline: 'TBD',
                    portfolioOption: 'TBD',
                    constraints: 'None specified yet',
                    stakeholders: 'TBD',
                    ideas: [summaryIdea],
                    team: basicChallenges[basicIndex].team?.map(t => ({ ...t, role: 'Member' })) || [],
                    activity: [],
                    createdDate: 'Recently',
                    updatedDate: 'Just now'
                };
                mockDetails.push(newDetail as any);
                localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(mockDetails));
            }
        }
    },

    addChallenge: (challenge: ChallengeDetailData) => {
        // 1. Update Detailed Data
        const details = storage.getChallengeDetails();
        details.push(challenge);
        localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(details));

        // 2. Create and update basic challenge list
        const challenges = storage.getChallenges();
        const basicChallenge: Challenge = {
            id: challenge.id,
            title: challenge.title,
            description: challenge.problemStatement.substring(0, 150) + '...',
            stage: challenge.stage,
            owner: challenge.owner,
            accentColor: challenge.accentColor,
            stats: challenge.stats,
            tags: challenge.challengeTags,
            team: challenge.team,
            impact: challenge.priority as any
        };
        challenges.push(basicChallenge);
        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));

        // 3. Create and update swim lane card
        const swimlanes = storage.getSwimLanes();
        const swimlaneCard: SwimLaneCard = {
            id: challenge.id,
            title: challenge.title,
            description: challenge.problemStatement.substring(0, 100) + '...',
            owner: challenge.owner.name,
            priority: challenge.priority as any,
            stage: challenge.stage,
            type: 'standard',
            progress: 0,
            value: challenge.estimatedImpact
        };
        swimlanes.push(swimlaneCard);
        localStorage.setItem(STORAGE_KEYS.SWIMLANES, JSON.stringify(swimlanes));
    },

    getAdminLogs: (): any[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGS);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    addAdminLog: (log: any) => {
        const logs = storage.getAdminLogs();
        logs.unshift({
            ...log,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(logs.slice(0, 100))); // Keep last 100
    },

    approveChallenge: (id: string, adminName: string) => {
        const challenges = storage.getChallenges();
        const index = challenges.findIndex(c => c.id === id);
        if (index !== -1) {
            challenges[index].approvalStatus = 'Approved';
            localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));

            // Also update detailed data if it exists
            const details = storage.getChallengeDetails();
            const detailIndex = details.findIndex(d => d.id === id);
            if (detailIndex !== -1) {
                details[detailIndex].approvalStatus = 'Approved';
                localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(details));
            }

            storage.addAdminLog({
                action: 'Approved Challenge',
                itemType: 'Challenge',
                itemName: challenges[index].title,
                adminName,
                status: 'Approved'
            });
            return true;
        }
        return false;
    },

    rejectChallenge: (id: string, adminName: string) => {
        const challenges = storage.getChallenges();
        const index = challenges.findIndex(c => c.id === id);
        if (index !== -1) {
            challenges[index].approvalStatus = 'Rejected';
            localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));

            // Also update detailed data
            const details = storage.getChallengeDetails();
            const detailIndex = details.findIndex(d => d.id === id);
            if (detailIndex !== -1) {
                details[detailIndex].approvalStatus = 'Rejected';
                localStorage.setItem(STORAGE_KEYS.CHALLENGE_DETAILS, JSON.stringify(details));
            }

            storage.addAdminLog({
                action: 'Rejected Challenge',
                itemType: 'Challenge',
                itemName: challenges[index].title,
                adminName,
                status: 'Rejected'
            });
            return true;
        }
        return false;
    },

    approveIdea: (id: string, adminName: string) => {
        const ideas = storage.getIdeaDetails();
        const index = ideas.findIndex(i => i.id === id);
        if (index !== -1) {
            ideas[index].approvalStatus = 'Approved';
            ideas[index].status = 'Accepted';
            localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(ideas));

            storage.addAdminLog({
                action: 'Approved Idea',
                itemType: 'Idea',
                itemName: ideas[index].title,
                adminName,
                status: 'Approved'
            });
            return true;
        }
        return false;
    },

    rejectIdea: (id: string, adminName: string) => {
        const ideas = storage.getIdeaDetails();
        const index = ideas.findIndex(i => i.id === id);
        if (index !== -1) {
            ideas[index].approvalStatus = 'Rejected';
            ideas[index].status = 'Declined';
            localStorage.setItem(STORAGE_KEYS.IDEA_DETAILS, JSON.stringify(ideas));

            storage.addAdminLog({
                action: 'Rejected Idea',
                itemType: 'Idea',
                itemName: ideas[index].title,
                adminName,
                status: 'Rejected'
            });
            return true;
        }
        return false;
    }
};
