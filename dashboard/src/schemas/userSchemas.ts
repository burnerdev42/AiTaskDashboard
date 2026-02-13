import { z } from 'zod';

/**
 * Zod schema for User.
 * Represents a registered user in the system.
 */
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    role: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
});

/**
 * Zod schema for ProfileStats.
 * Aggregated statistics for a user profile.
 */
export const ProfileStatsSchema = z.object({
    challenges: z.number(),
    ideas: z.number(),
    inPilot: z.number(),
    valueImpact: z.string(),
});

/**
 * Zod schema for ProfileSubmission.
 * Represents a challenge or idea submitted by the user.
 */
export const ProfileSubmissionSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['Challenge', 'Idea']),
    status: z.string(),
    date: z.string(),
    link: z.string(),
});

/**
 * Zod schema for ProfileActivity.
 * Represents a recent activity on the user's profile.
 */
export const ProfileActivitySchema = z.object({
    type: z.enum(['idea', 'eval', 'comment', 'pilot', 'challenge']),
    text: z.string(),
    time: z.string(),
});

/**
 * Zod schema for UserProfileData.
 * Complete profile data structure including stats and activity.
 */
export const UserProfileDataSchema = z.object({
    stats: ProfileStatsSchema,
    contributions: z.array(z.number()),
    submissions: z.array(ProfileSubmissionSchema),
    activities: z.array(ProfileActivitySchema),
});
