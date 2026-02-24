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

## Global API Constraints

All API responses **MUST** follow a standardized response envelope structure. This applies to every endpoint across all domains.

### Standard Response Envelope

```json
{
  "status":    "success" | "failed",
  "message":   "<human-readable success or failure message>",
  "timestamp": "<ISO 8601 date-time of response>",
  "data":      { /* domain-specific payload */ }
}
```

### Payload Rules

| Scenario | `data` Contents | Example |
|----------|-----------------|---------|
| Single entity | Domain model keyed by singular name | `{ "challenge": { ... } }` |
| List of entities | Domain model keyed by plural name | `{ "challenges": [ ... ] }` |
| Count | Object with `count` key | `{ "count": 42 }` |
| Auth / Token | Relevant auth payload (user profile, token) | `{ "user": { ... }, "token": "..." }` |
| Failure | May be `null` or omitted | — |

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
| 4 | `contributorsCount` | Number | Count of `contributorsDetails` array |
| 5 | `commentCount` | Number | From Comment collection |
| 6 | `ideaList` | Array of Objects | From Idea collection by challenge ID |
| 7 | `comments` | Array of Objects | From Comment collection |
| 8 | `contributors` | Array of Objects | Owner details of all ideas under challenge. Default `[]` |
| 9 | `upvoteCount` | Number | Count of `upVotes` array |
| 10 | `totalViews` | Number | Alias or direct mapped from `viewCount` field |
| 11 | `upvoteList` | Array of String | Alias or direct mapped from `upVotes` field |

### Constraints & Requirements
- **ALL Challenge API GET responses** (especially GET all and GET by virtualId) **MUST** include the following derived fields: `totalViews` (or `viewCount`), `upvoteList`, `upvoteCount`, `contributorsDetails`, `contributorsCount`, `commentCount`, and `countOfIdeas`.
- Member management system and approval process for challenges; for now, hardcode members in DB among existing users.
- Timeline, portfolio, platform list, opco list are hardcoded. Later manageable by admin.
- Priority is always hardcoded.
- Creator of challenge automatically becomes a subscriber.
- Any user submitting an idea automatically becomes a subscriber of the challenge.
- Any user upvoting or commenting on a challenge automatically subscribes to that challenge.
- Once a challenge is in `pilot` status, it cannot be moved back to `submitted`.

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `GET` | `/challenges` | Get all challenges (supports `?limit=` & `?offset=`) |
| 2 | `POST` | `/challenges` | Create a new challenge |
| 3 | `GET` | `/challenges/count` | Get total challenge count |
| 4 | `GET` | `/challenges/{virtualId}` | Get challenge by virtualId (e.g., CH-001) |
| 5 | `PUT` | `/challenges/{virtualId}` | Update a challenge |
| 6 | `DELETE` | `/challenges/{virtualId}` | Delete a challenge (204 No Content) |
| 7 | `PATCH` | `/challenges/{virtualId}/status` | Update swim lane status. Body: `{ "status": "...", "userId": "..." }` |
| 8 | `POST` | `/challenges/{virtualId}/upvote` | Toggle upvote. Body: `{ "userId": "..." }` |
| 9 | `POST` | `/challenges/{virtualId}/subscribe` | Toggle subscription. Body: `{ "userId": "..." }` |
| 10 | `GET` | `/challenges/status/{status}` | Get challenges by status (v4) |

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
| 6 | `upvoteCount` | Number | Alias for `appreciationCount` (number of upvotes) |
| 7 | `viewCount` | Number | From DB `viewCount` field |

### Constraints & Requirements
- **ALL Idea API GET responses** **MUST** include these derived fields: `viewCount`, `upvoteCount` (or `appreciationCount`), and `commentCount`.
- Moderator-based idea status — future implementation.
- Creator subscribes to the idea and its parent challenge.
- Any user upvoting or commenting on an idea subscribes to that idea and its parent challenge.

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `GET` | `/ideas` | Get all ideas (supports `?limit=` & `?offset=`) |
| 2 | `POST` | `/ideas` | Create a new idea |
| 3 | `GET` | `/ideas/count` | Get total idea count |
| 4 | `GET` | `/ideas/challenge/{virtualId}` | Get ideas for a challenge by challenge virtualId (e.g., CH-001) |
| 5 | `GET` | `/ideas/{virtualId}` | Get idea by ideaId (e.g., ID-0001) |
| 6 | `PUT` | `/ideas/{virtualId}` | Update an idea |
| 7 | `DELETE` | `/ideas/{virtualId}` | Delete an idea (204 No Content) |
| 8 | `POST` | `/ideas/{virtualId}/upvote` | Toggle upvote. Body: `{ "userId": "..." }` |
| 9 | `POST` | `/ideas/{virtualId}/subscribe` | Toggle subscription. Body: `{ "userId": "..." }` |

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

