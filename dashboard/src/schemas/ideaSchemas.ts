import { z } from 'zod';
import { ActivityItemSchema } from './commonSchemas';
import { IDEA_STATUSES } from '../enums/ideaEnums';
import { IMPACT_LEVELS } from '../enums/challengeEnums';

/**
 * Zod schema for Idea.
 * Represents an innovation idea submitted by a user.
 */
export const IdeaSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(IDEA_STATUSES),
    owner: z.object({
        name: z.string(),
        avatar: z.string(),
        avatarColor: z.string(),
        role: z.string().optional(),
    }),
    linkedChallenge: z.object({
        id: z.string(),
        title: z.string(),
    }).optional(),
    tags: z.array(z.string()),
    stats: z.object({
        appreciations: z.number(),
        comments: z.number(),
        views: z.number(),
    }),
    approach: z.array(z.string()).optional(),
    problemStatement: z.string().optional(),
    proposedSolution: z.string().optional(),
    expectedImpact: z.string().optional(),
    implementationPlan: z.string().optional(),
    expectedSavings: z.string().optional(),
    impactLevel: z.enum(IMPACT_LEVELS).optional(),
    submittedDate: z.string().optional(),
    lastUpdated: z.string().optional(),
    activity: z.array(ActivityItemSchema).optional(),
});
