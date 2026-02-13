import type { ActivityItem } from './common';
import { type IdeaStatus } from '../enums/ideaEnums';
import { type ImpactLevel } from '../enums/challengeEnums';

/**
 * Represents an innovation idea submitted by a user.
 */
export interface Idea {
    id: string;
    title: string;
    description: string;
    status: IdeaStatus;
    owner: {
        name: string;
        avatar: string;
        avatarColor: string;
        role?: string;
    };
    linkedChallenge?: {
        id: string;
        title: string;
    };
    tags: string[];
    stats: {
        appreciations: number;
        comments: number;
        views: number;
    };
    approach?: string[];
    problemStatement?: string;
    proposedSolution?: string;
    expectedImpact?: string;
    implementationPlan?: string;
    expectedSavings?: string;
    impactLevel?: ImpactLevel;
    submittedDate?: string;
    lastUpdated?: string;
    /** Activity history using shared ActivityItem. */
    activity?: ActivityItem[];
}
