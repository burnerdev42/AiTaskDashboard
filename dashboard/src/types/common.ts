/**
 * Represents an activity or audit log item throughout the system.
 * Used in Challenges, Ideas, and User Profiles.
 */
export interface ActivityItem {
    /** The name of the user who performed the activity. */
    author: string;
    /** URL to the user's avatar image. */
    avatar: string;
    /** Hex color code for the user's avatar background. */
    avatarColor: string;
    /** Description of the activity. */
    text: string;
    /** Timestamp or relative time string (e.g., "2 hours ago"). */
    time: string;
}

/**
 * Standard paginated response structure.
 * @template T - The type of content items.
 */
export interface PagedResponse<T> {
    /** Array of content items. */
    content: T[];
    /** Total number of elements across all pages. */
    totalElements: number;
    /** Total number of pages. */
    totalPages: number;
    /** Number of elements per page. */
    size: number;
    /** Current page number (0-indexed or 1-indexed depending on backend). */
    number: number;
}
