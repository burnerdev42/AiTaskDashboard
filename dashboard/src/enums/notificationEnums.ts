/**
 * Types of notifications.
 */
export const NOTIFICATION_TYPES = ['challenge', 'idea', 'comment', 'status'] as const;
export type NotificationType = typeof NOTIFICATION_TYPES[number];
