import { z } from 'zod';

/**
 * Zod schema for ActivityItem.
 * Represents a single activity event in a feed.
 */
export const ActivityItemSchema = z.object({
    author: z.string(),
    avatar: z.string(),
    avatarColor: z.string(),
    text: z.string(),
    time: z.string(),
});

/**
 * Generic function to create a pagination response schema.
 * @param itemSchema - The Zod schema for the content items.
 * @returns {z.ZodObject} - A Zod schema for the paginated response.
 */
export const createPagedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        content: z.array(itemSchema),
        totalElements: z.number(),
        totalPages: z.number(),
        size: z.number(),
        number: z.number(),
    });
