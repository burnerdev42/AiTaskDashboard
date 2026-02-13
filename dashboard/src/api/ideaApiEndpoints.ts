import type { HttpMethod } from '../utils/apiRequest';

/**
 * Idea API endpoints.
 * Manages CRUD operations for Ideas submitted to challenges.
 */
export const IDEA_API_ENDPOINTS = {
    /** 
     * Get a specific idea by ID.
     * @param id - The unique identifier of the idea.
     * @method GET
     */
    getById: (id: string) => ({ url: `/ideas/${id}`, method: 'GET' as HttpMethod }),

    /** 
     * Get all ideas.
     * Supports pagination and filtering.
     * @method GET
     */
    getAll: { url: '/ideas', method: 'GET' as HttpMethod },

    /** 
     * Search and filter ideas.
     * @method GET
     */
    searchAndFilter: { url: '/ideas', method: 'GET' as HttpMethod },

    /** 
     * Submit a new idea.
     * @method POST
     * @body Partial<Idea>
     */
    create: { url: '/ideas', method: 'POST' as HttpMethod },

    /** 
     * Update an existing idea.
     * @param id - The unique identifier of the idea.
     * @method PUT
     * @body Partial<Idea>
     */
    update: (id: string) => ({ url: `/ideas/${id}`, method: 'PUT' as HttpMethod }),

    /** 
     * Delete an idea.
     * @param id - The unique identifier of the idea.
     * @method DELETE
     */
    delete: (id: string) => ({ url: `/ideas/${id}`, method: 'DELETE' as HttpMethod }),
};
