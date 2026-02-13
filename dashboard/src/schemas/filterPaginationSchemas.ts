import { z } from 'zod';
import { SORT_DIRECTIONS } from '../enums/commonEnums';

/**
 * Zod schema for PaginationParams.
 * Validates pagination and sorting query parameters.
 */
export const PaginationParamsSchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
    sort: z.union([z.string(), z.array(z.string())]).optional(),
});

/**
 * Zod schema for FilterRequest.
 * Represents a generic filter object with string keys.
 */
export const FilterRequestSchema = z.record(z.string(), z.any());

/**
 * Zod schema for SortParameter.
 * Defines a single sort field and direction.
 */
export const SortParameterSchema = z.object({
    field: z.string(),
    direction: z.enum(SORT_DIRECTIONS),
});
