# Challenge API Implementation Specification

This document details the step-by-step implementation logic for the Challenge domain API endpoints, fully adhering to the defined Database schema (`challenge_model_spec.md`), business requirements (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `Challenge` MongoDB document with derived fields. When fetching a challenge or a list of challenges, the following logic should be applied (ideally via an aggregation pipeline or parallel Mongoose queries):

For a given `challenge`:
1. **`ownerDetails`** (Maps to `UserMinimal`):
   - Query `users` collection: `User.findById(challenge.userId).select('_id name email companyTechRole role')`
2. **`ideaList`** (Array of `IdeaMinimal`):
   - Query `ideas` collection matching the string format constraint `challengeId: challenge.virtualId`. (Projection: `_id ideaId title`)
3. **`countOfIdeas`**:
   - Derived from the length of `ideaList` or via `countDocuments`.
4. **`contributorsDetails`** / **`contributors`** (Array of `UserMinimal`):
   - Extract unique `userId`s from the array of fetched `ideaList`.
   - Query `users` collection matching those distinct IDs. (Projection: `_id name email companyTechRole role`).
5. **`comments`** (Array of `CommentMinimal`):
   - Query `comments` collection: `Comment.find({ type: 'CH', typeId: challenge.virtualId }).select('_id comment userId createdat')`
6. **`commentCount`**:
   - Derived from the length of `comments` or via `countDocuments`.

## Endpoints

### 1. GET `/challenges`
- **Summary**: Get all challenges with pagination and derived fields.
- **Query Params**: `limit` (default: 20), `offset` (default: 0).
- **Implementation Steps**:
  1. Parse `limit` and `offset` from `req.query`.
  2. Query `Challenge.find({}).skip(offset).limit(limit).lean()`.
  3. Execute the **Common Aggregation Logic** to populate derived fields for each item using a batched aggregation `$lookup` or `Promise.all`.
  4. Return `200 OK` with the array formatted per `ChallengeResponse`.

### 2. POST `/challenges`
- **Summary**: Create a new challenge.
- **Request Body**: Matches `ChallengeBase` schema.
- **Implementation Steps**:
  1. Validate incoming request body against `ChallengeBase` constraints.
  2. Generate a programmatic `virtualId` (Format `CH-001` to `CH-999`):
     - Query `Challenge.findOne({}, { virtualId: 1 }).sort({ virtualId: -1 })`.
     - Extract numeric part, increment by 1, and pad zeros (if none exist, use `CH-001`).
  3. Set implicit derived fields upon creation natively (`CreatedAt`, `updatedAt` handling via Mongoose `timestamps`), and explicitly setting integer variables `month` and `year`.
  4. Optionally initialize defaults like `upVotes: []`, `subcriptions: []`, `Tags: ["ai"]`.
  5. User automatically becomes a subscriber: Push `userId` to `subcriptions` list.
  6. Insert document: `Challenge.create(...)`.
  7. **Activity Logging**: Create a `User Activity` document (`type: 'challenge_created'`, `fk_id: virtualId`, `userId: req.body.userId`).
  8. **Notification (Bulk Create)**: 
     - Query all `User`s except the creator (`req.body.userId`).
     - Create an array of `Notification` objects. One for each user (`type: 'challenge_created'`, `fk_id: virtualId`, `userId: <recipient_id>`).
     - Bulk insert the array (e.g., using `Notification.insertMany(notificationsArray)`).
  9. Return `201 Created`.

### 3. GET `/challenges/count`
- **Summary**: Get total count of challenges.
- **Implementation Steps**:
  1. Query `Challenge.countDocuments({})`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/challenges/{virtualId}`
- **Summary**: Get a specific challenge by its Virtual ID.
- **Path Param**: `virtualId` (e.g., "CH-001").
- **Implementation Steps**:
  1. Query `Challenge.findOne({ virtualId }).lean()`.
  2. If not found, return `404 Not Found`.
  3. Execute **Common Aggregation Logic** to populate derived fields `ownerDetails`, `ideaList`, `contributors`, `comments`, etc.
  4. Return `200 OK` with the enriched `ChallengeResponse` object.

### 5. PUT `/challenges/{virtualId}`
- **Summary**: Fully update an existing challenge.
- **Path Param**: `virtualId`.
- **Request Body**: Matches `ChallengeBase` schema.
- **Implementation Steps**:
  1. Find and update the document using `Challenge.findOneAndUpdate({ virtualId }, req.body, { new: true })`.
  2. If not found, return `404 Not Found`.
  3. **Activity Logging**: Create a `User Activity` document (`type: 'challenge_edited'`, `fk_id: virtualId`, `userId: initiatorId`).
  4. **Notification (Bulk Create)**:
     - Find all users in the challenge's `subcriptions` array, excluding the initiator.
     - Create an array of `Notification` objects for the matching subscribers (`type: 'challenge_edited'`, `fk_id: virtualId`, `userId: <recipient_id>`).
     - Bulk insert the array (`Notification.insertMany(...)`).
  5. Return `200 OK`.

### 6. PATCH `/challenges/{virtualId}`
- **Summary**: Update challenge status (Swim Lane).
- **Path Param**: `virtualId`.
- **Request Body**: `{ "status": "<new_status>" }`
- **Implementation Steps**:
  1. Ensure the request only attempts to mutate `status`.
  2. Map out status to update timestamps: 
     - If the status switches to "Pilot", update `timestampOfStatusChangedToPilot`.
     - If the status switches to "Completed", update `timestampOfCompleted`.
  3. Handle the partial update: `Challenge.findOneAndUpdate({ virtualId }, ...)`
  4. If not found, return `404 Not Found`.
  5. **Activity Logging**: Create a `User Activity` document (`type: 'challenge_status_update'`, `fk_id: virtualId`, `userId: initiatorId`).
  6. **Notification (Bulk Create)**:
     - Find all users in the challenge's `subcriptions` array, excluding the initiator.
     - Create an array of `Notification` objects for the matching subscribers (`type: 'challenge_status_update'`, `fk_id: virtualId`, `userId: <recipient_id>`).
     - Bulk insert the array (`Notification.insertMany(...)`).
  7. Return `200 OK`.

### 7. DELETE `/challenges/{virtualId}`
- **Summary**: Delete a challenge by Virtual ID.
- **Path Param**: `virtualId`.
- **Implementation Steps**:
  1. Attempt deletion: `Challenge.findOneAndDelete({ virtualId })`.
  2. If not found, return `404 Not Found`.
  3. Cascade effect: Delete all associated `Idea` and `Comment` documents linking to `challenge.virtualId`. Check the logic according to strict deletion requirements.
  4. **Activity Logging**: Create a `User Activity` document (`type: 'challenge_deleted'`, `fk_id: virtualId`, `userId: initiatorId`).
  5. **Notification (Bulk Create)**:
     - Form a recipient list consisting of `challenge.subcriptions` AND the `challenge.userId` (owner), strictly excluding the initiator's ID.
     - Create an array of `Notification` objects for these recipients (`type: 'challenge_deleted'`, `fk_id: virtualId`, `userId: <recipient_id>`).
     - Bulk insert the array (`Notification.insertMany(...)`).
  6. Return `204 No Content`.

### 8. POST `/challenges/{virtualId}/upvote`
- **Summary**: Toggle an upvote for the challenge.
- **Path Param**: `virtualId`.
- **Request Body**: `{ "userId": "<user_id>" }`
- **Implementation Steps**:
  1. Find the challenge: `Challenge.findOne({ virtualId })`. If not found, return `404 Not Found`.
  2. Toggle logic: Check if `userId` exists in `upVotes` array. If true, remove it (`$pull`). If false, add it (`$addToSet`). Save the document.
  3. **Activity Logging**: (Only if adding upvote) Create a `User Activity` document (`type: 'challenge_upvoted'`, `fk_id: virtualId`, `userId: req.body.userId`).
  4. **Notification**: (Only if adding upvote) 
     - Form a recipient list consisting of: All Challenge subscribers + Challenge owner.
     - Strictly exclude the initiator's ID.
     - Bulk insert `Notification` array (`type: 'challenge_upvoted'`, `fk_id: virtualId`).
  5. Return `200 OK`.

### 9. POST `/challenges/{virtualId}/subscribe`
- **Summary**: Toggle a subscription for the challenge.
- **Path Param**: `virtualId`.
- **Request Body**: `{ "userId": "<user_id>" }`
- **Implementation Steps**:
  1. Find the challenge: `Challenge.findOne({ virtualId })`. If not found, return `404 Not Found`.
  2. Toggle logic: Check if `userId` exists in `subcriptions` array. If true, remove it (`$pull`). If false, add it (`$addToSet`). Save the document.
  3. **Activity Logging**: (Only if subscribing) Create a `User Activity` document (`type: 'challenge_subscribed'`, `fk_id: virtualId`, `userId: req.body.userId`).
  4. **Notification (Bulk Create)**: (Only if subscribing)
     - Form a recipient list consisting of: All Challenge subscribers + Challenge owner.
     - Strictly exclude the initiator's ID.
     - Bulk insert `Notification` array (`type: 'challenge_subscribed'`, `fk_id: virtualId`).
  5. Return `200 OK`.
