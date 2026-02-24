name: INTEGRATION_AGENT
description: Instructions for validating and auto-fixing backend-to-frontend integration for Challenge, Idea, and Notification features
---

# Global Integration Agent Instructions

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

### Scenario 4: Challenge and Idea Creation Forms
1. **Match Backend Enums Exactingly**: Forms must use the exact string casing and spacing defined in `app-constants.ts` (e.g. `3-6 months` and not `3-6-months`).
2. **Payload Property Matching (DTO vs Schema)**: 
   - Know the difference between the API definitions (`CreateIdeaDto` expects `owner`, `linkedChallenge`) and the Database specifications (Mongoose `IdeaSchema` requires `userId`, `challengeId`).
   - **Backend Fix Strategy**: Update backend services to map the incoming DTO fields to the Schema's required fields (e.g. `const userId = dto.owner;`) so that `ValidationPipe` stripping mechanics (`whitelist: true`) don't break the database payload.
   - For linking endpoints (like attaching an Idea to a Challenge), ALWAYS pass the parent's MongoDB `_id`, not the `virtualId` (e.g. `CH-0001`), because backend referencing methods usually query against the ObjectID.
3. **Handle Redirection on Success**: Verify the API response closely before routing. If the backend returns `ideaId`, checking `response.data.idea.virtualId` will fail. Missing this causes silent fallback bugs like an unintentional page reload instead of a redirect.
4. **Backend Response Enrichment**: After a `POST` creation, ensure the backend service passes the newly saved document through its `.enrich...([saved.toObject()])` method before returning it. If you return the raw `saved` document, the frontend will receive missing derived fields (e.g. `ownerDetails` will be empty, rendering "Unknown User" upon redirect).
   - Dynamic Error Handling: Capture the literal backend string responses within the `catch` block (`error.response?.data?.message`) and render them out to the UI using Toasts to instantly reflect backend data constraints (min lengths, missing fields, enum mismatches, etc).

### Scenario 5: Notification Routing & Redirection
1. **Understand Derived Routing**: The backend `NotificationsService` does not expect the frontend to resolve entity IDs. It returns a `linkedEntityDetails` object:
   - `virtualId`: The human-readable ID (`CH-001` or `ID-0001`).
   - `type`: Discriminator (`CH` or `ID`).
   - `challengeVirtualId`: For Ideas, this is the **parent challenge's** virtual ID, resolved by the backend.
2. **Handle Nested Path Construction**: In `notificationService.ts`, always check for the presence of `linkedEntityDetails`:
   - If `type === 'ID'`, build the path: `/challenges/${challengeVirtualId}/ideas/${virtualId}`.
   - If `type === 'CH'`, build the path: `/challenges/${virtualId}`.
   - Fallback to `fk_id` based routing only if derived fields are missing.
3. **Backend Enrichment Logic**: When debugging notification links, check `notifications.service.ts`:
   - It must perform a Mongo lookup on the Ideas/Challenges collections using `fk_id`.
   - For Ideas, it must perform a *secondary* lookup to find the `challengeId` and then fetch that challenge's `virtualId`.
4. **DTO & Swagger Parity**: If the frontend receives `undefined` for routing fields, verify `notification-response.dto.ts`. The `linkedEntityDetails` property must be explicitly decorated with `@ApiProperty()` to ensure NestJS serializes it and Swagger documents it correctly.

### Scenario 6: Activity and Notification Logic Integration
1. **Understand Tracking vs Notification**: *Activities* are logged for the user *performing* the action. *Notifications* are dispatched to *other* users affected by the action (e.g., subscribers, owners).
2. **Prevent Self-Notifications**: Always ensure the `dispatchToMany` method in the backend `NotificationsService` filters out the initiator user ID. No user should receive a notification for an action they performed themselves.
3. **Handle Subscription Propagation**: 
   - When users create, upvote, or comment on a Challenge, they must be added to the Challenge `subcriptions` array.
   - When users create, upvote, or comment on an Idea, they must be added to the Idea `subscription` array AND the parent Challenge `subcriptions` array.
4. **Backend Payload Interception**: The `create` and `update` logic within `ChallengesService`, `IdeasService`, and `CommentsService` are responsible for instantiating the respective `ActivitiesService` and `NotificationsService` singletons. 
   - **Important**: When tracking entity-related events, pass the MongoDB ObjectId (`_id`) as the `fk_id`, not the `virtualId`. 
   - For `log_in` and `log_out` tracking, the `fk_id` is null, and only the `userId` is recorded.
   - When deleting an entity (e.g., a Challenge or Idea), ensure you also delete the associated Activity logs using `deleteByFkId` to avoid orphaned records. Notification `fk_id` can be set to `null` to indicate a deleted entity.
5. **Frontend Logout Hook**: Ensure `AuthContext` calls the backend `/auth/logout` endpoint *before* clearing the local storage and state, passing the correct `userId` in the payload for proper `log_out` activity generation.

#### Reference Matrix: Enforced Activity & Notification Logic

| Action / Event | Service | Activity Logged For | Notification Sent To | Exception/Notes |
| :--- | :--- | :--- | :--- | :--- |
| **User Login** | `AuthService` | Current User | None | |
| **User Logout** | `AuthService` | Current User | None | Requires active frontend `/auth/logout` hook. |
| **Challenge Created** | `ChallengesService`| Current User | All Users | Initiator (creator) is naturally excluded. |
| **Challenge Edited** | `ChallengesService`| Current User | Owner + Subscribers | Initiator is excluded. |
| **Challenge Status Updated** | `ChallengesService`| Current User | Owner + Subscribers | Initiator is excluded. |
| **Challenge Upvoted** | `ChallengesService`| Current User | Owner + Subscribers | Initiator is excluded. |
| **Challenge Subscribed** | `ChallengesService`| Current User | Owner + Subscribers | Initiator is excluded. |
| **Challenge Deleted** | `ChallengesService`| None | Owner + Subscribers | Initiator is excluded. Activity record is deleted. |
| **Idea Created** | `IdeasService` | Current User | All Users | Initiator excluded. Automatically subscribes creator to parent Challenge. |
| **Idea Edited** | `IdeasService` | Current User | Idea Owner + Idea Subs + Parent Challenge Owner + Parent Challenge Subs | Initiator excluded. |
| **Idea Upvoted** | `IdeasService` | Current User | Same as Idea Edited | Initiator excluded. |
| **Idea Subscribed** | `IdeasService` | Current User | Same as Idea Edited | Initiator excluded. |
| **Idea Deleted** | `IdeasService` | None | Same as Idea Edited | Initiator excluded. Activity record is deleted. |
| **Challenge Commented** | `CommentsService`| Current User | Challenge Owner + Challenge Subscribers | Initiator excluded. Automatically subscribes commenter to Challenge. |
| **Idea Commented** | `CommentsService`| Current User | Idea Owner + Idea Subs + Parent Challenge Owner + Parent Challenge Subs | Initiator excluded. Automatically subscribes commenter to Idea & Challenge. |
