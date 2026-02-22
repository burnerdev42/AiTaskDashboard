# Metric API Implementation Specification

This document details the step-by-step implementation logic for the Metric domain API endpoints, adhering to the business logic (`Data requirements.txt`) and the API Swagger documentation (`swagger.yaml`). There are no direct DB models for metrics as all data is derived via aggregation from other collections.

## Endpoints

### 1. GET `/metrics/summary`
- **Summary**: Get top metric summary.
- **Implementation Steps**:
  1. Calculate `totalChallenges`: `Challenge.countDocuments()`.
  2. Calculate `totalIdeas`: `Idea.countDocuments()`.
  3. Calculate `conversionRate`: Percentage `(Challenge.countDocuments({ status: "completed" }) / totalChallenges) * 100`. (Handle divide-by-zero).
  4. Static `targetConversionRate`: Hardcoded to 50.
  5. Calculate `averageTimeToPilot`: 
     - Query challenges where `timestampOfStatusChangedToPilot` is `{$ne: null}`.
     - For each, difference in days = `(timestampOfStatusChangedToPilot - createdAt) / (1000 * 60 * 60 * 24)`.
     - Average = Sum of differences / count.
  6. Calculate `activeContributions`: `Activity.countDocuments({ type: { $in: ['challenge_created', 'idea_created', 'challenge_upvoted', 'idea_upvoted', 'challenge_commented', 'idea_commented'] } })`.
  7. Calculate `totalUsers`: `User.countDocuments()`.
  8. Return `200 OK` matching the schema structure.

### 2. GET `/metrics/funnel`
- **Summary**: Get innovation funnel metrics.
- **Implementation Steps**:
  1. `totalChallenges`: `Challenge.countDocuments()`.
  2. `totalIdeas`: `Idea.countDocuments()`.
  3. `challengesBySwimLane`: **[SBL-STATUS-DISTRIBUTION]**
     - Aggregation on `Challenge`: `$group` by `status` and `$count`.
     - Output object mapping short codes to count (e.g. `{ "submitted": 10, ... }`).
  4. `conversionRate`: Same formula as Endpoint 1.
  5. `targetConversionRate`: Hardcoded to 50.
  6. Return `200 OK`.

### 3. GET `/metrics/team-engagement`
- **Summary**: Get team engagement metrics.
- **Implementation Steps**:
  1. `challengesByPlatform`: 
     - Aggregation on `Challenge`: `$group` by `platform` and `$count`.
     - Output object mapping platform to count.
  2. Return `200 OK`.

### 4. GET `/metrics/portfolio-balance`
- **Summary**: Get portfolio balance metrics.
- **Implementation Steps**:
  1. `challengesByPortfolioLane`:
     - Aggregation on `Challenge`: `$group` by `portfolioLane` and `$count`.
     - Output object mapping lane to count.
  2. Return `200 OK`.

### 5. GET `/metrics/innovation-velocity`
- **Summary**: Get innovation velocity metrics.
- **Implementation Steps**:
  1. **[SBL-MONTHLY-THROUGHPUT]**:
     - Determine last 12 months (including current).
     - Aggregation on `Challenge` grouped by `month` and `year` to count challenges.
     - Aggregation on `Idea` grouped by `month` and `year` to count ideas.
     - Merge into an array of objects `{ month, year, challenges, ideas }`.
     - Sort chronologically.
  2. Return `200 OK`.

### 6. GET `/metrics/opco-radar`
- **Summary**: Get opco radar metrics.
- **Implementation Steps**:
  1. `challengesByOpco`:
     - Aggregation on `Challenge`: `$group` by `opco` and `$count`.
     - Output object mapping opco to count.
  2. Return `200 OK`.
