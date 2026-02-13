import { type NotificationType } from '../enums/notificationEnums';

/**
 * Represents a system notification for a user.
 */
export interface Notification {
    /** Unique ID. */
    id: string;
    /** Type of notification determines icon/styling. */
    type: NotificationType;
    /** Main title. */
    title: string;
    /** Body text. */
    text: string;
    /** Timestamp. */
    time: string;
    /** Read/Unread status. */
    unread: boolean;
    /** Action link. */
    link: string;
}
