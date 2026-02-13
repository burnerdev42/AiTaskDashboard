/**
 * Priority levels.
 */
export const PRIORITIES = ['High', 'Medium', 'Low'] as const;
export type Priority = typeof PRIORITIES[number];

/**
 * Sort directions.
 */
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type SortDirection = typeof SORT_DIRECTIONS[number];
