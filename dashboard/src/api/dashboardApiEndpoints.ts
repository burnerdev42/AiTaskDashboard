import type { HttpMethod } from '../utils/apiRequest';

/**
 * Dashboard API endpoints.
 * Provides aggregated metrics and statistics for the dashboard.
 */
export const DASHBOARD_API_ENDPOINTS = {
    /** 
     * Get dashboard statistics (total challenges, ideas, value, etc).
     * @method GET
     */
    getStats: { url: '/dashboard/stats', method: 'GET' as HttpMethod },
};
