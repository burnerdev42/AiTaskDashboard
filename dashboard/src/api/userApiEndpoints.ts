import type { HttpMethod } from '../utils/apiRequest';

/**
 * User API endpoints.
 * Manages user profiles and related user data.
 */
export const USER_API_ENDPOINTS = {
    /** 
     * Get the current user's profile data.
     * @method GET
     */
    getProfile: { url: '/users/profile', method: 'GET' as HttpMethod },

    /** 
     * Get a list of users (directory).
     * @method GET
     */
    getUsers: { url: '/users', method: 'GET' as HttpMethod },

    /** 
     * Get user profile statistics.
     * @method GET
     */
    getProfileStats: { url: '/profile/stats', method: 'GET' as HttpMethod },

    /** 
     * Get recent user activity.
     * @method GET
     */
    getProfileActivity: { url: '/profile/activity', method: 'GET' as HttpMethod },

    /** 
     * Get user submissions (Challenges/Ideas).
     * @method GET
     */
    getProfileSubmissions: { url: '/profile/submissions', method: 'GET' as HttpMethod },

    /** 
     * Get user contributions graph data.
     * @method GET
     */
    getProfileContributions: { url: '/profile/contributions', method: 'GET' as HttpMethod },
};
