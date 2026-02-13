import { z } from 'zod';
import { NOTIFICATION_TYPES } from '../enums/notificationEnums';

/**
 * Zod schema for Notification.
 * Represents a system notification for a user.
 */
export const NotificationSchema = z.object({
    id: z.string(),
    type: z.enum(NOTIFICATION_TYPES),
    title: z.string(),
    text: z.string(),
    time: z.string(),
    unread: z.boolean(),
    link: z.string(),
});
