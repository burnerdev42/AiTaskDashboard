import { createBaseCrudService } from './baseCrudService';
import { CHALLENGE_API_ENDPOINTS } from '../api/challengeApiEndpoints';
import type { Challenge, PagedResponse } from '../types';
import { MOCK_CHALLENGE_DETAILS, MOCK_CHALLENGE_CARDS } from '../data/mocks/challengeMocks';
import { apiRequest } from '../utils/apiRequest';
import type { ChallengeCardData } from '../types';

/**
 * Service for managing Innovation Challenges.
 * Extends the generic CRUD service with standard methods.
 */
export const ChallengeService = {
    ...createBaseCrudService<Challenge, PagedResponse<Challenge>>(CHALLENGE_API_ENDPOINTS, MOCK_CHALLENGE_DETAILS),

    /**
     * Get unique statistics for the challenges dashboard.
     * Note: This is an aggregation often done on the backend.
     */
    getStats: async (): Promise<{ total: number; active: number; completed: number }> => {
        return apiRequest<{ total: number; active: number; completed: number }>({
            url: '/challenges/stats',
            method: 'GET',
            fallback: () => ({ total: 12, active: 8, completed: 4 })
        });
    },

    /**
     * Get challenges formatted for the dashboard cards.
     */
    /**
     * Get challenges formatted for the dashboard cards.
     */
    getCards: async (): Promise<PagedResponse<ChallengeCardData>> => {
        const data = await apiRequest<ChallengeCardData[]>({
            url: '/challenges/cards',
            method: 'GET',
            fallback: () => MOCK_CHALLENGE_CARDS
        });
        return {
            content: data,
            totalElements: data.length,
            totalPages: 1,
            size: data.length,
            number: 0
        };
    },
};