### Constraints & Requirements

- **Virtual ID Prefix Routing:** The prefix of the `virtualId` (`CH-` or `ID-`) determines the comment type to query, mapping directly to Comment Types `["CH", "ID"]`. E.g., `CH-001` → type `"CH"` (Challenge); `ID-0001` → type `"ID"` (Idea).
- Any user commenting on a challenge automatically subscribes to that challenge.
- Any user commenting on an idea automatically subscribes to that idea and its parent challenge.

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `GET` | `/comments` | Get all comments (supports `?parentId=` & `?type=`) |
| 2 | `POST` | `/comments` | Create a comment |
| 3 | `GET` | `/comments/count` | Get total comment count |
| 4 | `GET` | `/comments/challenge/{virtualId}` | Get comments for a challenge by virtualId |
| 5 | `GET` | `/comments/challenge/{virtualId}/count` | Get comment count for a challenge by virtualId |
| 6 | `GET` | `/comments/idea/{virtualId}` | Get comments for an idea by virtualId |
| 7 | `GET` | `/comments/idea/{virtualId}/count` | Get comment count for an idea by virtualId |
| 8 | `GET` | `/comments/user/{userId}` | Get comments by a user (supports `?limit=` & `?offset=`) |
| 9 | `GET` | `/comments/user/{userId}/count` | Get comment count for a user |
| 10 | `DELETE` | `/comments/{id}` | Delete a comment (204 No Content) |

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

### Constraints & Requirements
- Should **NOT** allow direct updates to: `password`, `role`, `status` (those have dedicated flows).

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `GET` | `/users` | Get all users |
| 2 | `GET` | `/users/{id}` | Get user by MongoDB Hex ID |

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

### Constraints & Requirements
- Activities are primarily created internally by the service layer when domain events occur.

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `GET` | `/activities` | Get all activities (supports `?limit=` & `?offset=`) |
| 2 | `POST` | `/activities` | Create an activity |
| 3 | `GET` | `/activities/count` | Get total activity count |
| 4 | `GET` | `/activities/user/{userId}` | Get activities for a user (supports `?limit=` & `?offset=`) |
| 5 | `GET` | `/activities/user/{userId}/count` | Get activity count for a user |
| 6 | `GET` | `/activities/{id}` | Get activity by MongoDB `_id` |
| 7 | `PUT` | `/activities/{id}` | Update an activity |
| 8 | `DELETE` | `/activities/{id}` | Delete an activity (204 No Content) |

---

## 6. Notification (v4)

### Database Fields

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `_id` | ObjectId | MongoDB Hex String PK |
| 2 | `type` | String | → `NOTIFICATION_TYPES` (12 values) |
| 3 | `title` | String | Static title mapped from event type via `NOTIFICATION_TEMPLATES` |
| 4 | `description` | String | Dynamically generated from template utilizing `initiatorDetails.name` and entity title |
| 5 | `fk_id` | String | Nullable. ID of linked entity |
| 6 | `userId` | String | Recipient Mongo Hex ID (Not the initiator) |
| 7 | `initiatorId` | String | Mongo Hex ID of the user who triggered the notification |
| 8 | `createdAt` | DateTime | |
| 9 | `isSeen` | Boolean | Default: `false` |

### Derived Fields

| # | Field | Type | Source |
|---|-------|------|--------|
| 1 | `linkedEntityDetails` | Object | Routing details containing `virtualId` (e.g. CH-001/ID-0001), `type` ('CH' or 'ID'), and optionally `challengeVirtualId` (for Ideas) dynamically fetched via `fk_id` |
| 2 | `recipientDetails` | Object | User details fetched via `userId` |
| 3 | `initiatorDetails` | Object | User details fetched via `initiatorId` (UserMinimal) |

