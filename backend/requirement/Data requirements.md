# AI Task Dashboard - Data Requirements

This document is generated from `backend/requirement/Data requirements.txt` and serves as the definitive reference for database schemas and derived fields.

---

## 1. Challenge

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Title`: String
- `Opco`: String (One from hardcoded dropdown)
- `Platform`: String (One from hardcoded dropdown)
- `Description`: Long text - String
- `Summary`: String
- `Outcome`: String
- `Timeline`: String (One from hardcoded dropdown)
- `Portfolio Lane`: String (One from hardcoded dropdown)
- `Priority`: String (Hardcoded)
- `Tags`: List of Strings (Default: `["ai"]`)
- `Constraint`: String
- `Stakeholder`: String
- `Virtual Id`: String (Format: `CH-001` to `CH-999`)
- `Status`: String (Swim lane status)
- `userId`: String (Creator Mongo hex ID)
- `CreatedAt`: DateTime
- `month`: Number (Int, derived from `CreatedAt`)
- `year`: Number (Int, derived from `CreatedAt`)
- `updatedAt`: DateTime (Initially same as `CreatedAt`)
- `upVotes`: List of User IDs (Default: `[]`)
- `subscriptions`: List of User IDs (Default: `[]`)
- `viewCount`: Number (Long)
- `timestampOfStatusChangedToPilot`: DateTime (Nullable)
- `timestampOfCompleted`: DateTime (Nullable)

### Derived Fields
- `countOfIdeas`: Number (from idea collection)
- `ownerDetails`: Object (via user id from idea collection)
- `contributorsDetails`: List (via list of contributor user ids)
- `commentCount`: Number (from comment collection)
- `ideaList`: List (from idea collection by challenge id)
- `comments`: List (from comment db)
- `contributors`: List (owner details of all ideas under challenge - default [])

### Additional Functional Requirements
- An API endpoint is required to change challenge status only for SWIM LANES.
  - Required Endpoint: `PATCH /challenges/{virtualId}/status`
  - Body: `{ "status": "New Swim Lane Status" }`

---

## 2. Idea

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Idea Id`: String (Format: ID-0001, programmatic 0001-9999)
- `Title`: String
- `Description / Idea Summary`: String
- `Proposed Solution`: String
- `Challenge Id`: String (Link to Challenge collection)
- `Appreciation Count` (Upvote): Number (Long)
- `View Count`: Number (Long)
- `User Id`: String (Creator Mongo hex ID)
- `Subscription`: List of strings (User hex IDs, Default: `[]`)
- `Created At`: DateTime
- `Month`: Number (Int, from `Created At`)
- `Year`: Number (Int, from `Created At`)
- `Updated At`: DateTime (Initially same as `Created At`)
- `Status`: Boolean (Accepted/Declined - Default: `true`/Accepted)
- `UpVotes`: userId list (Default: `[]`)

### Derived Fields
- `challengeDetails`: Object (Fetched from Challenge DB by Challenge Id)
- `problemStatement`: String (Challenge Description from Challenge DB)
- `commentCount`: Number (Calculated from Comment DB)
- `comments`: List of Objects (Fetched from Comment DB)
- `ownerDetails`: Object (User details fetched via User Id)

---

## 3. Comments

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `UserId`: String (Mongo hex ID)
- `Comment`: Text - String
- `Type`: String (`CH` | `ID`)
- `Createdat`: DateTime
- `TypeId`: String (Challenge or Idea ID)

### Derived Fields
- `userDetails`: Object (from user DB by user ID)

---

## 4. User

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Name`: String
- `Opco`: String (One from hardcoded dropdown)
- `Platform`: String (One from hardcoded dropdown)
- `Company Tech Role`: String
- `Email`: String (Unique Identifier)
- `Password`: String (encrypted string)
- `Interest Areas`: List of Strings (Hardcoded options, Default: `[]`)
- `Role`: String (ADMIN | MEMBER | USER)
- `Created At`: DateTime
- `Updated At`: DateTime
- `Status`: String (PENDING | APPROVED | BLOCKED | INACTIVE)
- `Innovation Score`: Number (Int, 1-999)
- `Upvoted Challenge List`: List of Strings (Challenge IDs, Default: `[]`)
- `Upvoted/Appreciated Idea List`: List of Strings (Idea IDs, Default: `[]`)

### Derived Fields
- `upvoteCount`: Number (Sum of upvotes on challenges + ideas submitted by user)
- `recentActivity`: List of Activity Objects (From Activity DB, sorted by timestamp, Top 3)
- `recentSubmission`: List of Activity Objects (From Activity DB, types: `challenge_created` or `idea_created`, Top 5)
- `contributionGraph`: Map of String (Month) to Long (Count) (From Activity DB, events grouped by month for last 6 months)
- `commentCount`: Number (Total comments from Comment DB)
- `challengeCount`: Number (Total challenges created from Challenge DB)
- `totalIdeaCount`: Number (Total ideas created from Idea DB)

---

## 5. User Activity

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Type`: String (ENUM: `challenge_created`, `idea_created`, etc.)
- `fk_id`: String (Nullable: ID of related entity)
- `userId`: String (User hex ID)
- `CreatedAt`: DateTime
- `Month`: Number (Int, derived from `CreatedAt`)
- `Year`: Number (Int, derived from `CreatedAt`)

### Derived Fields
- `userDetails`: Object (Fetched via `userId` for displaying 'Who' performed the action)
- `entityDetails`: Object (Fetched via `fk_id` based on Type - any of Challenge or Idea)
- `activitySummary`: String (A human-readable string generated by combining Type + Entity Details)

---

## 6. Notification

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Type`: String (ENUM: `challenge_created`, `challenge_status_update`, etc.)
- `fk_id`: String (Nullable: ID of linked entity)
- `userId`: String (Recipient Mongo hex ID)
- `CreatedAt`: DateTime
- `IsSeen`: Boolean (Default: `false`)

### Derived Fields
- `description`: String (Dynamically generated based on Type and initiator name)
- `linkedEntityDetails`: Object (Details of the Challenge or Idea fetched via `fk_id`)
- `recipientDetails`: Object (User details fetched via `userId`)
