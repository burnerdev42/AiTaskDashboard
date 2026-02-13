import { apiRequest, type HttpMethod } from '../utils/apiRequest';
import type { FilterRequest, PaginationParams } from '../types/filterPaginationSort';
import type { PagedResponse } from '../types/common';

/**
 * Interface defining the standard structure for API endpoints used by the CRUD service.
 */
export interface ApiEndpoints {
    getById: (id: string) => { url: string; method: HttpMethod };
    getAll: { url: string; method: HttpMethod };
    searchAndFilter: { url: string; method: HttpMethod };
    create: { url: string; method: HttpMethod };
    update: (id: string) => { url: string; method: HttpMethod };
    delete: (id: string) => { url: string; method: HttpMethod };
}

/**
 * Helper to build URLSearchParams from pagination parameters.
 * @param params - Pagination and sorting parameters.
 * @returns {URLSearchParams}
 */
export function buildPaginationQuery(params?: PaginationParams): URLSearchParams {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.size !== undefined) query.append('size', String(params.size));
    if (params?.sort) {
        if (Array.isArray(params.sort)) {
            params.sort.forEach(s => query.append('sort', s));
        } else {
            query.append('sort', params.sort);
        }
    }
    return query;
}

/**
 * Factory function to create a generic CRUD service.
 * Reduces boilerplate by generating standard methods for a given set of endpoints.
 * 
 * @template T - The entity type (e.g., Challenge, Idea).
 * @template P - The paginated response type.
 * @param endpoints - The API endpoints configuration.
 * @param mockData - Optional array of mock data to use as fallback.
 * @returns A service object with getById, getAll, searchAndFilter, create, update, and delete methods.
 */
export function createBaseCrudService<T, P extends PagedResponse<T>>(endpoints: ApiEndpoints, mockData: T[] = []) {
    return {
        /**
         * Fetch a single entity by ID.
         * @param id - Entity ID.
         */
        getById: async (id: string): Promise<T> => {
            const { url, method } = endpoints.getById(id);
            return apiRequest<T>({
                url,
                method,
                fallback: () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const item = mockData.find((item: any) => item.id === id);
                    if (!item) throw new Error(`Mock item with id ${id} not found`);
                    return item;
                }
            });
        },

        /**
         * Fetch all entities with optional pagination.
         * @param params - Pagination parameters.
         */
        getAll: async (params?: PaginationParams): Promise<P> => {
            const { url, method } = endpoints.getAll;
            const query = buildPaginationQuery(params);
            const fullUrl = query.toString() ? `${url}?${query.toString()}` : url;

            return apiRequest<P>({
                url: fullUrl,
                method,
                fallback: () => {
                    const page = params?.page || 0;
                    const size = params?.size || 10;
                    const start = page * size;
                    const end = start + size;
                    const content = mockData.slice(start, end);

                    return {
                        content,
                        totalElements: mockData.length,
                        totalPages: Math.ceil(mockData.length / size),
                        size,
                        number: page,
                        first: page === 0,
                        last: end >= mockData.length,
                        numberOfElements: content.length,
                        empty: content.length === 0,
                    } as unknown as P;
                }
            });
        },

        /**
         * Search and filter entities.
         * @param filter - Filter criteria.
         * @param params - Pagination parameters.
         */
        searchAndFilter: async (filter: FilterRequest, params?: PaginationParams): Promise<P> => {
            const { url, method } = endpoints.searchAndFilter;
            const query = buildPaginationQuery(params);
            const fullUrl = query.toString() ? `${url}?${query.toString()}` : url;

            return apiRequest<P>({
                url: fullUrl,
                method,
                body: filter,
                fallback: () => {
                    // Simple mock fallback ignores filters for now
                    const page = params?.page || 0;
                    const size = params?.size || 10;
                    const start = page * size;
                    const end = start + size;
                    const content = mockData.slice(start, end);

                    return {
                        content,
                        totalElements: mockData.length,
                        totalPages: Math.ceil(mockData.length / size),
                        size,
                        number: page,
                        first: page === 0,
                        last: end >= mockData.length,
                        numberOfElements: content.length,
                        empty: content.length === 0,
                    } as unknown as P;
                }
            });
        },

        /**
         * Create a new entity.
         * @param payload - The entity data to create.
         */
        create: async (payload: Partial<T>): Promise<T> => {
            const { url, method } = endpoints.create;
            return apiRequest<T>({ url, method, body: payload });
        },

        /**
         * Update an existing entity.
         * @param id - Entity ID.
         * @param payload - Data to update.
         */
        update: async (id: string, payload: Partial<T>): Promise<T> => {
            const { url, method } = endpoints.update(id);
            return apiRequest<T>({ url, method, body: payload });
        },

        /**
         * Delete an entity.
         * @param id - Entity ID.
         */
        delete: async (id: string): Promise<void> => {
            const { url, method } = endpoints.delete(id);
            return apiRequest<void>({ url, method });
        }
    };
}
