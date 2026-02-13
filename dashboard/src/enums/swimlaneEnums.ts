/**
 * Types of Swimlane Cards.
 */
export const SWIMLANE_TYPES = ['evaluation', 'pilot', 'validation', 'standard'] as const;
export type SwimLaneType = typeof SWIMLANE_TYPES[number];
