/**
 * Status values for Ideas.
 */
export const IDEA_STATUSES = ['Ideation', 'Evaluation', 'POC', 'Pilot', 'Scale'] as const;
export type IdeaStatus = typeof IDEA_STATUSES[number];
