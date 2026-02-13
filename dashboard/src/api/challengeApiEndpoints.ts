import type { HttpMethod } from '../utils/apiRequest';

/**
 * Challenge API endpoints.
 * Manages CRUD operations for Innovation Challenges.
 */
export const CHALLENGE_API_ENDPOINTS = {
    /** 
     * Get a specific challenge by ID.
     * @param id - The unique identifier of the challenge.
     * @method GET
     */
    getById: (id: string) => ({ url: `/challenges/${id}`, method: 'GET' as HttpMethod }),

    /** 
     * Get all challenges.
     * Supports pagination and filtering via query parameters.
     * @method GET
     */
    getAll: { url: '/challenges', method: 'GET' as HttpMethod },

    /** 
     * Search and filter challenges.
     * @method GET
     */
    searchAndFilter: { url: '/challenges', method: 'GET' as HttpMethod },

    /** 
     * Create a new challenge.
     * @method POST
     * @body Partial<Challenge>
     */
    create: { url: '/challenges', method: 'POST' as HttpMethod },

    /** 
     * Update an existing challenge.
     * @param id - The unique identifier of the challenge.
     * @method PUT
     * @body Partial<Challenge>
     */
    update: (id: string) => ({ url: `/challenges/${id}`, method: 'PUT' as HttpMethod }),

    /** 
     * Delete a challenge.
     * @param id - The unique identifier of the challenge.
     * @method DELETE
     */
    delete: (id: string) => ({ url: `/challenges/${id}`, method: 'DELETE' as HttpMethod }),
};
