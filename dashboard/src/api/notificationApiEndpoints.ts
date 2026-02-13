import type { HttpMethod } from '../utils/apiRequest';

/**
 * Notification API endpoints.
 * Manages user notifications and read status.
 */
export const NOTIFICATION_API_ENDPOINTS = {
    /** 
     * Get all notifications for the current user.
     * @method GET
     */
    getAll: { url: '/dashboard/notifications', method: 'GET' as HttpMethod },

    /** 
     * Mark a specific notification as read.
     * @param id - The ID of the notification.
     * @method PUT
     */
    markAsRead: (id: string) => ({ url: `/dashboard/notifications/${id}/read`, method: 'PUT' as HttpMethod }),

    /** 
     * Mark all notifications as read for the current user.
     * @method PUT
     */
    markAllAsRead: { url: '/dashboard/notifications/read-all', method: 'PUT' as HttpMethod },
};
