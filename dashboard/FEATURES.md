# Features & Architecture Documentation

## 🏗 Architecture Overview

This project follows a **Clean Architecture** inspired approach, adapted for a React frontend. The goal is to decouple valid business logic from the UI and ensuring 100% type safety and resilience.

### 📂 Folder Structure

```
src/
├── api/                    # API Endpoints (separated by feature)
├── core/                   # Core infrastructure (Config)
├── features/               # Feature-based modules (Slice pattern)
│   ├── [feature]/          # e.g., 'profile'
│   │   ├── api/            # Feature-specific Repositories
│   │   ├── hooks/          # React Hooks for the feature
│   │   ├── schemas/        # Zod Schemas for Validation
│   │   └── types/          # Feature-specific TS Types
├── hooks/                  # Shared Reusable Hooks (useEntityList, etc.)
├── lib/                    # Library-like utilities
├── services/               # Domain Services (ChallengeService, etc.)
├── utils/                  # Shared utilities (apiRequest, ApiError)
├── components/             # Shared UI components (dumb/pure)
├── constants/              # Global constants
└── data/                   # JSON Fallback Data (MockDB)
```

## 🚀 API Layer
 
### Backend Integration
- **Proxy**: Configured in `vite.config.ts` to forward `/api` requests to `localhost:8080`.
- **Services**: All services (`ChallengeService`, etc.) are ready to consume real endpoints.
 
### Centralized Client (`src/utils/apiRequest.ts`)
- **Native Fetch** based functional client.
- **Resilience**: Automatic retry mechanism (Exponential Backoff).
- **Timeout**: Configurable timeout via `apiConfig.ts`.
- **Error Handling**: Throws typed `ApiError` objects.

### Endpoint Definition (`src/api/*.ts`)
Endpoints are defined in separate files for better maintainability:
- `authApiEndpoints.ts`
- `challengeApiEndpoints.ts`
- `ideaApiEndpoints.ts`, etc.

### Service Layer (`src/services/`)
We use a **Factory Pattern** to eliminate boilerplate for CRUD operations.
- **`baseCrudService.ts`**: Generic factory for `getById`, `getAll`, `create`, `update`, `delete`.

#### Available Services
- **`ChallengeService`**: Manages Innovation Challenges.
- **`IdeaService`**: Manages Ideas.
- **`SwimlaneService`**: Manages Kanban swimlane cards.
- **`NotificationService`**: specialized service for user notifications (`markAsRead`, `markAllAsRead`).
- **`DashboardService`**: Specialized service for dashboard metrics (`getStats`).

#### Deprecated Services
- **`apiService.ts`**: Legacy mock service. Use the feature-specific services instead.

### Type Definitions (`src/types/`)
Types are split into domain-specific files for better organization:
- `common.ts`: Shared types like `ActivityItem`.
- `user.ts`: User profile and stats.
- `challenge.ts`: Challenge entity and related data.
- `idea.ts`: Idea entity.
- `swimlane.ts`: Kanban card types.
- `notification.ts`: Notification types.
- `dashboard.ts`: Dashboard specific statistics.
- `filterPaginationSort.ts`: Common API request types.

PRO TIP: Import everything from `src/types` (the barrel file) for convenience.
```typescript
import type { Challenge, Idea } from '../types';
```

### Utilities (`src/utils/`)

- **`apiRequest`**: The core data fetching utility. Wraps `fetch` with:
    - **Retries**: Exponential backoff.
    - **Timeouts**: Aborts requests after `VITE_API_TIMEOUT`.
    - **Typed Responses**: Generics support for type safety.
    - **Standardized Errors**: Converts failures to `ApiError`.

- **`ApiError`**: A custom Error class that holds `status`, `code`, and `userMessage`. Used everywhere to ensure consistent error handling in UIs.

- **`apiConfig`**: Type-safe configuration loader for environment variables.

### 🏗 Data & Validation Layer
- **Type Safety**:
    - Centralized Types in `src/types/`.
    - Single Source of Truth Enums in `src/enums/`.
- **Validation**:
    - Zod Schemas (`src/schemas/`) mirror TypeScript interfaces.
    - Runtime validation for all API responses.
    - **Validation Rules**: Strict adherence to Zod v3+ best practices (no deprecated functions).
    - **JSDoc**: All schemas are fully documented for developer clarity.
- **Mock Data Strategy**:
    - Strongly typed mocks in `src/data/mocks/`.
    - **Integrated Fallback**: `apiRequest` handles offline scenarios automatically via a `fallback` callback.
    - Services remain clean and declarative, simply passing the fallback data they want to use.
    - Automatic fallback mechanism (Configurable via `VITE_ENABLE_MOCK_FALLBACK`).
- **Structure**:
    - **`userSchemas.ts`**: Validates User and Profile data.
    - **`challengeSchemas.ts`**: Validates Challenge data including complex nested stats.
    - **`commonSchemas.ts`**: Shared schemas like `PagedResponseSchema`.
    - **`index.ts`**: Exports all schemas for easy access.

```typescript
import { ChallengeSchema } from '../schemas';
// Validate data at runtime
const validatedUser = UserSchema.parse(apiResponse);
```

## ❄️ Reusable Hooks

- **`useEntityList`**: The "Holy Grail" hook. Handles fetching, loading state, error state, and pagination automatically for any service.
- **`usePagination`**: Manages pagination state (page, size).
- **`useFilter`**: Manages complex filter objects.

## 🧩 Feature Implementation Guide

To add a new feature (e.g., `Challenges`):
### Type Definitions (`src/types/`)
Types are split into domain-specific files for better organization:
- `common.ts`: Shared types like `ActivityItem`.
- `user.ts`: User profile and stats.
- `challenge.ts`: Challenge entity and related data.
- `idea.ts`: Idea entity.
- `swimlane.ts`: Kanban card types.
- `notification.ts`: Notification types.
- `filterPaginationSort.ts`: Common API request types.

PRO TIP: Import everything from `src/types` (the barrel file) for convenience.
```typescript
import type { Challenge, Idea } from '../types';
```

---
