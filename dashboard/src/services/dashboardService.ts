import { apiRequest } from '../utils/apiRequest';
import { DASHBOARD_API_ENDPOINTS } from '../api/dashboardApiEndpoints';
import type { DashboardStats } from '../types/dashboard';

/**
 * Service for fetching Dashboard Metrics and Statistics.
 */
export const DashboardService = {
    /**
     * Get aggregated stats for the dashboard.
     * @returns {Promise<DashboardStats>}
     */
    getStats: async (): Promise<DashboardStats> => {
        const { url, method } = DASHBOARD_API_ENDPOINTS.getStats;
        return apiRequest<DashboardStats>({ url, method });
    }
};
