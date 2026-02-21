# Metric & Home API Implementation Specification

This document details the step-by-step implementation logic for the analytical and dashboard endpoints as defined in `Data requirements.txt`. All endpoints below are read-only (`GET`) and rely heavily on MongoDB Aggregation Pipelines to compute derived values in real-time.

## 1. Metrics Endpoints (Prefix: `/metrics`)

These endpoints power the distinct blocks found in the metric dashboard UI.

### 1.1 GET `/metrics/summary`
- **Block**: Top Metric Summary
- **Implementation Steps**:
  1. **Total Challenges**: `const totalChallenges = await Challenge.countDocuments();`
  2. **Total Ideas**: `const totalIdeas = await Idea.countDocuments();`
  3. **Total Users**: `const totalUsers = await User.countDocuments();`
  4. **Conversion Rate & Target Rate**:
     - `const completedChallenges = await Challenge.countDocuments({ status: 'Completed' });` // Adjust status string to exact swimlane enum
     - Calculation: `totalChallenges > 0 ? parseFloat(((completedChallenges / totalChallenges) * 100).toFixed(2)) : 0`
     - **Target Rate**: Hardcoded to `50`.
  5. **Average Time to Pilot**:
     - Query challenges where `timestampOfStatusChangedToPilot` exists (`$ne: null`).
     - Iterate through results, subtracting `createdAt` from `timestampOfStatusChangedToPilot` to get durations in days.
     - Calculate the arithmetic mean of these durations.
  6. **Active Contributions**:
     - The sum of all active contribution events.
     - Query `Activity.countDocuments({ type: { $in: ['challenge_created', 'idea_created', 'challenge_commented', 'idea_commented', 'challenge_upvoted', 'idea_upvoted'] } })`.
  7. Return JSON payload aggregating the above 6 values.

### 1.2 GET `/metrics/funnel`
- **Block**: Innovation Funnel
- **Implementation Steps**:
  1. Fetch `totalChallenges` and `totalIdeas` (same as 1.1).
  2. **Challenges by Swim Lane**:
     - MongoDB Aggregation on `Challenge`: `[{ $group: { _id: "$status", count: { $sum: 1 } } }]`.
     - Output as a map/dictionary of `{ [status]: count }`.
  3. Fetch `conversionRate` (same as 1.1) and include the hardcoded `targetRate` of `50`.
  4. Return JSON payload.

### 1.3 GET `/metrics/team-engagement`
- **Block**: Team Engagement
- **Implementation Steps**:
  1. **Challenges Group by Platform**:
     - Aggregation: `[{ $group: { _id: "$platform", count: { $sum: 1 } } }]`.
  2. Format output array mapping `_id` to platform name and its corresponding count.
  3. *(Note: Heatmap logic remains static per user requirements).*

### 1.4 GET `/metrics/portfolio-balance`
- **Block**: Portfolio Balance
- **Implementation Steps**:
  1. **Challenge Count by Portfolio Lane**:
     - Aggregation: `[{ $group: { _id: "$portfolioLane", count: { $sum: 1 } } }]`.
  2. Format and return array.

### 1.5 GET `/metrics/innovation-velocity`
- **Block**: Innovation Velocity
- **Implementation Steps**:
  1. **Ideas Last 12 Months**:
     - Calculate the Date 12 months ago from today.
     - Query `Idea.aggregate`:
       - `$match`: `createdAt` >= 12 months ago.
       - `$group`: by `{ year: "$year", month: "$month" }`, summing counts.
       - `$sort`: chronologically by year, then month.
  2. Return formatted time-series array (e.g., `[{ "month": "Jan", "count": 12 }, ...]`).

### 1.6 GET `/metrics/opco-radar`
- **Block**: OpCo Radar
- **Implementation Steps**:
  1. **Challenge Count by OpCo**:
     - Aggregation: `[{ $group: { _id: "$opco", count: { $sum: 1 } } }]`.
  2. Return array mapped for radar chart visualization.

---

## 2. Home Endpoints (Prefix: `/home`)

These endpoints power the distinct blocks found on the main user Home tracking dashboard.

### 2.1 GET `/home/top-challenges`
- **Block**: Slider (Top 5 Challenges by Upvotes + Views)
- **Implementation Steps**:
  1. Query `Challenge` using aggregation to project a new `totalScore` field, which is the sum of the length of the `upVotes` array and the `viewCount` field (e.g., `{ $add: [{ $size: "$upVotes" }, "$viewCount"] }`).
  2. `$sort` by `totalScore` in descending order (`-1`).
  3. `$limit` to `5`.
  4. Return the array of minimal challenge objects.

### 2.2 GET `/home/challenges-by-status`
- **Block**: Pie Chart
- **Implementation Steps**:
  1. Similar to `funnel` map, aggregate `Challenge` grouping by `status` counting totals.
  2. Return formatted array for pie charts (e.g., `[{ id: 'Draft', value: 10 }]`).

### 2.3 GET `/home/key-metrics`
- **Block**: Key Metrics
- **Implementation Steps**:
  1. Calculate `Pilot Rate`: `parseFloat(((Challenges in 'Pilot' status / Total Challenges) * 100).toFixed(2))`.
  2. Calculate `Conversion Rate`: `parseFloat(((Challenges in 'Completed' status / Total Challenges) * 100).toFixed(2))`.
  3. Include `Target Rate`: Hardcoded to `50`.
  4. Return all three percentages.

### 2.4 GET `/home/monthly-throughput`
- **Block**: Monthly Throughput
- **Implementation Steps**:
  1. Utilize the same logic as `/metrics/innovation-velocity` but `$match` limit boundaries to the **last 6 months** instead of 12.
  2. Return exact time-series array.

### 2.5 GET `/home/success-stories`
- **Block**: Success Stories
- **Implementation Steps**:
  1. Query a static JSON payload or a future `SuccessStory` database. For now, hardcode response returning an array of pre-approved spotlight stories.

### 2.6 GET `/home/innovation-team`
- **Block**: Innovation Team
- **Implementation Steps**:
  1. **Identify Lab Users**: The spec dictates "users marked as lab users". Assuming this maps to users with a specific `companyTechRole` (e.g., "Data Scientist") or a specialized `Role` string if newly added.
  2. Query `User.find({ /* lab user criteria */ })`.
  3. For each lab user, execute concurrent aggregate counts:
     - `ideasCount`: `Idea.countDocuments({ userId: labUser._id })`
     - `challengesCount`: `Challenge.countDocuments({ userId: labUser._id })`
     - `commentCount`: `Comment.countDocuments({ userId: labUser._id })`
  4. Return an array of these highly derived user profile objects.
