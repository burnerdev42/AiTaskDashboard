/**
 * Lifecycle stages of a challenge.
 */
export const CHALLENGE_STAGES = ['Scale', 'Pilot', 'Prototype', 'Ideation'] as const;
export type ChallengeStage = typeof CHALLENGE_STAGES[number];

/**
 * UI Accent Colors mainly used for cards and tags.
 */
export const ACCENT_COLORS = ['teal', 'blue', 'green', 'orange', 'purple', 'pink'] as const;
export type AccentColor = typeof ACCENT_COLORS[number];

/**
 * Impact Levels for Challenges and Ideas.
 */
export const IMPACT_LEVELS = ['Critical', 'High', 'Medium', 'Low'] as const;
export type ImpactLevel = typeof IMPACT_LEVELS[number];
