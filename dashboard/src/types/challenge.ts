import { type ChallengeStage, type AccentColor } from '../enums/challengeEnums';
import type { ActivityItem } from './common';

export { type ChallengeStage, type AccentColor };

/**
 * Represents an Innovation Challenge.
 */
export interface Challenge {
    /** Unique identifier. */
    id: string;
    /** Challenge title. */
    title: string;
    /** Short description. */
    description: string;
    /** Current stage. */
    stage: ChallengeStage;
    /** Owner details. */
    owner: {
        name: string;
        avatar: string; // Initials
        avatarColor: string; // Hex code
    };
    /** UI accent color. */
    accentColor: AccentColor;
    /** Metrics and statistics. */
    stats: {
        appreciations: number;
        comments: number;
        roi?: string; // e.g., "3.2x"
        savings?: string; // e.g., "$4.2M"
        markets?: number;
        members?: number;
        votes?: number;
        accuracy?: string;
        methods?: number;
        [key: string]: string | number | undefined;
    };
    /** Optional tags. */
    tags?: string[];
}

/**
 * Data structure for Challenge Cards on the dashboard.
 */
import { type ImpactLevel } from '../enums/challengeEnums';

/**
 * Data structure for Challenge Cards on the dashboard.
 */
export interface ChallengeCardData {
    id: string;
    challengeNumber: string;
    title: string;
    description: string;
    stage: ChallengeStage;
    impact: ImpactLevel;
    ideasCount: number;
    effort: string;
    value: string;
    owner: { name: string; initial: string; color: string };
    team: { name: string; initial: string; color: string }[];
}

import { type Priority } from '../enums/commonEnums';

/**
 * Detailed view of a Challenge.
 * Extends the basic Challenge interface.
 */
export interface ChallengeDetailData extends Challenge {
    problemStatement: string;
    expectedOutcome: string;
    businessUnit: string;
    department: string;
    priority: Priority;
    estimatedImpact: string;
    challengeTags: string[];
    /** List of ideas linked to this challenge. */
    ideas: {
        id: string;
        title: string;
        author: string;
        status: string;
        appreciations: number;
        comments: number;
        views: number;
    }[];
    /** Team members involved. */
    team: { name: string; avatar: string; avatarColor: string; role: string }[];
    /** Audit log or activity history. */
    activity: ActivityItem[];
    createdDate: string;
    updatedDate: string;
}
