import type { HttpMethod } from '../utils/apiRequest';

/**
 * Swimlane API endpoints.
 * Manages the kanban-style swimlane cards for project tracking.
 */
export const SWIMLANE_API_ENDPOINTS = {
    /** 
     * Get a specific swimlane card by ID.
     * @param id - The unique identifier of the card.
     * @method GET
     */
    getById: (id: string) => ({ url: `/dashboard/swimlanes/${id}`, method: 'GET' as HttpMethod }),

    /** 
     * Get all swimlane cards.
     * @method GET
     */
    getAll: { url: '/dashboard/swimlanes', method: 'GET' as HttpMethod },

    /** 
     * Search and filter swimlane cards.
     * @method GET
     */
    searchAndFilter: { url: '/dashboard/swimlanes', method: 'GET' as HttpMethod },

    /** 
     * Create a new swimlane card.
     * @method POST
     * @body Partial<SwimLaneCard>
     */
    create: { url: '/dashboard/swimlanes', method: 'POST' as HttpMethod },

    /** 
     * Update a swimlane card (e.g. move to new stage).
     * @param id - The unique identifier of the card.
     * @method PUT
     * @body Partial<SwimLaneCard>
     */
    update: (id: string) => ({ url: `/dashboard/swimlanes/${id}`, method: 'PUT' as HttpMethod }),

    /** 
     * Delete a swimlane card.
     * @param id - The unique identifier of the card.
     * @method DELETE
     */
    delete: (id: string) => ({ url: `/dashboard/swimlanes/${id}`, method: 'DELETE' as HttpMethod }),
};
