import { createBaseCrudService } from './baseCrudService';
import { IDEA_API_ENDPOINTS } from '../api/ideaApiEndpoints';
import type { Idea, PagedResponse } from '../types';
import { MOCK_IDEA_DETAILS } from '../data/mocks/ideaMocks';

/**
 * Service for managing Innovation Ideas.
 */
export const IdeaService = {
    ...createBaseCrudService<Idea, PagedResponse<Idea>>(IDEA_API_ENDPOINTS, MOCK_IDEA_DETAILS),
};
