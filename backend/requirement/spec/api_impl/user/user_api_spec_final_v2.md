# User API Implementation Specification

This document details the step-by-step implementation logic for the User domain API endpoints, adhering to the database schema (`user_model_spec.md`), business logic (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `User` MongoDB document with various derived metric fields. Because many of these derivations require heavy cross-collection querying (to `challenges`, `ideas`, `comments`, and `activities`), this logic should be implemented via concurrent `Promise.all` sweeps or a highly optimized MongoDB `$lookup` aggregation pipeline.

For a given `user`:

1. **`upvoteCount`** (Number):
   - Definition: Sum of upvotes received on all challenges and ideas submitted by this user.
   - Logic: 
     - Query `challenges`: sum the lengths of the `upVotes` arrays for all challenges where `userId = user._id`.
     - Query `ideas`: sum the lengths of the `upVotes` arrays for all ideas where `userId = user._id`. (NOTE: DB field is upVotes, not appreciationCount list).
     - Add both sums together.

2. **`recentActivity`** (Array of `ActivityResponse`):
   - Query `activities` collection: `Activity.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3)`.

3. **`recentSubmission`** (Array of `ActivityResponse`):
   - Query `activities` collection: `Activity.find({ userId: user._id, type: { $in: ['challenge_created', 'idea_created'] } }).sort({ createdAt: -1 }).limit(5)`.

4. **`contributionGraph`** (Map/Object of `String (Month) -> Number (Count)`):
   - Query `activities` collection to get a count of events grouped by `month` and `year` for the last 6 months for this `user._id`.

5. **`commentCount`** (Number):
   - Query `comments` collection: `Comment.countDocuments({ userId: user._id })`

6. **`challengeCount`** (Number):
   - Query `challenges` collection: `Challenge.countDocuments({ userId: user._id })`

7. **`totalIdeaCount`** (Number):
   - Query `ideas` collection: `Idea.countDocuments({ userId: user._id })`

## Endpoints

### 1. GET `/users`
- **Summary**: Get all users with pagination and derived fields.
- **Implementation Steps**:
  1. Extract `limit` and `offset`.
  2. Query `User.find({}).skip(offset).limit(limit).lean()`.
  3. Execute **Common Aggregation Logic**.
  4. Return `200 OK`.

### 2. POST `/users`
- **Summary**: Create a new user (Registration).
- **Implementation Steps**:
  1. Validate incoming body. Verify email uniqueness.
  2. Hash `password` using `bcrypt`.
  3. Map default values.
  4. Insert document: `User.create(...)`.
  5. Return `201 Created` omitting password.

### 3. GET `/users/count`
- **Summary**: Get total count of users.
- **Implementation Steps**:
  1. Query `User.countDocuments({})`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/users/count-by-role`
- **Summary**: Get user count grouped by role.
- **Implementation Steps**:
  1. **[SBL-USER-COUNT-BY-ROLE]**
  2. Aggregation on `User`: `$group` by `role` and `$count`.
  3. Map the results into an object: `{ "ADMIN": calc, "MEMBER": calc, "USER": calc }`. 
  4. Return `200 OK`.

### 5. GET `/users/{id}`
- **Summary**: Get a specific user by ID.
- **Implementation Steps**:
  1. Query `User.findById(id).lean()`. Return `404` if not found.
  2. Execute **Common Aggregation Logic**.
  3. Omitting the `password` field.
  4. Return `200 OK`.

### 6. PUT `/users/{id}`
- **Summary**: Fully update an existing user document.
- **Implementation Steps**:
  1. If `password` exists, hash it. Enforce email uniqueness constraint updates.
  2. Cannot update `role` or `status` directly via this endpoint unless administratively authorized.
  3. `User.findByIdAndUpdate(id, req.body, { new: true })`.
  4. Return `200 OK` omitting password.

### 7. DELETE `/users/{id}`
- **Summary**: Delete a user.
- **Implementation Steps**:
  1. `User.findByIdAndDelete(id)`. Return `404` if not found.
  2. Return `204 No Content`.
