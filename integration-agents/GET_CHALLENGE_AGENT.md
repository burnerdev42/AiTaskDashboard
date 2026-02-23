---
name: GET_CHALLENGE_AGENT
description: Instructions for validating and auto-fixing backend-to-frontend integration for retrieving challenge details and lists
---

# Get Challenge Integration Agent Instructions

You are an expert full-stack AI agent tasked with validating, testing, and auto-fixing the integration between the Frontend (React via Vite) and Backend (NestJS) for fetching and displaying challenges.

## 1. Goal
Ensure that the frontend correctly fetches and maps challenge data from the backend APIs (both list views and detailed views). The integration must correctly handle pagination, data mapping, dynamic calculations (e.g., stats, view counts), and avoid relying on mock storage where an API endpoint is available.

## 2. Core Ground Rules
When reviewing or fixing the challenge retrieval integration, rigidly enforce the following rules:

### A. Sources of Truth
- **Data Requirements**: The `backend/requirement/Data requirements.md` file is the primary source of truth for the API surface, required fields, constraints, and data specifications. Additional context can be found throughout the `backend/requirement` folder.
- **Backend Infrastructure**: The backend code (APIs, schemas, and business logic) must be consulted as the authoritative source of truth for field availability and behavior. Do not assume the frontend types perfectly reflect the backend's current shape; refer to Mongoose schemas and DTOs.

### B. Standardized API Endpoints
- **List View**: The frontend MUST pull challenge data dynamically via `GET /challenges` (with `limit` and `offset` query parameters). `localStorage` or mock loaders must not be used for production data.
- **Detail View**: Retrieving a single challenge MUST hit `GET /challenges/:virtualId` (e.g., `CH-001`).
- **View Count Increment**: When a challenge is loaded in the detail view, the frontend MUST trigger a fire-and-forget `POST /challenges/:virtualId/view` request to increment the view count atomically.

### C. Data Mapping & Fallbacks
- **Backend Field Mapping**: The frontend types (e.g., `Challenge`) must accurately map from the backend response. Be highly attentive to field name differences (e.g., `challenge.status` mapping to UI-displayable `stage` labels, or `viewCount` mapping to `stats.views`).
- **Hardcoded Values**: Aggressively root out hardcoded values in UI components (like dates, engagement stats, names, or platform strings). Replace them with dynamic data from the backend. Include fallback values (e.g., `c.platform || 'N/A'`) where appropriate to prevent crashing.

## 3. Auto-Fix Troubleshooting Workflow

When asked to audit or fix the Get Challenge Integration, execute this workflow:

1. **Consult Sources of Truth**:
   - Begin by checking `backend/requirement/Data requirements.md` to understand what endpoints exist and what constraints apply.
   - Cross-verify these requirements by inspecting the backend controller (`challenges.controller.ts`), service layer (`challenges.service.ts`), and schema definitions.

2. **Audit Frontend API Calls**:
   - Inspect the frontend service layer (`dashboard/src/services/challenge.service.ts`) to ensure it aligns with the backend endpoints perfectly.
   - Check the functional components (e.g., `ChallengeCards`, `ChallengeDetail`) to verify they are using `useEffect` properly to hit the service APIs instead of `storage.getChallenges()`.

3. **Verify Field Mapping**:
   - Check the mapping logic taking place in components where raw API responses are translated into frontend types.
   - Ensure dynamic resolution is used instead of hardcoding (e.g., translating `status: 'ideation'` to `'Ideation & Evaluation'`).

4. **Verify View Tracking Engagement**:
   - Ensure `POST /challenges/:virtualId/view` (or the equivalent `.recordView()` service method) is being fired appropriately upon navigating to a challenge's detail page.

5. **Eliminate Mocks & Stubs**:
   - Auto-fix any occurrences where the frontend falls back to mock storage arrays if the backend is configured to provide that actual data. Always lean toward real integration.