### Constraints & Requirements
- `GET /notifications/user/{userId}/count` accepts optional query parameter `isSeen` (true/false) to filter; if absent, fetches all.

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `GET` | `/notifications` | Get all notifications (supports `?limit=` & `?offset=`) |
| 2 | `POST` | `/notifications` | Create a notification |
| 3 | `GET` | `/notifications/count` | Get total notification count |
| 4 | `GET` | `/notifications/user/{userId}` | Get notifications for a user (supports `?limit=` & `?offset=`) |
| 5 | `GET` | `/notifications/user/{userId}/count` | Get notification count (supports `?isSeen=true/false`) |
| 6 | `GET` | `/notifications/{id}` | Get notification by MongoDB `_id` |
| 7 | `PUT` | `/notifications/{id}` | Update a notification |
| 8 | `PATCH` | `/notifications/{id}/status` | Update `isSeen` status. Body: `{ "isSeen": true }` |
| 9 | `DELETE` | `/notifications/{id}` | Delete a notification (204 No Content) |

### Notification and Activity Logic

| Action / Event | Service | Activity Logged For | Notification Sent To | Exception/Notes |
| :--- | :--- | :--- | :--- | :--- |
| **User Login** | `AuthService` | Current User | None | |
| **User Logout** | `AuthService` | Current User | None | |
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

> **Note:** In all scenarios generating notifications, the **Initiator** (the user performing the action) is strictly filtered out. No self-notifications will be created.

---

## 7. Metrics & Dashboard (All Derived)

> All metric and dashboard data is **computed at query time** via aggregation. No metric data is stored in the database.

### Endpoint 1: `GET /metrics/summary`

**Purpose:** Top Metric Summary block on the Metrics page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `totalChallenges` | Number | Count of all documents in Challenge collection |
| 2 | `totalIdeas` | Number | Count of all documents in Idea collection |
| 3 | `conversionRate` | Number | `(count where status="completed" / totalChallenges) * 100` — this is the "current" value |
| 4 | `targetConversionRate` | Number | Hardcoded to `50` |
| 5 | `averageTimeToPilot` | Number | For all challenges where `timestampOfStatusChangedToPilot` is NOT null: compute the difference in days between `timestampOfStatusChangedToPilot` and `createdAt` for each, then divide the sum by the count. Result = average days from creation to pilot |
| 6 | `activeContributions` | Number | Count of Activity documents where type ∈ `[challenge_created, idea_created, challenge_upvoted, idea_upvoted, challenge_commented, idea_commented]` |
| 7 | `totalUsers` | Number | Count of all documents in User collection |

---

### Endpoint 2: `GET /metrics/funnel`

**Purpose:** Innovation Funnel block on the Metrics page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `totalChallenges` | Number | Count of all documents in Challenge collection |
| 2 | `totalIdeas` | Number | Count of all documents in Idea collection |
| 3 | `challengesBySwimLane` | Object | Count of challenges grouped by `status`. Keys: `submitted`, `ideation`, `pilot`, `completed`, `archive`. Values: count per status |
| 4 | `conversionRate` | Number | Same formula as Endpoint 1 field 3 |
| 5 | `targetConversionRate` | Number | Hardcoded to `50` |

> [!IMPORTANT]
> **Shared Business Logic [SBL-STATUS-DISTRIBUTION]:** The `challengesBySwimLane` grouping logic is identical to the Home View → Status Distribution endpoint. Both should use the same underlying service method.

---

### Endpoint 3: `GET /metrics/team-engagement`

**Purpose:** Team Engagement block on the Metrics page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `challengesByPlatform` | Object | Count of challenges grouped by `platform` field. Keys: platform values (e.g., `STP`, `CTP`, `BFSI`). Values: count per platform |

> [!NOTE]
> Heatmap is static/hardcoded in the UI and does **not** require a backend endpoint.

---

### Endpoint 4: `GET /metrics/portfolio-balance`

**Purpose:** Portfolio Balance block on the Metrics page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `challengesByPortfolioLane` | Object | Count of challenges grouped by `portfolioLane`. Keys: `Customer Value Driver`, `Non Strategic Product Management`, `Tech Enabler`, `Maintenance`. Values: count per lane |

---

### Endpoint 5: `GET /metrics/innovation-velocity`

**Purpose:** Innovation Velocity block on the Metrics page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `data` | Array of Objects | For the last 12 months (including current month). Each object: `{ month, year, challenges, ideas }`. `challenges` = count of Challenge docs matching month/year. `ideas` = count of Idea docs matching month/year. Sorted chronologically (oldest first) |

