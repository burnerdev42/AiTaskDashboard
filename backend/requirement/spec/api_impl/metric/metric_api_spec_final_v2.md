# Metric API Implementation Specification — v2

> **Source:** `Data requirements.txt`, `swagger.yaml`
> **Replaces:** `metric_api_spec_final_v1.md`

---

## Notes
Metrics are fully **derived** — no dedicated DB collection. All data is computed in real-time via MongoDB aggregation pipelines.

---

## Endpoints

### `GET /metrics/summary`
Returns top-level dashboard metrics:
1. `totalChallenges`: Count from Challenge collection.
2. `totalIdeas`: Count from Idea collection.
3. `conversionRate`: `(completed challenges / total challenges) * 100`. Target: 50%.
4. `averageTimeToPilot`: Average of `(timestampOfStatusChangedToPilot - createdAt)` across challenges that have reached "In Pilot".
5. `activeContributions`: Count of unique user IDs across all challenges and ideas.
6. `totalUsers`: Count from User collection.

### `GET /metrics/innovation-funnel`
1. `totalChallenges`: Count from Challenge collection.
2. `totalIdeas`: Count from Idea collection.
3. `challengesByStatus`: Group Challenge collection by `status`, return count per status.
4. `conversionRate`: Calculated as above.
5. `targetRate`: Hardcoded `50`.

### `GET /metrics/team-engagement`
1. `challengesByPlatform`: Group Challenge collection by `platform`, return count per platform.
2. `heatmap`: Static/hardcoded heatmap data.

### `GET /metrics/portfolio-balance`
1. `challengesByPortfolioLane`: Group Challenge collection by `portfolioLane`, return count per lane.

### `GET /metrics/innovation-velocity`
1. Group challenges and ideas by month for the last 12 months.
2. Return array of `{ month, challenges, ideas }`.

### `GET /metrics/opco-radar`
1. Group Challenge collection by `opco`, return count per opco.

### `GET /metrics/home`
1. `topChallenges`: Top 5 challenges sorted by `(upVotes.length + viewCount)` descending.
2. `pieChart`: Challenge count grouped by `status`.
3. `keyMetrics`: Same as summary metrics.
4. `monthlyThroughput`: Challenges and ideas grouped by month for last 6 months.
5. `successStories`: Hardcoded.
6. `innovationTeam`: Users with role `MEMBER` or `ADMIN` (lab users).
