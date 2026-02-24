# Metrics Integration Runbook

This runbook documents the architecture, common pitfalls, and auto-fix strategies for integrating the dedicated `/metrics` page. It serves as an instruction set for AI agents configuring or troubleshooting the Metrics dashboard.

## 1. Backend Service & API Structure

The metrics backend (`MetricsService` and `MetricsController`) computes 7 distinct analytical endpoints using MongoDB aggregations (`$group`, `$sum`, `$match`, etc.). 

**API Requirements:**
The backend must wrap the payload in a specific `ApiResponse` pattern containing the `domainKey` inside the `data` object:

```json
{
  "status": "success",
  "message": "Metrics ... retrieved successfully",
  "data": {
    "summary": { // Domain Key (e.g., summary, funnel, opcoRadar)
       "totalChallenges": 21
    }
  },
  "timestamp": "..."
}
```

*Agent Warning*: Do not return naked objects from the controller. If the frontend expects `response.data.summary.totalChallenges`, returning just `{ totalChallenges: 21 }` from the controller will result in a `TypeError: Cannot read properties of undefined` on the frontend.

## 2. Frontend Axios Service Configuration

**CRITICAL FIX**: Frontend API calls MUST use the configured Axios instance exported from `src/services/api.ts` (which natively prepends `import.meta.env.VITE_API_URL` or `http://localhost:3000/api/v1` and attaches the user's Bearer token).

Do NOT use relative paths like `axios.get('/api/v1/metrics/summary')` in new service files (e.g., `metrics.service.ts`). This often causes the Vite SPA server to intercept the request and return the HTML payload of `index.html` instead of the JSON payload, silently breaking all downstream JSON mapping.

**Correct Usage:**
```typescript
import { api } from './api';

export const metricsService = {
  getSummary: async () => {
    const response = await api.get('/metrics/summary');
    return response.data; // Strips Axios envelope, leaving { status, data: { summary: {...} } }
  }
}
```

## 3. Asynchronous Component Loading (`Metrics.tsx`)

The dashboard features 6 complex Recharts graphics and a top KPI strip. 

1. **State Initialization**: Initialize empty/null states for all 7 payloads.
2. **Concurrent Fetching**: Use a single `useEffect` with `Promise.all` or sequential awaits to fetch all 7 endpoints on mount.
3. **Data Unboxing**: Because of the backend format, extract data explicitly:
   `setSummaryData(summaryRes.data.summary);`
4. **Loading States**: Display skeleton loaders over all charts as long as `isLoading` is true.

## 4. UI Overflow & CSS Grid Restraints

When rendering dynamic user data (e.g., Platform names, OpCo names) inside confined dashboard cards (like the Platform Leaderboard or Innovation Funnel labels), raw text will overflow, wrap, and overlap interactive elements (like progress bars).

**Auto-Fix Strategy for Dashboard Charts:**
Do not allow raw text bridging. Enforce `text-overflow: ellipsis` on grid/flex row labels.

```css
.lb-name { /* The label container */
  width: 140px; /* Require a fixed or min dimension */
  flex-shrink: 0;
  white-space: nowrap; /* Prevent newline wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Inject ... */
}
```

**Tooltip Fallback**: Whenever applying ellipsis truncation, ALWAYS add the raw string data to the HTML native `title` attribute so users can hover to see the full value:
`<span className="lb-name" title={platform.name}>{platform.name}</span>`

## 5. List of Endpoints

For quick reference, the 7 required endpoints are:
1. `GET /metrics/summary`: Executive KPIs (totals, conversion target)
2. `GET /metrics/throughput`: Alias for velocity.
3. `GET /metrics/funnel`: Challenges aggregated by status (Submitted -> Archive).
4. `GET /metrics/team-engagement`: Challenge count by platform (Leaderboard).
5. `GET /metrics/portfolio-balance`: Challenges mapped to strategic portfolio lanes (Scatter Plot).
6. `GET /metrics/innovation-velocity`: 12-month trailing ideas/challenges array (Line Chart).
7. `GET /metrics/opco-radar`: OpCo group engagement (Radar Chart).
