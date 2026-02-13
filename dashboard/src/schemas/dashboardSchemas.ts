import { z } from 'zod';

/**
 * Zod schema for DashboardStats.
 * Represents aggregated statistics for the main dashboard.
 */
export const DashboardStatsSchema = z.object({
    totalChallenges: z.number(),
    activeIdeas: z.number(),
    completedProjects: z.number(),
    totalValue: z.string(),
});
