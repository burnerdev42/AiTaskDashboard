import { api } from './api';
import { type Notification } from '../types';

interface BackendNotification {
    _id: string;
    type: string;
    fk_id: string | null;
    isSeen: boolean;
    createdAt: string;
    description: string;
    linkedEntityDetails?: {
        virtualId?: string;
        ideaId?: string;
        title?: string;
    };
    initiatorDetails?: {
        name?: string;
    };
}

const mapBackendTypeToFrontend = (backendType: string): Notification['type'] => {
    if (backendType.includes('comment')) return 'comment';
    if (backendType.includes('status')) return 'status';
    if (backendType.includes('upvoted')) return 'vote';
    if (backendType.includes('idea')) return 'idea';
    return 'challenge';
};

const mapBackendToFrontend = (n: BackendNotification): Notification => {
    let link = '/';
    if (n.linkedEntityDetails) {
        if (n.linkedEntityDetails.ideaId) {
            link = `/idea/${n.linkedEntityDetails.ideaId}`;
        } else if (n.linkedEntityDetails.virtualId) {
            link = `/challenge/${n.linkedEntityDetails.virtualId}`;
        }
    }

    return {
        id: n._id,
        type: mapBackendTypeToFrontend(n.type),
        title: n.linkedEntityDetails?.title || 'Notification',
        text: n.description || 'You have a new notification',
        time: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        unread: !n.isSeen,
        link
    };
};

export const notificationService = {
    getNotifications: async (userId: string, limit: number = 5): Promise<Notification[]> => {
        try {
            const response = await api.get(`/notifications/user/${userId}?limit=${limit}`);
            const data = response.data?.data?.notifications || response.data?.data || response.data || [];
            return (Array.isArray(data) ? data : []).map(mapBackendToFrontend);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return [];
        }
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        try {
            const response = await api.get(`/notifications/user/${userId}/count?isSeen=false`);
            return response.data?.data?.count || response.data?.count || 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return 0;
        }
    },

    markAsRead: async (notificationId: string): Promise<void> => {
        try {
            await api.patch(`/notifications/${notificationId}/status`, { isSeen: true });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.error('Failed to mark notification as read');
        }
    },

    deleteNotification: async (notificationId: string): Promise<void> => {
        try {
            await api.delete(`/notifications/${notificationId}`);
        } catch (error) {
            console.error('Failed to delete notification');
            throw error;
        }
    }
};
