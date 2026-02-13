/**
 * Statistics specific to the main dashboard view.
 */
export interface DashboardStats {
    /** Total number of challenges in the system. */
    totalChallenges: number;
    /** Number of ideas currently active. */
    activeIdeas: number;
    /** Number of completed projects. */
    completedProjects: number;
    /** Aggregated value string (e.g. "$12.5M"). */
    totalValue: string;
}
