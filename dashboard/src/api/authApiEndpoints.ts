import type { HttpMethod } from '../utils/apiRequest';

/**
 * Authentication API endpoints.
 * Handles login, logout, and token refresh operations.
 */
export const AUTH_API_ENDPOINTS = {
    /** 
     * Login endpoint.
     * @method POST
     * @body { email, password }
     */
    login: { url: '/auth/login', method: 'POST' as HttpMethod },

    /** 
     * Logout endpoint.
     * @method POST
     */
    logout: { url: '/auth/logout', method: 'POST' as HttpMethod },

    /** 
     * Token refresh endpoint.
     * @method POST
     */
    refresh: { url: '/auth/refresh', method: 'POST' as HttpMethod },
};
