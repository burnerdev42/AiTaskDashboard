# Architecture Alignment Plan

This plan outlines the steps to align the `AiTaskDashboard` with the architectural patterns found in the `Sample` project.

## 🎯 Goal
Adopt the production-ready patterns from `Sample` (`baseCrudService`, `apiRequest`, `ApiError`, `useEntityList`) to ensure scalability, reduce code duplication, and standardize error handling.

## 🏗 Architecture Map

| Concept | Sample Project | Dashboard (Current) | Dashboard (Target) |
|---------|---------------|-------------------|--------------------|
| **API Client** | `utils/apiRequest.ts` (Functional) | `core/api/apiClient.ts` (Class) | **Refactor to `lib/apiRequest.ts`** (Functional + Caching) |
| **Error Handling** | `utils/ApiError.ts` | `core/errors/AppError.ts` | **Align `ApiError` structure** (status, userMessage) |
| **Service Layer** | `services/baseCrudService.ts` | `features/x/api/repo.ts` | **Adopt `services/baseCrudService.ts`** factory |
| **Shared Utils** | `utils/` | `core/utils/` | **Move to `lib/` and `utils/`** standard |
| **Hooks** | `hooks/useEntityList.ts` (Proposed) | N/A | **Create reuseable hooks** |

## 📋 Implementation Tasks

### Phase 1: Foundation (Lib & Utils)
- [ ] **Restructure Folders**: Create `src/lib`, `src/utils`, `src/services`.
- [ ] **Adopt ApiError**: Create `src/utils/ApiError.ts` matching Sample's structure.
- [ ] **Refactor API Client**:
    - Move `apiClient.ts` to `src/lib/apiRequest.ts`.
    - Implement `useCache` (GET caching).
    - Implement `withAuth` and Token Refresh logic.
    - Switch to functional style `apiRequest` (to match Sample).

### Phase 2: Service Layer (Base CRUD)
- [ ] **Create Base Service**: Implement `src/services/baseCrudService.ts`.
    - `createBaseCrudService<T, P>(endpoints)`
    - `buildPaginationQuery`
    - `buildSearchFilterQuery`
- [ ] **Define Interfaces**:
    - `PagedResponse<T>`
    - `PageParams`
    - `FilterRequest`

### Phase 3: Reusable Hooks
- [ ] **Create Hooks**:
    - `src/hooks/usePagination.ts`
    - `src/hooks/useFilter.ts`
    - `src/hooks/useEntityList.ts` (The "Holy Grail" hook mentioned in Sample)

### Phase 4: Feature Refactoring
- [ ] **Refactor Profile**:
    - Update `ProfileRepository` to use `apiRequest`.
    - (Optional) Adapt to `baseCrudService` if applicable.
- [ ] **Apply to Future Features**:
    - Projects, Users, etc. will simple be `export const UserService = createBaseCrudService(...)`.

## 📝 Usage Guidelines

### Creating a new Service
```typescript
// src/services/challengeService.ts
import { createBaseCrudService } from './baseCrudService';
import { CHALLENGE_ENDPOINTS } from '../api/endpoints';

export const ChallengeService = {
  ...createBaseCrudService<Challenge, PagedResponse<Challenge>>(CHALLENGE_ENDPOINTS),
  // Add custom methods
  startPilot: async (id: string) => { ... }
};
```

### Using in Component
```typescript
const { data, loading, fetch } = useEntityList(ChallengeService.getAll);
```
