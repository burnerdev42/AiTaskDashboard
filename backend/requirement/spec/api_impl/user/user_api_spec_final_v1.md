# User API Implementation Specification

This document details the step-by-step implementation logic for the User domain API endpoints, adhering to the database schema (`user_model_spec.md`), business logic (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `User` MongoDB document with various derived metric fields. Because many of these derivations require heavy cross-collection querying (to `challenges`, `ideas`, `comments`, and `activities`), this logic should be implemented via concurrent `Promise.all` sweeps or a highly optimized MongoDB `$lookup` aggregation pipeline.

For a given `user`:

1. **`upvoteCount`** (Number):
   - Definition: Sum of upvotes received on all challenges and ideas submitted by this user.
   - Logic: 
     - Query `challenges`: sum the lengths of the `upVotes` arrays for all challenges where `userId = user._id`.
     - Query `ideas`: sum the lengths of the `UpVotes` arrays for all ideas where `userId = user._id`.
     - Add both sums together.

2. **`recentActivity`** (Array of `ActivityResponse`):
   - Query `activities` collection: `Activity.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3)`.
   - Ensure the entity derivation logic required for `ActivityResponse` is applied to these 3 items.

3. **`recentSubmission`** (Array of `ActivityResponse`):
   - Query `activities` collection: `Activity.find({ userId: user._id, type: { $in: ['challenge_created', 'idea_created'] } }).sort({ createdAt: -1 }).limit(5)`.
   - Ensure entity derivation logic is applied.

4. **`contributionGraph`** (Map/Object of `String (Month) -> Number (Count)`):
   - Query `activities` collection to get a count of events grouped by `month` and `year` for the last 6 months for this `user._id`.
   - Format the payload as a map where the key is the month's string identifier (e.g., "Jan", "Feb") and the value is the total occurrence count.

5. **`commentCount`** (Number):
   - Query `comments` collection: `Comment.countDocuments({ userId: user._id })`

6. **`challengeCount`** (Number):
   - Query `challenges` collection: `Challenge.countDocuments({ userId: user._id })`

7. **`totalIdeaCount`** (Number):
   - Query `ideas` collection: `Idea.countDocuments({ userId: user._id })`

## Endpoints

### 1. GET `/users`
- **Summary**: Get all users with pagination and derived fields.
- **Query Params**: `limit` (default: 20), `offset` (default: 0).
- **Implementation Steps**:
  1. Parse `limit` and `offset` from `req.query`.
  2. Query `User.find({}).skip(offset).limit(limit).lean()`.
  3. Execute the **Common Aggregation Logic** to populate derived fields for each user item. *(Warning: This could be heavily resource-intensive for large limits without a highly tuned aggregation pipeline).*
  4. Return `200 OK` with the array formatted per `UserResponse`.

### 2. POST `/users`
- **Summary**: Create a new user (Registration).
- **Request Body**: Matches `UserBase` schema.
- **Implementation Steps**:
  1. Validate incoming request body.
  2. Validate email uniqueness: `User.findOne({ email: req.body.email })`. If found, return `409 Conflict` or `400 Bad Request`.
  3. Hash the incoming `password` using `bcrypt` (e.g., salt rounds 10).
  4. Assume defaults for empty arrays (`interestAreas`, `upvotedChallengeList`, `upvotedAppreciatedIdeaList`).
  5. Set defaults like `status: 'PENDING'` (if new manual signups require approval) or explicitly map provided fields.
  6. Insert document: `User.create(...)`.
  7. **Activity Logging**: (Optional) While the spec matrix denotes `log_in` and `log_out`, standard practice may include generating a `User Activity` indicating signup, though strictly speaking, the backend must ensure the user has an ID first.
  8. Return `201 Created` omitting the hashed password from the response.

### 3. GET `/users/count`
- **Summary**: Get total count of users.
- **Implementation Steps**:
  1. Query `User.countDocuments({})`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/users/{id}`
- **Summary**: Get a specific user by their MongoDB `_id`.
- **Path Param**: `id` (24 character hex string).
- **Implementation Steps**:
  1. Query `User.findById(id).lean()`.
  2. If not found, return `404 Not Found`.
  3. Execute **Common Aggregation Logic** to populate derived fields (`upvoteCount`, `contributionGraph`, etc.).
  4. Remove the `password` field from the payload.
  5. Return `200 OK` with the enriched `UserResponse` object.

### 5. PUT `/users/{id}`
- **Summary**: Fully update an existing user document.
- **Path Param**: `id`.
- **Request Body**: Matches `UserBase` schema.
- **Implementation Steps**:
  1. If the `password` is included in the body, it must be hashed before updating.
  2. If the `email` is being changed, ensure it doesn't collide with an existing user.
  3. Find and update the document using `User.findByIdAndUpdate(id, req.body, { new: true })`.
  4. If not found, return `404 Not Found`.
  5. Strip the password from the returned object.
  6. Return `200 OK`.

### 6. DELETE `/users/{id}`
- **Summary**: Delete a user (and potentially their cascading items).
- **Path Param**: `id`.
- **Implementation Steps**:
  1. Find and delete the user: `User.findByIdAndDelete(id)`.
  2. If not found, return `404 Not Found`.
  3. *(Optional Cascade Action depending on business rules)*: It is recommended to perform a soft-delete (changing status to `INACTIVE`) to prevent breaking relations in `Comment`, `Idea`, and `Challenge` schemas that strongly reference this `userId`. If hard deleting, cascade delete all Comments, Challenges, and Ideas owned by the user.
  4. Return `204 No Content`.
