# Comment API Implementation Specification

This document details the step-by-step implementation logic for the Comment domain API endpoints, fully adhering to the defined Database schema (`comment_model_spec.md`), business requirements (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `Comment` MongoDB document with derived fields. When fetching a comment or a list of comments, the following logic should be applied:

For a given `comment`:
1. **`userDetails`** (Maps to `UserMinimal`):
   - Query `users` collection: `User.findById(comment.userId).select('_id name email companyTechRole role')`

## Endpoints

### 1. GET `/comments`
- **Summary**: Get all comments with pagination and derived fields.
- **Query Params**: `limit` (default: 20), `offset` (default: 0).
- **Implementation Steps**:
  1. Parse `limit` and `offset` from `req.query`.
  2. Query `Comment.find({}).skip(offset).limit(limit).lean()`.
  3. Execute the **Common Aggregation Logic** to populate the `userDetails` field for each item.
  4. Return `200 OK` with the array formatted per `CommentResponse`.

### 2. POST `/comments`
- **Summary**: Create a new comment.
- **Request Body**: Matches `CommentBase` schema (`userId`, `comment`, `type`, `typeId`, `createdat`).
- **Implementation Steps**:
  1. Validate incoming request body against `CommentBase` schema constraints. Ensure `type` is either `'CH'` or `'ID'`.
  2. Insert document: `Comment.create(req.body)`.
  3. Based on the `type`, locate the parent entity (`Challenge` or `Idea`) using `typeId`.
     - **If `type` === 'CH'**:
       - Query `Challenge.findOne({ virtualId: req.body.typeId })`.
       - Push the commenter's `userId` to the challenge's `subcriptions` array if not already present.
       - **Activity Logging**: Create a `User Activity` document (`type: 'challenge_commented'`, `fk_id: typeId`, `userId: req.body.userId`).
       - **Notification (Bulk Create)**:
         - Form a recipient list: All challenge subscribers + Challenge owner.
         - Strictly exclude the initiator's ID.
         - Bulk insert `Notification` array (`type: 'challenge_commented'`, `fk_id: typeId`).
     - **If `type` === 'ID'**:
       - Query `Idea.findOne({ ideaId: req.body.typeId })`.
       - Push the commenter's `userId` to the idea's `subscription` array AND to the parent Challenge's `subcriptions` array if not already present.
       - **Activity Logging**: Create a `User Activity` document (`type: 'idea_commented'`, `fk_id: typeId`, `userId: req.body.userId`).
       - **Notification (Bulk Create)**:
         - Form a recipient list: All Idea subscribers + Challenge owner + All Challenge subscribers.
         - Strictly exclude the initiator's ID.
         - Bulk insert `Notification` array (`type: 'idea_commented'`, `fk_id: typeId`).
  4. Return `201 Created`.

### 3. GET `/comments/count`
- **Summary**: Get total count of comments.
- **Implementation Steps**:
  1. Query `Comment.countDocuments({})`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/comments/{id}`
- **Summary**: Get a specific comment by its MongoDB `_id`.
- **Path Param**: `id` (24-character hexadecimal string).
- **Implementation Steps**:
  1. Query `Comment.findById(id).lean()`.
  2. If not found, return `404 Not Found`.
  3. Execute **Common Aggregation Logic** to populate `userDetails`.
  4. Return `200 OK` with the enriched `CommentResponse` object.

### 5. PUT `/comments/{id}`
- **Summary**: Fully update an existing comment.
- **Path Param**: `id` (MongoDB `_id`).
- **Request Body**: Matches `CommentBase` schema.
- **Implementation Steps**:
  1. Find and update the document using `Comment.findByIdAndUpdate(id, req.body, { new: true })`.
  2. If not found, return `404 Not Found`.
  3. *Note: Data Requirements do not specify new Notification or Activity records for simply editing a comment on an entity.*
  4. Return `200 OK`.

### 6. DELETE `/comments/{id}`
- **Summary**: Delete a comment by its MongoDB `_id`.
- **Path Param**: `id`.
- **Implementation Steps**:
  1. Find and delete the comment: `Comment.findByIdAndDelete(id)`.
  2. If not found, return `404 Not Found`.
  3. *Note: Data Requirements do not specify broadcasting a notification when a user merely deletes their own comment.*
  4. Return `204 No Content`.
