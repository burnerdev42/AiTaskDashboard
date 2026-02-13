import { type SortDirection } from '../enums/commonEnums';

/**
 * Common pagination parameters.
 */
export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string | string[];
}

/**
 * Generic filter request object.
 */
export interface FilterRequest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Structured sort parameter.
 */
export interface SortParameter {
    field: string;
    direction: SortDirection;
}
