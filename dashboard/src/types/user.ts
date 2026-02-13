import { type OpCo, type Platform, type Interest } from '../enums/profileEnums';

/**
 * Represents a registered user in the system.
 */
export interface User {
    id: string;
    name: string;
    avatar: string;
    role: string;
    email: string;
    password?: string;
    // Extended profile info
    opCo?: OpCo;
    department?: string;
    location?: string;
    badges?: string[];
    interests?: Interest[];
    platforms?: Platform[];
}

/**
 * Statistics for the user's profile.
 */
export interface ProfileStats {
    /** Total number of challenges involved in. */
    challenges: number;
    /** Total number of ideas submitted. */
    ideas: number;
    /** Number of items currently in pilot stage. */
    inPilot: number;
    /** Total calculated value impact (e.g., "$1.2M"). */
    valueImpact: string;
}

/**
 * Represents a submission made by the user.
 */
export interface ProfileSubmission {
    /** Unique identifier of the submission. */
    id: string;
    /** Title of the submission. */
    title: string;
    /** Type of submission. */
    type: 'Challenge' | 'Idea';
    /** Current status of the submission. */
    status: string;
    /** Date of submission. */
    date: string;
    /** Link to the submission details. */
    link: string;
}

/**
 * Represents a recent activity on the user's profile.
 */
export interface ProfileActivity {
    /** Type of activity. */
    type: 'idea' | 'eval' | 'comment' | 'pilot' | 'challenge';
    /** Description of the activity (may contain HTML). */
    text: string;
    /** Timestamp or relative time string. */
    time: string;
}

/**
 * Aggregated data for the User Profile view.
 */
export interface UserProfileData {
    /** User statistics. */
    stats: ProfileStats;
    /** Array of contribution counts for the heatmap. */
    contributions: number[];
    /** List of recent submissions. */
    submissions: ProfileSubmission[];
    /** List of recent activities. */
    activities: ProfileActivity[];
}
