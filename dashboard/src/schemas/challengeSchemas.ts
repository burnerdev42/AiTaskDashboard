import { z } from 'zod';
import { ActivityItemSchema } from './commonSchemas';
import { CHALLENGE_STAGES, ACCENT_COLORS, IMPACT_LEVELS } from '../enums/challengeEnums';
import { PRIORITIES } from '../enums/commonEnums';

/**
 * Zod schema for ChallengeStage.
 * Defines the lifecycle stages of a challenge.
 */
export const ChallengeStageSchema = z.enum(CHALLENGE_STAGES);

/**
 * Zod schema for Challenge.
 * Core challenge entity with owner and stats.
 */
export const ChallengeSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    stage: ChallengeStageSchema,
    owner: z.object({
        name: z.string(),
        avatar: z.string(),
        avatarColor: z.string(),
    }),
    accentColor: z.enum(ACCENT_COLORS),
    stats: z.object({
        appreciations: z.number(),
        comments: z.number(),
        roi: z.string().optional(),
        savings: z.string().optional(),
        markets: z.number().optional(),
        members: z.number().optional(),
        votes: z.number().optional(),
        accuracy: z.string().optional(),
        methods: z.number().optional(),
    }).catchall(z.union([z.string(), z.number()])), // Allow dynamic keys with strict type
    tags: z.array(z.string()).optional(),
});

/**
 * Zod schema for ChallengeCardData.
 * Subset of challenge data for card views.
 */
export const ChallengeCardDataSchema = z.object({
    id: z.string(),
    challengeNumber: z.string(),
    title: z.string(),
    description: z.string(),
    stage: ChallengeStageSchema,
    impact: z.enum(IMPACT_LEVELS),
    ideasCount: z.number(),
    effort: z.string(),
    value: z.string(),
    owner: z.object({ name: z.string(), initial: z.string(), color: z.string() }),
    team: z.array(z.object({ name: z.string(), initial: z.string(), color: z.string() })),
});

/**
 * Zod schema for ChallengeDetailData.
 * Detailed view of a challenge including problem statement and full activity.
 */
export const ChallengeDetailDataSchema = ChallengeSchema.extend({
    problemStatement: z.string(),
    expectedOutcome: z.string(),
    businessUnit: z.string(),
    department: z.string(),
    priority: z.enum(PRIORITIES),
    estimatedImpact: z.string(),
    challengeTags: z.array(z.string()),
    ideas: z.array(z.object({
        id: z.string(),
        title: z.string(),
        author: z.string(),
        status: z.string(),
        appreciations: z.number(),
        comments: z.number(),
        views: z.number(),
    })),
    team: z.array(z.object({ name: z.string(), avatar: z.string(), avatarColor: z.string(), role: z.string() })),
    activity: z.array(ActivityItemSchema),
    createdDate: z.string(),
    updatedDate: z.string(),
});
