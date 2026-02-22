# Home API Implementation Specification

This document details the step-by-step implementation logic for the Home domain API endpoints, adhering to the business requirements (`Data requirements.txt`) and Swagger (`swagger.yaml`). This logic is heavily reliant on Shared Business Logic (SBL) from the Metrics domain.

## Endpoints

### 1. GET `/home/top-challenges`
- **Summary**: Get top 5 challenges.
- **Implementation Steps**:
  1. Query `Challenge` collection to calculate a combined `score` for each challenge.
  2. Score formula: `$size` of `upVotes` array + `viewCount`.
  3. Sort by computed score descending.
  4. Limit to 5 results.
  5. Apply **Common Aggregation Logic** to populate `ownerDetails`.
  6. Return `200 OK` matching the schema structure.

### 2. GET `/home/status-distribution`
- **Summary**: Get challenge count by status.
- **Implementation Steps**:
  1. Re-use **[SBL-STATUS-DISTRIBUTION]** from `Metrics.funnel`.
  2. Aggregation on `Challenge` to group by `status` and count.
  3. Return `200 OK`.

### 3. GET `/home/key-metrics`
- **Summary**: Get key metrics summary.
- **Implementation Steps**:
  1. `pilotRate`: Same definition as `averageTimeToPilot` in `Metrics.summary`.
  2. `conversionRate`: Same definition as `Metrics.summary`.
  3. `targetConversionRate`: Hardcoded to 50.
  4. Return `200 OK`.

### 4. GET `/home/monthly-throughput`
- **Summary**: Get monthly throughput.
- **Implementation Steps**:
  1. Re-use **[SBL-MONTHLY-THROUGHPUT]** from `Metrics.innovation-velocity`.
  2. Apply the exact same aggregation logic but slice the array to only return the 6 most recent months (instead of 12).
  3. Return `200 OK`.

### 5. GET `/home/innovation-team`
- **Summary**: Get innovation team members.
- **Implementation Steps**:
  1. Query `User.find({ role: "MEMBER" })` (**[SBL-USER-COUNT-BY-ROLE]**).
  2. For each matched user, apply **Common Aggregation Logic** from the User domain to fetch derived counts (`challengeCount`, `totalIdeaCount`, `commentCount`).
  3. Return `200 OK`.
