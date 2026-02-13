import { z } from 'zod';
import { ChallengeStageSchema } from './challengeSchemas';
import { SWIMLANE_TYPES } from '../enums/swimlaneEnums';
import { PRIORITIES } from '../enums/commonEnums';

/**
 * Zod schema for SwimLaneCard.
 * Represents a card on the Kanban board.
 */
export const SwimLaneCardSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    owner: z.string(),
    priority: z.enum(PRIORITIES),
    stage: z.union([ChallengeStageSchema, z.literal('Parking Lot')]),
    type: z.enum(SWIMLANE_TYPES),
    progress: z.number().optional(),
    value: z.string().optional(),
    kudos: z.number().optional(),
});
