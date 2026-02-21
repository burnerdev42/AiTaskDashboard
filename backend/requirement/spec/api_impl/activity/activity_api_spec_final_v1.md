# User Activity API Implementation Specification

This document details the step-by-step implementation logic for the User Activity domain API endpoints, adhering to the Database schema (`activity_model_spec.md`), business requirements (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `Activity` MongoDB document with derived contextual fields. When fetching an activity or a list of activities, the following logic should be applied:

For a given `activity`:

1. **`userDetails`** (Maps to `UserMinimal`):
   - Query `users` collection: `User.findById(activity.userId).select('_id name email companyTechRole role')`

2. **`entityDetails`** (Maps to `ChallengeMinimal` or `IdeaMinimal`):
   - Determine the foreign key target based on `activity.type`.
     - If `type` implies a Challenge (e.g., `challenge_created`, `challenge_edited`, `challenge_upvoted`):
       - Query `challenges` collection: `Challenge.findOne({ virtualId: activity.fk_id }).select('_id virtualId title')`
     - If `type` implies an Idea (e.g., `idea_created`, `idea_edited`, `idea_upvoted`):
       - Query `ideas` collection: `Idea.findOne({ ideaId: activity.fk_id }).select('_id ideaId title')`
     - Note: For `log_in` and `log_out`, this will be `null`.

3. **`activitySummary`** (String):
   - A human-readable string generated dynamically based on the `type` and the retrieved `entityDetails` (e.g., "Created a challenge titled 'AI Expansion'", "Upvoted an idea").

## Endpoints

### 1. GET `/activities`
- **Summary**: Get all activities with pagination and derived contextual fields.
- **Query Params**: `limit` (default: 20), `offset` (default: 0).
- **Implementation Steps**:
  1. Parse `limit` and `offset` from `req.query`.
  2. Query `Activity.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit).lean()`.
  3. Execute the **Common Aggregation Logic** to populate `userDetails`, `entityDetails`, and dynamically construct the `activitySummary`.
  4. Return `200 OK` with the array formatted per `ActivityResponse`.

### 2. POST `/activities`
- **Summary**: Create a new activity manually. (Note: In practice, most activities are generated internally by other endpoints like POST `/challenges`, but standard CRUD forms the base API layer.)
- **Request Body**: Matches `ActivityBase` schema.
- **Implementation Steps**:
  1. Validate incoming request body.
  2. Map out implicit `createdAt` via Mongoose. Explicitly set `month` and `year` via pre-save hooks or controller logic parsing the current date.
  3. Insert document: `Activity.create(req.body)`.
  4. Return `201 Created`.

### 3. GET `/activities/count`
- **Summary**: Get total count of activities.
- **Implementation Steps**:
  1. Query `Activity.countDocuments({})`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/activities/{id}`
- **Summary**: Get a specific activity by its MongoDB `_id`.
- **Path Param**: `id` (24-char hex string).
- **Implementation Steps**:
  1. Query `Activity.findById(id).lean()`.
  2. If not found, return `404 Not Found`.
  3. Execute **Common Aggregation Logic**.
  4. Return `200 OK` with the enriched `ActivityResponse` object.

### 5. PUT `/activities/{id}`
- **Summary**: Fully update an activity document.
- **Path Param**: `id`.
- **Request Body**: Matches `ActivityBase` schema.
- **Implementation Steps**:
  1. Find and update the document: `Activity.findByIdAndUpdate(id, req.body, { new: true })`.
  2. If the `createdAt` timestamp is mutated, re-derive `month` and `year`.
  3. If not found, return `404 Not Found`.
  4. Return `200 OK`.

### 6. DELETE `/activities/{id}`
- **Summary**: Delete an activity.
- **Path Param**: `id`.
- **Implementation Steps**:
  1. Find and delete the activity: `Activity.findByIdAndDelete(id)`.
  2. If not found, return `404 Not Found`.
  3. Return `204 No Content`.
