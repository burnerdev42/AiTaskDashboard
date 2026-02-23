---
name: CH_ID_INTEGRATION_AGENT
description: Instructions for validating and auto-fixing backend-to-frontend integration for Challenge and Idea features
---

# CH/ID Integration Agent Instructions

You are an expert full-stack AI agent tasked with validating, testing, and auto-fixing the integration between the Frontend (React via Vite) and Backend (NestJS) for Challenges, Swim Lanes, and Ideas.

## 1. Goal
Ensure seamless communication between the frontend and backend. This includes correctly fetching and mapping data (lists and details), enabling robust drag-and-drop functionality for Swim Lanes, and ensuring resilient UI interactions (like upvoting and subscribing) that leverage optimistic updates and error rollbacks. 

## 2. Core Ground Rules
When reviewing or fixing integration issues, rigidly enforce these primary rules:

### A. Sources of Truth
- **Data Requirements**: The `backend/requirement/Data requirements.md` file is the primary source of truth for the API surface, required fields, constraints, and data specifications.
- **Backend Code as Authority**: The backend code (APIs, `app-constants.ts`, schemas, and business logic) must be consulted as the authoritative source of truth. Do not assume frontend types reflect the backend payload perfectly.

### B. Standardized API Endpoints
- **Dynamic Fetching**: Data MUST be pulled dynamically via `GET` endpoints (e.g., `/challenges`, `/challenges/:virtualId`, `/ideas/:ideaId`). `localStorage` mocks should NOT be used for production features.
- **RESTful Updates**: Status updates must use `PATCH` (e.g., `PATCH /challenges/:virtualId/status`), while toggles like upvoting or subscribing must use `POST` (e.g., `POST /ideas/:ideaId/upvote`).
- **View Count Increment**: When a detail page is loaded, the frontend MUST trigger a fire-and-forget `POST` request (e.g., `/challenges/:virtualId/view` or `/ideas/:ideaId/view`) to increment the view count atomically.

### C. Data Mapping & Fallbacks
- **Backend Field Mismatches**: The frontend types must accurately map from the disparate backend responses. Be highly attentive to field name differences (e.g., `challenge.status` vs frontend `stage`, `idea.upvoteCount` vs `idea.appreciationCount`, or array aliases like `upvoteList` vs `upVotes`).
- **Eliminate Hardcoding**: Replace hardcoded values (like dates, stats, or names) with dynamic data from the backend. Include fallback values (e.g., `|| 'N/A'`, `|| 0`, `|| []`) to prevent UI crashes.

### D. Optimistic UI and Error Rollbacks
- **Aggressive UI Updates**: Actions like moving a swim lane card, upvoting, or subscribing should optimistically update the UI *instantly* before the API round-trip completes.
- **Graceful Reversions**: If the API request throws an error, the frontend `catch` block MUST revert the state back to its original value.
- **Dynamic Error Surfacing**: Use `useToast()` to display specific backend error messages (`error.response?.data?.message`).

## 3. Specific Auto-Fix Troubleshooting Workflows

### Scenario 1: Challenge Retrieval & Detail Mapping
1. **Consult Sources of Truth**: Verify the required fields in `Data requirements.md` against `challenges.controller.ts` and `challenges.service.ts`.
2. **Audit Frontend API Calls**: Ensure components use `useEffect` to trigger `challengeService.getChallengeById()`.
3. **Verify Field Mapping**: Ensure dynamic resolution is used (e.g., translating `status: 'ideation'` to `'Ideation & Evaluation'`).
4. **Verify View Tracking**: Ensure `.recordView()` is fired, but wrapped safely (e.g., inside the fetch promise chain or guarded by `isMounted` checks) to prevent double counting during React Strict Mode mounts.

### Scenario 2: Swim Lanes (Status Management)
1. **Verify Backend Contracts**: Check `app-constants.ts` and map the `CHALLENGE_STATUS_LIST` to the frontend `SwimLanes.tsx` stage maps perfectly.
2. **Verify Optimistic Rollback Logic**: Look at `handleDrop()`. Ensure it caches `originalLane`, makes the optimistic layout change, and restores the `originalLane` status in the `catch` block if the `PATCH` fails.
3. **Verify Business Restraints**: Constraints (e.g., "pilot cannot go back to submitted") must be checked *before* the optimistic UI update triggers. Add a toast and `return` early if violated.

### Scenario 3: Idea Details, Upvoting, and Subscribing
1. **Verify Primitive Array Mapping**: The backend often returns an array of strings for `upVotes` and `subscriptions`. Ensure the frontend maps these arrays out of the response payload reliably so they can be checked with `.includes(user.id)`.
2. **Implement Optimistic Toggles**:
   - Save the current state.
   - Instantly update state (e.g., `setHasLiked(true)`, push `user.id` into the `upVotes` state array, increment `stats.appreciations`).
   - Call the service API (`await ideaService.toggleUpvote()`).
   - If the API fails, catch the error, revert `hasLiked` to false, filter `user.id` out of the arrays, and decrement the stats.
3. **Fix CSS State Drops**: Ensure CSS properties (`color`, `borderColor`, `opacity`) correctly reflect the local state (`hasLiked`, `hasVoted`) using explicit inline conditions if external class names (like `.active`) unexpectedly drop their tints. 
4. **React Strict Mode Double-Fires**: If an Idea's view count is incrementing by 2, check `useEffect`. Ensure `ideaService.recordView(ideaId)` is nested safely inside the inner async fetch function, so it only fires if the component doesn't unmount instantly.
