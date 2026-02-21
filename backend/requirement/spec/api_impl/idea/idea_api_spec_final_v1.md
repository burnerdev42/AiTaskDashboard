# Idea API Implementation Specification

This document details the step-by-step implementation logic for the Idea domain API endpoints, adhering to the database schema (`idea_model_spec.md`), business logic (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `Idea` MongoDB document with derived fields. When fetching an idea or a list of ideas, the following logic should be applied (ideally via an aggregation pipeline `$lookup` or parallel Mongoose queries):

For a given `idea`:
1. **`challengeDetails`** (Maps to `ChallengeMinimal`):
   - Query `challenges` collection: `Challenge.findOne({ virtualId: idea.challengeId }).select('_id virtualId title')`
2. **`problemStatement`**:
   - Pulled from the `description` field of the parent challenge fetched above.
3. **`ownerDetails`** (Maps to `UserMinimal`):
   - Query `users` collection: `User.findById(idea.userId).select('_id name email companyTechRole role')`
4. **`comments`** (Array of `CommentMinimal`):
   - Query `comments` collection: `Comment.find({ type: 'ID', typeId: idea.ideaId }).select('_id comment userId createdat')`
5. **`commentCount`**:
   - Derived from the length of the `comments` array or via a `countDocuments` query.

## Endpoints

### 1. GET `/ideas`
- **Summary**: Get all ideas with pagination and derived fields.
- **Query Params**: `limit` (default: 20), `offset` (default: 0).
- **Implementation Steps**:
  1. Parse `limit` and `offset` from `req.query`.
  2. Query `Idea.find({}).skip(offset).limit(limit).lean()`.
  3. Execute the **Common Aggregation Logic** to populate derived fields for each item in the results.
  4. Return `200 OK` with the array formatted per `IdeaResponse`.

### 2. POST `/ideas`
- **Summary**: Create a new idea.
- **Request Body**: Matches `IdeaBase` schema.
- **Implementation Steps**:
  1. Validate incoming request body against `IdeaBase` schema constraints. Verify that `challengeId` exists.
  2. Generate a programmatic `ideaId` (Format `ID-0001` to `ID-9999`):
     - Query `Idea.findOne({}, { ideaId: 1 }).sort({ ideaId: -1 })`.
     - Extract numeric part, increment by 1, and pad zeros (if none exist, use `ID-0001`).
  3. Set implicit derived fields natively (`CreatedAt`, `updatedAt` via Mongoose `timestamps`), and explicitly extract `month` and `year` as integers.
  4. Initialize defaults: `status: true`, `upVotes: []`, `appreciationCount: 0`, `viewCount: 0`.
  5. Establish Subscriptions: 
     - Push `userId` (creator) to the idea's `subscription` list.
     - Also push `userId` to the parent challenge's `subcriptions` list if not already present.
  6. Insert document: `Idea.create(...)`.
  7. **Activity Logging**: Create a `User Activity` document (`type: 'idea_created'`, `fk_id: ideaId`, `userId: req.body.userId`).
  8. **Notification (Bulk Create)**: 
     - Retrieve the parent Challenge document to get its `subcriptions` and `userId` (owner).
     - Form a recipient list consisting of: All Idea subscribers + Challenge owner + All Challenge subscribers.
     - Strictly exclude the initiator's ID from this list. Remove duplicates.
     - Create an array of `Notification` objects for the matching recipients (`type: 'idea_created'`, `fk_id: ideaId`, `userId: <recipient_id>`).
     - Bulk insert the array (`Notification.insertMany(...)`).
  9. Return `201 Created`.

### 3. GET `/ideas/count`
- **Summary**: Get total count of ideas.
- **Implementation Steps**:
  1. Query `Idea.countDocuments({})`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/ideas/{virtualId}`
- **Summary**: Get a specific idea by its Virtual ID (`ideaId`).
- **Path Param**: `virtualId` (e.g., "ID-0001").
- **Implementation Steps**:
  1. Query `Idea.findOne({ ideaId: virtualId }).lean()`.
  2. If not found, return `404 Not Found`.
  3. Execute **Common Aggregation Logic** to populate derived fields `challengeDetails`, `problemStatement`, `ownerDetails`, `comments`, and `commentCount`.
  4. Return `200 OK` with the enriched `IdeaResponse` object.

### 5. PUT `/ideas/{virtualId}`
- **Summary**: Fully update an existing idea.
- **Path Param**: `virtualId`.
- **Request Body**: Matches `IdeaBase` schema.
- **Implementation Steps**:
  1. Find and update the document using `Idea.findOneAndUpdate({ ideaId: virtualId }, req.body, { new: true })`.
  2. If not found, return `404 Not Found`.
  3. Retrieve the parent Challenge document to get its `subcriptions` and `userId` (owner).
  4. **Activity Logging**: Create a `User Activity` document (`type: 'idea_edited'`, `fk_id: virtualId`, `userId: initiatorId`).
  5. **Notification (Bulk Create)**:
     - Form a recipient list consisting of: All Idea subscribers + Challenge owner + All Challenge subscribers.
     - Strictly exclude the initiator's ID from this list. Remove duplicates.
     - Create an array of `Notification` objects for the matching recipients (`type: 'idea_edited'`, `fk_id: virtualId`, `userId: <recipient_id>`).
     - Bulk insert the array (`Notification.insertMany(...)`).
  6. Return `200 OK`.

### 6. DELETE `/ideas/{virtualId}`
- **Summary**: Delete an idea by its Virtual ID.
- **Path Param**: `virtualId`.
- **Implementation Steps**:
  1. Find the idea first to get its parent `challengeId` and references, then attempt deletion: `Idea.findOneAndDelete({ ideaId: virtualId })`.
  2. If not found, return `404 Not Found`.
  3. Retrieve the parent Challenge document to get its `subcriptions` and `userId` (owner).
  4. Cascade effect: Delete all associated `Comment` documents linking to `idea.ideaId`.
  5. **Activity Logging**: Create a `User Activity` document (`type: 'idea_deleted'`, `fk_id: virtualId`, `userId: initiatorId`).
  6. **Notification (Bulk Create)**:
     - Form a recipient list consisting of: All Idea subscribers + Challenge owner + All Challenge subscribers.
     - Strictly exclude the initiator's ID from this list. Remove duplicates.
     - Create an array of `Notification` objects for these recipients (`type: 'idea_deleted'`, `fk_id: virtualId`, `userId: <recipient_id>`).
     - Bulk insert the array (`Notification.insertMany(...)`).
  7. Return `204 No Content`.

### 7. POST `/ideas/{virtualId}/upvote`
- **Summary**: Toggle an upvote for an idea.
- **Path Param**: `virtualId`.
- **Request Body**: `{ "userId": "<user_id>" }`
- **Implementation Steps**:
  1. Find the idea: `Idea.findOne({ ideaId: virtualId })`. If not found, return `404 Not Found`.
  2. Toggle logic: Check if `userId` exists in `UpVotes` array. If true, remove it (`$pull`). If false, add it (`$addToSet`). Save the document.
  3. **Activity Logging**: (Only if adding upvote) Create a `User Activity` document (`type: 'idea_upvoted'`, `fk_id: virtualId`, `userId: req.body.userId`).
  4. **Notification**: (Only if adding upvote)
     - Retrieve the parent Challenge document to get its `subcriptions` and `userId` (owner).
     - Form a recipient list consisting of: All Idea subscribers + Challenge owner + All Challenge subscribers.
     - Strictly exclude the initiator's ID from this list. Remove duplicates.
     - Bulk insert `Notification` array (`type: 'idea_upvoted'`, `fk_id: virtualId`).
  5. Return `200 OK`.

### 8. POST `/ideas/{virtualId}/subscribe`
- **Summary**: Toggle a subscription for an idea.
- **Path Param**: `virtualId`.
- **Request Body**: `{ "userId": "<user_id>" }`
- **Implementation Steps**:
  1. Find the idea: `Idea.findOne({ ideaId: virtualId })`. If not found, return `404 Not Found`.
  2. Toggle logic: Check if `userId` exists in `Subscription` array. If true, remove it (`$pull`). If false, add it (`$addToSet`). Save the document.
  3. **Activity Logging**: (Only if subscribing) Create a `User Activity` document (`type: 'idea_subscribed'`, `fk_id: virtualId`, `userId: req.body.userId`).
  4. **Notification**: (Only if subscribing)
     - Retrieve the parent Challenge document to get its `subcriptions` and `userId` (owner).
     - Form a recipient list consisting of: All Idea subscribers + Challenge owner + All Challenge subscribers.
     - Strictly exclude the initiator's ID from this list. Remove duplicates.
     - Bulk insert `Notification` array (`type: 'idea_subscribed'`, `fk_id: virtualId`).
  5. Return `200 OK`.
