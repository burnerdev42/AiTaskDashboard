# Data Requirements Analysis

This document outlines the data requirements for the AI Task Dashboard, covering both the database schemas and derived fields necessary for the frontend and backend components.

## 1. Challenge

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Title`: String
- `opco`: List/dropdown - one from list of hardcoded options (String)
- `Platform`: List/dropdown - one from list of hardcoded options (String)
- `Description`: Long text (String)
- `Summary`: String
- `Outcome`: String
- `Timeline`: One from list of hardcoded options (String)
- `Portfolio Lane`: One from list of hardcoded options (String)
- `Priority`: One from list of hardcoded options (String)
- `Tags`: List of strings (Default: `["ai"]`)
- `Constraint`: String
- `StackeHolder`: String
- `Virtual Id`: Format CH-001 (Programmatically generated 001 to 999)
- `Status` (swim lane): One among swim lane statuses (String)
- `userId`: Creator user ID (MongoDB hex ID from user collection)
- `CreatedAt`: DateTime
- `month`: Number (Int)
- `year`: Number (Int)
- `updatedAt`: DateTime (Initially same as `CreatedAt`)
- `contributors`: List of strings (MongoDB hex IDs, Default: `[]`)
- `UpVotes`: userId list (Default: `[]`)
- `DownVotes`: userId list (Default: `[]`)
- `Subcriptions`: userId list (Default: `[]`)
- `View count`: Number (Long)
- `timestamp of status changed to pilot (z1)`: DateTime
- `timestamp of completed (z2)`: DateTime

### Derived Fields
- `Count of Ideas`: From Idea collection
- `Owner details`: Via user ID from Idea collection
- `contributors details`: Via list of contributor user IDs
- `comment count`: From Comment collection
- `Idea list`: From Idea collection by challenge ID
- `comments`: From Comment collection

### Additional Functional Requirements
- An API endpoint is required to change challenge status **only** for SWIM LANES.

### Constraints
- Member management system and approval process for challenges: currently hardcode members in DB among existing users.
- Timeline, portfolio, platform list, opco list are hardcoded for now; manageable by admin later.
- Priority is always hardcoded.

---

## 2. Idea

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Idea Id`: String (Format: IDX-0001, programmatic 0001-9999)
- `Title`: String
- `Description/Idea Summary`: String
- `Proposed Solution`: String
- `Expected Impact`: String
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

### Derived Fields
- `Challenge Details`: Object (Fetched from Challenge DB by Challenge Id)
- `Problem Statement`: String (Challenge Description from Challenge DB)
- `Comment Count`: Number (Calculated from Comment DB)
- `Comments`: List of Objects (Fetched from Comment DB)
- `Owner Details`: Object (User details fetched via User Id)

### Constraints
- Moderator-based idea status to be implemented in the future.

---

## 3. Comments

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `UserId`: Mongo hex ID
- `Comment`: Text
- `Type`: Challenges (CH) | Ideas (IDX) - Any one from the option (String)
- `Createdat`: DateTime
- `TypeId`: Either challenge or idea ID (String)

### Derived Fields
- `User details`: Fetched from user DB by user ID (Object)

---

## 4. User

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Name`: String
- `Opco`: String (One from hardcoded dropdown)
- `Platform`: String (One from hardcoded dropdown)
- `Company Tech Role`: String
- `Email`: String (Unique Identifier)
- `Interest Areas`: List of Strings (Hardcoded options, Default: `[]`)
- `Role`: String (ADMIN | MEMBER | USER)
- `Created At`: DateTime
- `Updated At`: DateTime
- `Status`: String (PENDING | APPROVED | BLOCKED | INACTIVE)
- `Innovation Score`: Number (Int, 1-999)
- `Upvoted Challenge List`: List of Strings (Challenge IDs, Default: `[]`)
- `Downvoted Challenge List`: List of Strings (Challenge IDs, Default: `[]`)
- `Upvoted/Appreciated Idea List`: List of Strings (Idea IDs, Default: `[]`)

### Derived Fields
- `Upvote Count`: Number (Sum of upvotes on challenges + ideas submitted by user)
- `Recent Activity` (Top 3): List of Objects (From Notification Event DB, sorted by timestamp)
- `Recent Submission` (Top 5): List of Objects (From Activity DB, types: `challenge_created` or `idea_created`)
- `Contribution Graph`: Data Object (From Activity DB, events grouped by month for last 6 months)
- `Comment Count`: Number (Total comments from Comment DB)
- `Challenge Count`: Number (Total challenges created from Challenge DB)
- `Total Idea Count`: Number (Total ideas created from Idea DB)

---

## 5. User Activity

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Type`: String (ENUM: `challenge_created`, `idea_created`, `challenge_status_update`, `challenge_edited`, `idea_edited`, `challenge_upvoted`, `challenge_downvoted`, `idea_upvoted`, `challenge_commented`, `idea_commented`, `challenge_subscribed`, `idea_subscribed`, `challenge_deleted`, `idea_deleted`, `log_in`, `log_out`)
- `fk_id`: String (Nullable: ID of related Challenge, Idea, or Comment; null for login/logout)
- `userId`: String (User hex ID)
- `CreatedAt`: DateTime
- `Month`: Number (Int, derived from `CreatedAt`)
- `Year`: Number (Int, derived from `CreatedAt`)