> [!IMPORTANT]
> **Shared Business Logic [SBL-MONTHLY-THROUGHPUT]:** This aggregation logic is identical to the Home View → Monthly Throughput endpoint. Home View shows only the last **6 months** of this same data. Both should use the same service method, with Home View slicing to 6 entries.

---

### Endpoint 6: `GET /metrics/opco-radar`

**Purpose:** OpCo Radar block on the Metrics page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `challengesByOpco` | Object | Count of challenges grouped by `opco`. Keys: `Albert Heijn`, `GSO`, `GET`, `BecSee`, `Other`. Values: count per OpCo |

---

### Home View Endpoints (Under `/home` prefix)

#### Endpoint 7: `GET /home/top-challenges`

**Purpose:** Top 5 challenges slider on the Home page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `challenges` | Array of Objects | Top 5 challenges ranked by combined score: `upVotes.length + viewCount`. Sort descending, take top 5. Each object includes at minimum: `virtualId`, `title`, `summary`, `upVotes`, `viewCount`, `status`, `ownerDetails` (from User collection) |

#### Endpoint 8: `GET /home/status-distribution`

**Purpose:** Pie chart showing challenge count by status on the Home page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `challengesByStatus` | Object | Count of challenges grouped by `status`. Keys: `submitted`, `ideation`, `pilot`, `completed`, `archive`. Values: count per status |

> [!IMPORTANT]
> **Shared Business Logic [SBL-STATUS-DISTRIBUTION]:** Identical to Metrics → Innovation Funnel → `challengesBySwimLane`. Both endpoints should reuse the same service method.

#### Endpoint 9: `GET /home/key-metrics`

**Purpose:** Key metrics summary card on the Home page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `pilotRate` | Number | Same as `GET /metrics/summary` field 5 (`averageTimeToPilot`). For all challenges where `timestampOfStatusChangedToPilot` is NOT null: compute days between `timestampOfStatusChangedToPilot` and `createdAt`, then average. Result = average days from creation to pilot |
| 2 | `conversionRate` | Number | Same formula as `GET /metrics/summary` field 3 |
| 3 | `targetConversionRate` | Number | Hardcoded to `50` |

#### Endpoint 10: `GET /home/monthly-throughput`

**Purpose:** Monthly throughput chart on the Home page (last 6 months).

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `data` | Array of Objects | Same structure as `GET /metrics/innovation-velocity`, but filtered to the most recent **6 months** only. Each object: `{ month, year, challenges, ideas }` |

> [!IMPORTANT]
> **Shared Business Logic [SBL-MONTHLY-THROUGHPUT]:** Reuses the same aggregation as `GET /metrics/innovation-velocity`, then slices to last 6 entries.

#### Endpoint 11: `GET /home/innovation-team`

**Purpose:** Innovation team section on the Home page.

| # | Field | Type | Business Logic |
|---|-------|------|----------------|
| 1 | `users` | Array of Objects | All users where `role` is `"ADMIN"` or `"MEMBER"`. Each user includes at minimum: `_id`, `name`, `companyTechRole`, `email`, `interestAreas`, `innovationScore`. Plus derived counts: `challengeCount`, `totalIdeaCount`, `commentCount` (from Challenge, Idea, and Comment collections) |

> [!IMPORTANT]
> **Shared Business Logic [SBL-USER-COUNT-BY-ROLE]:** This filters users by role. The same role-based filtering logic is used by `GET /users/count-by-role`.

#### Success Stories
- Hardcoded in DB for now. No dedicated endpoint required.

#### What's Next
- Hardcoded in UI. No backend endpoint required.

---

## 8. Authentication & Registration

- `POST /auth/register` — Accepts full User profile payload. Password hashed via bcrypt. Returns 201 (no password in response).
- `POST /auth/login` — Accepts `{ "email", "password" }`. Compares via bcrypt. Returns 200 + User (no password) + token. Failure returns 401.

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `POST` | `/auth/login` | User login. Body: `{ "email": "...", "password": "..." }` |
| 2 | `POST` | `/auth/register` | User registration. Body: full user profile payload |

---

## 9. Seed (Development Only)

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `POST` | `/seed` | Seed database with fake related data |

---

## 10. Newsletter

### Implemented Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `POST` | `/newsletter/subscribe` | Subscribe to newsletter. Body: `{ "email": "..." }` |
