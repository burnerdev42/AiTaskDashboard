# AI Task Dashboard — Data Requirements

> **Generated from:** `backend/requirement/Data requirements.txt` (Source of Truth)

---

## 0. Prerequisite: Hardcoded Constants

> These are **hardcoded constants** that must be present in backend code. They are used at runtime for **validation, enum constraints, and populating related fields** of domain entities (Challenge, Idea, User, etc.). These constants are **NOT stored in or fetched from the database**. It is assumed that the frontend code has the exact same constants.

### 0.1 OpCo (Operating Company)

| # | Value |
|---|-------|
| 1 | Albert Heijn |
| 2 | GSO |
| 3 | GET |
| 4 | BecSee |
| 5 | Other |

### 0.2 OpCo → Platform Mapping

Platforms are **linked to OpCo**. Each OpCo has its own platform list.

| OpCo | Platforms |
|------|-----------|
| Albert Heijn | STP, CTP, RTP |
| GSO | BFSI, Retail & CPG, Manufacturing, Life Sciences & Healthcare, Communications & Media, Technology & Services, Energy Resources & Utilities, Government & Public Services, Travel & Hospitality, Other |
| GET | *(same as GSO)* |
| BecSee | *(same as GSO)* |
| Other | *(same as GSO)* |

### 0.3 Portfolio Lanes

| # | Value |
|---|-------|
| 1 | Customer Value Driver |
| 2 | Non Strategic Product Management |
| 3 | Tech Enabler |
| 4 | Maintenance |

### 0.4 Swim Lane Status

Short codes are stored in DB; long codes are display labels.

| Short Code | Display Label |
|------------|--------------|
| `submitted` | Challenge Submitted |
| `ideation` | Ideation & Evaluation |
| `pilot` | POC & Pilot |
| `completed` | Scaled & Deployed |
| `archive` | Parking Lot |

### 0.5 Timeline

| # | Value |
|---|-------|
| 1 | 1-3 months |
| 2 | 3-6 months |
| 3 | 6-12 months |
| 4 | 12+ months |

### 0.6 Priority

| # | Value |
|---|-------|
| 1 | Critical |
| 2 | High |
| 3 | Medium |
| 4 | Low |

### 0.7 User Areas of Interest

| # | Value |
|---|-------|
| 1 | Customer Experience |
| 2 | Finance & Ops |
| 3 | Supply Chain |
| 4 | Product & Data |
| 5 | Manufacturing |
| 6 | Sustainability |
| 7 | Logistics |
| 8 | Retail Ops |
| 9 | HR & Talent |

### 0.8 User Roles (Auth Roles)

| # | Value |
|---|-------|
| 1 | ADMIN |
| 2 | MEMBER |
| 3 | USER |

### 0.8b Company Tech Roles

| # | Value |
|---|-------|
| 1 | Innovation Lead |
| 2 | AI / ML Engineer |
| 3 | IoT & Digital Twin Lead |
| 4 | Data Science Lead |
| 5 | Full-Stack Developer |
| 6 | UX / Design Lead |
| 7 | Product Manager |
| 8 | Cloud Architect |
| 9 | Data Engineer |
| 10 | DevOps Lead |
| 11 | Contributor |

### 0.9 User Statuses

| # | Value |
|---|-------|
| 1 | PENDING |
| 2 | APPROVED |
| 3 | BLOCKED |
| 4 | INACTIVE |

### 0.10 Activity Types (15 values)

| # | Value |
|---|-------|
| 1 | challenge_created |
| 2 | idea_created |
| 3 | challenge_status_update |
| 4 | challenge_edited |
| 5 | idea_edited |
| 6 | challenge_upvoted |
| 7 | idea_upvoted |
| 8 | challenge_commented |
| 9 | idea_commented |
| 10 | challenge_subscribed |
| 11 | idea_subscribed |
| 12 | challenge_deleted |
| 13 | idea_deleted |
| 14 | log_in |
| 15 | log_out |

### 0.11 Notification Types (12 values)

| # | Value |
|---|-------|
| 1 | challenge_created |
| 2 | challenge_status_update |
| 3 | challenge_edited |
| 4 | idea_edited |
| 5 | challenge_upvoted |
| 6 | idea_upvoted |
| 7 | challenge_commented |
| 8 | idea_commented |
| 9 | challenge_subscribed |
| 10 | idea_subscribed |
| 11 | challenge_deleted |
| 12 | idea_deleted |

### 0.12 Comment Types

| # | Value | Meaning |
|---|-------|---------|
| 1 | CH | Challenge |
| 2 | ID | Idea |

---