### Derived Fields
- `User Details`: Object (Fetched via `userId` for displaying 'Who' performed the action)
- `Entity Details`: Object (Fetched via `fk_id` based on Type to show 'What' was acted upon)
- `Activity Summary`: String (A human-readable string generated by combining Type + Entity Details)

---

## 6. Notifications

### Database Fields
- `_id`: MongoDB ObjectId (Hex String PK)
- `Type`: String (ENUM: `challenge_created`, `challenge_status_update`, `challenge_edited`, `idea_edited`, `challenge_upvoted`, `challenge_downvoted`, `idea_upvoted`, `challenge_commented`, `idea_commented`, `challenge_subscribed`, `idea_subscribed`, `challenge_deleted`, `idea_deleted`)
- `fk_id`: String (Nullable: ID of the linked Challenge, Idea, or Comment)
- `userId`: String (The recipient's Mongo hex ID - Not the initiator)
- `CreatedAt`: DateTime
- `IsSeen`: Boolean (Default: `false`)

### Derived Fields
- `Description`: String (Dynamically generated based on Type and initiator name)
- `Linked Entity Details`: Object (Details of the Challenge/Idea fetched via `fk_id`)
- `Recipient Details`: Object (User details fetched via `userId`)

### Recipient Logic (Backend Implementation Guide)
- `challenge_created`: All users (Except initiator)
- `challenge_status_update` / `edited`: All challenge subscribers (Except initiator)
- `idea_edited`: All idea subscribers + Challenge owner + Challenge subscribers (Except initiator)
- `challenge_upvoted` / `downvoted` / `commented` / `subscribed` / `deleted`: All challenge subscribers + Challenge owner (Except initiator)
- `idea_upvoted` / `commented` / `subscribed` / `deleted`: All idea subscribers + Challenge owner + Challenge subscribers (Except initiator)

---

## 7. Metrics (All Derived)

**Note:** Blocks have individual API endpoints.

### TOP Metric Summary Block
- **Total challenges:** From Challenge table
- **Total ideas:** From Idea table
- **Conversion rate:** Challenges in "completed" / total challenges
- **Average time to pilot:** All challenges with non-nullable `inpilot` timestamp. Compute number of days since creation, divide by the count.
- **Active contributions:** All events for challenge, idea, and comment.
- **Total Users:** Replacing pipeline value. From User table.

### Innovation Funnel Block (Top 1st item)
- **Total challenges:** From Challenge DB
- **Total Ideas:** From Challenge DB
- **Challenges by swim lane count:** Do this in memory
- **Conversion rate:** Already mentioned above (target is always a hardcoded value)

### Team Engagement Block (Top 2nd item)
- **Challenges group by platform:** Group by platform (not tech, we don't have tech details)
- **Heatmap:** Hard to calculate, show a static heatmap for now.

### Portfolio Balance Block (Top 3rd item / Move to Top)
- **Challenge count by portfolio lane**

### Innovation Velocity (Bottom 1st item)
- Total challenge and total ideas block
- Derived from Idea table last 12 months (including the current month)

### OpCo Radar Block (Bottom 2nd item)
- Replaces Tech Radar as we lack tech details.
- **Challenge count by opco**

---

## 8. Home (All Derived - Separate Endpoints)
- **Slider:** Most upvoted challenges (Top 5)
- **Pie chart:** Challenges grouped by status
- **Key metric:** From metric summary API, show only `pilot rate` and `conversion rate`
- **Monthly throughput:** Fetch innovation velocity API and show only six months of data
- **Success stories:** Hardcoded in DB for now
- **Innovation team:** Users marked as lab users (show ideas, challenges, and comment count)

---

## 9. What's Next
- Currently hardcoded in UI.
