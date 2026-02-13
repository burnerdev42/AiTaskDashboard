import { createBaseCrudService } from './baseCrudService';
import { SWIMLANE_API_ENDPOINTS } from '../api/swimlaneApiEndpoints';
import type { SwimLaneCard, PagedResponse } from '../types';

/**
 * Service for managing Swimlane Cards (Kanban view).
 * Extends the generic CRUD service with standard methods.
 */
export const SwimlaneService = {
    ...createBaseCrudService<SwimLaneCard, PagedResponse<SwimLaneCard>>(SWIMLANE_API_ENDPOINTS),
};