## 1. Challenge

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `title` | String | |
| 3 | `opco` | String | → `OPCO_LIST` |
| 4 | `platform` | String | → Value selected from `OPCO_PLATFORM_MAP[opco]` (stores the platform value, not the key) |
| 5 | `description` | String | Long text |
| 6 | `summary` | String | |
| 7 | `outcome` | String | |
| 8 | `timeline` | String | → `TIMELINE_OPTIONS` |
| 9 | `portfolioLane` | String | → `PORTFOLIO_LANES` |
| 10 | `priority` | String | → `PRIORITY_LEVELS` |
| 11 | `tags` | Array of String | Default `["ai"]` |
| 12 | `constraint` | String | |
| 13 | `stakeHolder` | String | Original spelling preserved |
| 14 | `virtualId` | String | Format: `CH-001` (001–999, programmatic) |
| 15 | `status` | String | → `SWIM_LANE_STATUS` (short codes only: `submitted`, `ideation`, `pilot`, `completed`, `archive`) |
| 16 | `userId` | String | Creator user ID (Mongo hex referencing User) |
| 17 | `createdAt` | DateTime | |
| 18 | `month` | Number | Integer, derived from `createdAt` |
| 19 | `year` | Number | Integer, derived from `createdAt` |
| 20 | `updatedAt` | DateTime | Initially same as `createdAt` |
| 21 | `upVotes` | Array of String | List of User IDs. Default `[]` |
| 22 | `subcriptions` | Array of String | List of User IDs. Default `[]` |
| 23 | `viewCount` | Number | Long |
| 24 | `timestampOfStatusChangedToPilot` | DateTime | Nullable (z1) |
| 25 | `timestampOfCompleted` | DateTime | Nullable (z2) |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `countOfIdeas` | Number | From Idea collection |
| 2 | `ownerDetails` | Object | Via `userId` from User collection |
| 3 | `contributorsDetails` | Array of Objects | Via contributor user IDs from User collection |
| 4 | `commentCount` | Number | From Comment collection |
| 5 | `ideaList` | Array of Objects | From Idea collection by challenge ID |
| 6 | `comments` | Array of Objects | From Comment collection |
| 7 | `contributors` | Array of Objects | Owner details of all ideas under challenge. Default `[]` |

### Constraints & Requirements
- Member management system and approval process for challenges; for now, hardcode members in DB among existing users.
- Timeline, portfolio, platform list, opco list are hardcoded. Later manageable by admin.
- Priority is always hardcoded.
- `PATCH /challenges/{virtualId}/status` — Requires `{ "status": "..." }` — Swim lane status change only.
- `POST /challenges/{virtualId}/upvote` — Requires `{ "userId": "..." }` — Toggle upvote.
- `POST /challenges/{virtualId}/subscribe` — Requires `{ "userId": "..." }` — Toggle subscription.
- Creator automatically becomes a subscriber.
- Any user submitting an idea automatically subscribes to the challenge.
- Any user upvoting or commenting on a challenge automatically subscribes to that challenge.

---

## 2. Idea

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `ideaId` | String | Format: `ID-0001` (0001–9999, programmatic) |
| 3 | `title` | String | |
| 4 | `description` | String | Idea Summary |
| 5 | `proposedSolution` | String | |
| 6 | `challengeId` | String | Link to Challenge collection |
| 7 | `appreciationCount` | Number | Upvote count (Long) |
| 8 | `viewCount` | Number | Long |
| 9 | `userId` | String | Creator Mongo Hex ID referencing User |
| 10 | `subscription` | Array of String | List of User IDs. Default `[]` |
| 11 | `createdAt` | DateTime | |
| 12 | `month` | Number | Integer, derived from `createdAt` |
| 13 | `year` | Number | Integer, derived from `createdAt` |
| 14 | `updatedAt` | DateTime | Initially same as `createdAt` |
| 15 | `status` | Boolean | Accepted/Declined. Default: `true` (Accepted) |
| 16 | `upVotes` | Array of String | List of User IDs. Default `[]` |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `challengeDetails` | Object | Fetched from Challenge DB by `challengeId` |
| 2 | `problemStatement` | String | Challenge description from Challenge DB |
| 3 | `commentCount` | Number | Calculated from Comment DB |
| 4 | `comments` | Array of Objects | Fetched from Comment DB |
| 5 | `ownerDetails` | Object | User details fetched via `userId` |

### Constraints & Requirements
- Moderator-based idea status — future implementation.
- `POST /ideas/{virtualId}/upvote` — Requires `{ "userId": "..." }` — Toggle upvote.
- `POST /ideas/{virtualId}/subscribe` — Requires `{ "userId": "..." }` — Toggle subscription.
- Creator subscribes to the idea and its parent challenge.
- Any user upvoting or commenting on an idea subscribes to that idea and its parent challenge.

---

## 3. Comment

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `userId` | String | Mongo Hex ID referencing User |
| 3 | `comment` | String | Text |
| 4 | `type` | String | → `["CH", "ID"]` (Challenge or Idea) |
| 5 | `createdat` | DateTime | |
| 6 | `typeId` | String | Either challenge ID or idea ID |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `userDetails` | Object | Fetched from User DB via `userId` |

---

