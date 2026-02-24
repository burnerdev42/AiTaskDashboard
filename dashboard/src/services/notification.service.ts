import { api } from './api';
import { type Notification } from '../types';

interface BackendNotification {
    _id: string;
    type: string;
    fk_id: string | null;
    isSeen: boolean;
    createdAt: string;
    title: string;
    description: string;
    linkedEntityDetails?: {
        virtualId?: string;
        challengeVirtualId?: string;
        type?: 'CH' | 'ID';
    };
    initiatorDetails?: {
        name?: string;
    };
}

const mapBackendTypeToFrontend = (backendType: string): Notification['type'] => {
    if (backendType.includes('comment')) return 'comment';
    if (backendType.includes('status') || backendType.includes('subscribe') || backendType.includes('edit') || backendType.includes('delete')) return 'status';
    if (backendType.includes('upvoted')) return 'vote';
    if (backendType.includes('idea')) return 'idea';
    return 'challenge';
};

const mapBackendToFrontend = (n: BackendNotification): Notification => {
    let link = '/';

    // Natively handle backend-derived virtualId + type mapping if present.
    if (n.linkedEntityDetails?.virtualId && n.linkedEntityDetails?.type) {
        if (n.linkedEntityDetails.type === 'ID') {
            const cId = n.linkedEntityDetails.challengeVirtualId;
            link = cId
                ? `/challenges/${cId}/ideas/${n.linkedEntityDetails.virtualId}`
                : `/idea/${n.linkedEntityDetails.virtualId}`;
        } else {
            link = `/challenges/${n.linkedEntityDetails.virtualId}`;
        }
    } else {
        // Fallback to legacy fk_id routing based on notification type prefixes
        if (n.type.includes('idea')) {
            link = `/idea/${n.fk_id}`;
        } else if (n.type.includes('challenge')) {
            link = `/challenge/${n.fk_id}`;
        }
    }

    return {
        id: n._id,
        type: mapBackendTypeToFrontend(n.type),
        title: n.title || 'Notification',
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
