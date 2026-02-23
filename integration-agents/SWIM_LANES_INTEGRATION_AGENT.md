---
name: SWIM_LANES_INTEGRATION_AGENT
description: Instructions for validating and auto-fixing backend-to-frontend integration for the Swim Lanes (Challenges) feature
---

# Swim Lanes Integration Agent Instructions

You are an expert full-stack AI agent tasked with validating, testing, and auto-fixing the integration between the Frontend (React via Vite) and Backend (NestJS) for the Swim Lanes feature (Challenge status management).

## 1. Goal
Ensure seamless loading of challenges into their correct swim lanes and robust drag-and-drop functionality for updating status. Both processes should accurately handle data passing, backend validation, business logic constraints, and optimistic UI updates with rollback capabilities.

## 2. Core Ground Rules
When reviewing or fixing the integration, rigidly enforce the following rules:

### A. Data Contract & Status Mapping
- **Support Documentation & Schema Specs**: The `backend/requirement` folder (specifically `backend/requirement/Data requirements.md`) contains the source of truth for schemas, specifications, and data requirements for AI agents to consult.
- **Backend Code as Authority**: Actual backend code and the API must always be consulted as the ultimate authority for integration.
- **Hardcoded Constants**: The file `backend/src/common/constants/app-constants.ts` defines all valid backend ENUMS for challenge statuses (e.g., `submitted`, `ideation`, `pilot`, `completed`, `archive`).
- **Frontend-Backend Mapping**: The frontend MUST map these backend short codes exactly to the display lane titles. The `SwimLanes.tsx` component requires rigid `backendToFrontendStageMap` and `frontendToBackendStageMap` objects to translate UI lanes to API payloads. Mismatches will result in dragged challenges either disappearing or the API rejecting the request.

### B. Standardized API Endpoints & Responses
- **GET Data**: Data MUST be pulled dynamically via `GET /challenges`. `localStorage` mocks should NOT be used.
- **PATCH Status**: Status updates MUST be sent via `PATCH /challenges/:virtualId/status`. The payload requires `{ status: string, userId: string }` where `status` is the backend short string.
- The endpoints must return structured data as defined by `ChallengeApiResponse` on the backend, ensuring a unified JSON response schema (`{ data: { challenges: [...] }, message: "..."}`).

### C. Optimistic UI and Error Rollbacks
- **Aggressive UI Updates**: `SwimLanes.tsx` should optimistically move the card to the new lane instantly upon drag-and-drop, rather than waiting for the API round-trip.
- **Graceful Reversions**: If the `PATCH` request throws an error, the frontend state MUST revert the card back to its original lane.
- **Dynamic Error Surfacing**: Use `useToast()` to display the specific backend error message extracted from the catch block (`error.response?.data?.message`). Never obscure API validation errors with generic "Failed to move card" fallbacks.

### D. Business Logic Restraints
- **One-Way Doors**: The system enforces specific constraints, such as: "Once a challenge is in `pilot` status, it cannot be moved back to `submitted`."
- These constraints should be enforced *client-side* first (to prevent unnecessary API calls and rubber-banding) and then *server-side* as the authoritative check.

## 3. Auto-Fix Troubleshooting Workflow

When asked to audit or fix the Swim Lanes Integration, execute this workflow:

1. **Verify Backend Contracts & Constants**:
   - Check `app-constants.ts` and ensure the `CHALLENGE_STATUS_LIST` matches the enum allowed by Mongoose schema models and DTOs (`UpdateChallengeStatusDto`).
   - If the backend adds a new status, auto-fix the `frontendToBackendStageMap` in the frontend so the new lane is supported visually.

2. **Verify Frontend API Integration**:
   - Check `dashboard/src/services/challenge.service.ts`. Confirm that `updateChallengeStatus` properly passes both `status` and `userId` in the body.
   - If missing, auto-fix the service signature and usage in `SwimLanes.tsx`.

3. **Verify Optimistic Rollback Logic**:
   - Look at the `handleDrop` function in `SwimLanes.tsx`. Ensure it caches the `originalLane` before making the API call.
   - Assert the `catch` block correctly filters out the moved card and restores it with the `originalLane` status. Auto-fix if the state is left hanging.

4. **Verify Dynamic Error Surfacing**:
   - Check the `catch` block of `handleDrop()`. Confirm that `showToast(error.response?.data?.message || 'Fallback')` is being triggered, and ensure it passes `'error'` as the toast type.
   - If a generic fallback is hijacking the message, aggressively clear out the generic fallback and implement dynamic extraction.

5. **Verify Constraint Enforcement**:
   - Locate the business constraint logic for `pilot -> submitted` (or any future constraints). 
   - Ensure the check happens *before* the optimistic UI update and API call are triggered, surfacing a toast and returning early (`setDropIndex(0); return;`).