## 4. User

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `name` | String | |
| 3 | `opco` | String | → `OPCO_LIST` |
| 4 | `platform` | String | → Value selected from `OPCO_PLATFORM_MAP[opco]` (stores the platform value, not the key) |
| 5 | `companyTechRole` | String | → `COMPANY_TECH_ROLES` |
| 6 | `email` | String | Unique Identifier |
| 7 | `password` | String | Encrypted string |
| 8 | `interestAreas` | Array of String | → `INTEREST_AREAS`. Default `[]` |
| 9 | `role` | String | → `AUTH_ROLES` (`ADMIN` \| `MEMBER` \| `USER`) |
| 10 | `createdAt` | DateTime | |
| 11 | `updatedAt` | DateTime | |
| 12 | `status` | String | → `USER_STATUSES` (`PENDING` \| `APPROVED` \| `BLOCKED` \| `INACTIVE`) |
| 13 | `innovationScore` | Number | Integer, 1–999 |
| 14 | `upvotedChallengeList` | Array of String | List of Challenge IDs. Default `[]` |
| 15 | `upvotedAppreciatedIdeaList` | Array of String | List of Idea IDs. Default `[]` |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `upvoteCount` | Number | Sum of upvotes on challenges + ideas submitted by user |
| 2 | `recentActivity` | Array of Objects | Top 3 from Activity DB, sorted by timestamp |
| 3 | `recentSubmission` | Array of Objects | Top 5 from Activity DB, types: `challenge_created` or `idea_created` |
| 4 | `contributionGraph` | Object/Map | Map of String (Month) to Long (Count) from Activity DB. Last 6 months. |
| 5 | `commentCount` | Number | Total comments from Comment DB |
| 6 | `challengeCount` | Number | Total challenges created from Challenge DB |
| 7 | `totalIdeaCount` | Number | Total ideas created from Idea DB |

---

## 5. User Activity

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `type` | String | → `ACTIVITY_TYPES` (15 values) |
| 3 | `fk_id` | String | Nullable. ID of related entity; null for login/logout |
| 4 | `userId` | String | User Hex ID |
| 5 | `createdAt` | DateTime | |
| 6 | `month` | Number | Integer, derived from `createdAt` |
| 7 | `year` | Number | Integer, derived from `createdAt` |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `userDetails` | Object | Fetched via `userId` |
| 2 | `entityDetails` | Object | Fetched via `fk_id` based on Type (Challenge or Idea) |
| 3 | `activitySummary` | String | Human-readable string combining Type + Entity Details |

---

## 6. Notification

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `type` | String | → `NOTIFICATION_TYPES` (12 values) |
| 3 | `fk_id` | String | Nullable. ID of linked entity |
| 4 | `userId` | String | Recipient Mongo Hex ID (Not the initiator) |
| 5 | `initiatorId` | String | Mongo Hex ID of the user who triggered the notification |
| 6 | `createdAt` | DateTime | |
| 7 | `isSeen` | Boolean | Default: `false` |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `description` | String | Dynamically generated from Type + initiatorDetails.name |
| 2 | `linkedEntityDetails` | Object | Details of Challenge or Idea fetched via `fk_id` |
| 3 | `recipientDetails` | Object | User details fetched via `userId` |
| 4 | `initiatorDetails` | Object | User details fetched via `initiatorId` (UserMinimal) |

### Constraints & Requirements
- `PATCH /notifications/{id}/status` — Requires `{ "isSeen": true }` — Update isSeen.

### Notification Recipient Logic
- `challenge_created`: All users (except initiator)
- `challenge_status_update` / `edited`: All challenge subscribers (except initiator)
- `idea_created` / `idea_edited`: All idea subscribers + Challenge owner + Challenge subscribers (except initiator)
- `challenge_upvoted` / `commented` / `subscribed` / `deleted`: All challenge subscribers + Challenge owner (except initiator)
- `idea_upvoted` / `commented` / `subscribed` / `deleted`: All idea subscribers + Challenge owner + Challenge subscribers (except initiator)

---

## 7. Metrics & Dashboard (All Derived)

### Top Metric Summary
- Total challenges, Total ideas, Conversion rate (completed/total, target 50%), Average time to pilot, Active contributions, Total users

### Innovation Funnel
- Total challenges, Total ideas, Challenges by swim lane count, Conversion rate + Target rate (50%)

### Team Engagement
- Challenges grouped by platform, Static heatmap

### Portfolio Balance
- Challenge count by portfolio lane

### Innovation Velocity
- Total challenges and ideas for the last 12 months

### OpCo Radar
- Challenge count by opco

### Home View
- Top 5 challenges slider (upvotes + views), Pie chart (by status), Key metrics, Monthly throughput (6-month subset), Success stories (hardcoded), Innovation team (lab users)

### What's Next
- Hardcoded in UI

---

## 8. Authentication & Registration

- `POST /auth/register` — Accepts full User profile payload. Password hashed via bcrypt. Returns 201 (no password in response).
- `POST /auth/login` — Accepts `{ "email", "password" }`. Compares via bcrypt. Returns 200 + User (no password) + token. Failure returns 401.
