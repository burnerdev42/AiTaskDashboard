# Runbook: Dashboard Home Integration

This runbook provides technical instructions for AI agents and developers to integrate, update, or debug the Dashboard Home page panels (Top Challenges, Pipeline Summary, Key Metrics, Monthly Throughput, Success Stories, and Innovation Team).

## 1. Core Integration Principles

### A. The "Double-Warping" Response Trap
The backend uses a `TransformInterceptor` which wraps all responses in an `ApiResponse` envelope. However, if a controller (like `HomeController`) uses `AbstractController.success()`, it may lead to a double-wrapped structure:
- **Payload Structure**: `response.data.data` (for single objects) or `response.data.data.challenges` (for lists).
- **Verification**: Always inspect the Network tab. If a section shows "No Data" but the API is successful, check if the frontend is accessing `.data` when it should be `.data.data`.

### B. Mongoose Lean Queries & Derived Fields
The `HomeController` often uses `.lean()` for performance.
- **Pitfall**: Lean results are POJOs, not Mongoose documents. Ensure that derived fields (like `ownerDetails`) are manually populated in the service layer before returning.
- **Frontend Mapping**: Use `challengeMapper.ts` to transform backend field names (e.g., `upvoteCount`) to frontend state keys (e.g., `votes`).

### C. Robust Aggregation for Time-Series
When fetching "Monthly Throughput" or "Velocity" data:
- **Avoid Legacy Field Dependency**: Do not rely on `month` or `year` fields stored in the document.
- **Use Date Operators**: Use MongoDB `$year` and `$month` operators on the `createdAt` field directly within the aggregation pipeline to handle legacy/seed data missing derived fields.

## 2. Component-Specific Workflows

### Scenario 1: Success Stories & Grid UX
1. **API Call**: Use `challenges/status/completed`.
2. **Scrollbar Awareness**: Ensure the `.stories-grid` has `overflow-x: auto` and a **visible** scrollbar (`::-webkit-scrollbar` must not be `display: none`). 
3. **Truncation Check**: If only 3 stories are visible, check if `min-width` on cards is pushing them off-screen without a scrollbar, rather than an API limit.

### Scenario 2: Innovation Team (Admin + Member)
1. **Role Filtering**: The team must include both `ADMIN` and `MEMBER` roles.
2. **Frontend Rendering**:
   - **Do Not Prepend**: Avoid manually unshifting "Current User" into the list. Render exactly what the backend returns.
   - **Dynamic Scores**: Generate a placeholder `innovationScore` (`Math.floor(Math.random() * 50) + 10`) if the backend does not provide one.

### Scenario 3: Key Metrics (Daily/Rate Units)
1. **Unit Conversion**: The backend calculates `averageTimeToPilot` in milliseconds by default. Ensure the backend service converts this to **Days** (divide by `1000 * 60 * 60 * 24`) before returning.
2. **Lean Property Access**: For lean aggregation results, use optional chaining (`res[0]?.pilotRate`) to avoid 500 errors when no data matches the pipeline.

## 3. Verification Steps

1. **Backend Logs**: Run the backend with `npm run start:dev`. Verify console logs for any aggregation stage failures (indicated by `[]` results).
2. **Frontend Console**: Check for `undefined` mapping errors in `Home.tsx`.
3. **Browser Testing (Subagent)**:
   - Verify that horizontal scrolling works for Success Stories.
   - Verify that the Innovation Team displays multiple cards.
   - Verify the "Monthly Throughput" chart reflects the last 6 months.

## 4. Shared Business Logic (SBL) References
- **[SBL-STATUS-DISTRIBUTION]**: `HomeService.getStatusDistribution` == `MetricsService.getFunnel`.
- **[SBL-MONTHLY-THROUGHPUT]**: `HomeService.getMonthlyThroughput` == `MetricsService.getVelocity` (sliced to 6).
- **[SBL-USER-COUNT-BY-ROLE]**: `HomeService.getInnovationTeam` filters for `ADMIN` + `MEMBER`.
