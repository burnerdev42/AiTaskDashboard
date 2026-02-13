import { apiRequest } from '../utils/apiRequest';
import { NOTIFICATION_API_ENDPOINTS } from '../api/notificationApiEndpoints';
import type { Notification } from '../types';

/**
 * Service for managing User Notifications.
 */
export const NotificationService = {
    /**
     * Fetch all notifications for the current user.
     * @returns {Promise<Notification[]>} List of notifications.
     */
    getAll: async (): Promise<Notification[]> => {
        const { url, method } = NOTIFICATION_API_ENDPOINTS.getAll;
        return apiRequest<Notification[]>({ url, method });
    },

    /**
     * Mark a specific notification as read.
     * @param id - Notification ID.
     */
    markAsRead: async (id: string): Promise<void> => {
        const { url, method } = NOTIFICATION_API_ENDPOINTS.markAsRead(id);
        return apiRequest<void>({ url, method });
    },

    /**
     * Mark all notifications as read for the current user.
     */
    markAllAsRead: async (): Promise<void> => {
        const { url, method } = NOTIFICATION_API_ENDPOINTS.markAllAsRead;
        return apiRequest<void>({ url, method });
    }
};
