# Idea API Implementation Specification

This document details the step-by-step implementation logic for the Idea domain API endpoints, adhering to the database schema, business logic, and the Swagger documentation.

## Common Aggregation & Derived Fields Logic

For a given `idea`:
1. **`challengeDetails`**: `Challenge.findOne({ virtualId: idea.challengeId }).select('_id virtualId title')`
2. **`problemStatement`**: Derived from parent challenge description.
3. **`ownerDetails`**: `User.findById(idea.userId).select('_id name email companyTechRole role')`
4. **`comments`**: `Comment.find({ type: 'ID', typeId: idea.ideaId })`.
5. **`commentCount`**: Length of `comments`.
6. **`upvoteCount`**: Length of `upVotes` array (alias for appreciationCount).
7. **`viewCount`**: Direct DB map.

## Endpoints

### 1. GET `/ideas`
- **Implementation Steps**: 
  1. Extract `limit`/`offset`. 
  2. Query `Idea.find({}).skip(offset).limit(limit).lean()`.
  3. Apply **Common Aggregation Logic**.
  4. Return `200 OK`.

### 2. POST `/ideas`
- **Implementation Steps**: 
  1. Validate `challengeId`. Generate `ideaId`.
  2. Set defaults (`viewCount: 0`).
  3. Publish Subscriptions (User -> Idea, User -> implicit Challenge subscription if not present).
  4. `Idea.create(...)`.
  5. Fire Notification & Activity events (idea_created).
  6. Return `201 Created`.

### 3. GET `/ideas/count`
- **Implementation Steps**: `Idea.countDocuments({})`. Return `200`.

### 4. GET `/ideas/{virtualId}`
- **Implementation Steps**: 
  1. Query `Idea.findOne({ ideaId: virtualId }).lean()`. `404` if not found.
  2. Apply **Common Aggregation Logic**.
  3. Return `200 OK`.

### 5. PUT `/ideas/{virtualId}`
- **Implementation Steps**: 
  1. `Idea.findOneAndUpdate({ ideaId: virtualId }, req.body, { new: true })`. `404` if not found.
  2. Fire Notification & Activity events (idea_edited).
  3. Return `200 OK`.

### 6. DELETE `/ideas/{virtualId}`
- **Implementation Steps**:
  1. `Idea.findOneAndDelete({ ideaId: virtualId })`. `404` if not found.
  2. Cascade delete linked comments.
  3. Fire Notification & Activity events (idea_deleted).
  4. Return `204 No Content`.

### 7. POST `/ideas/{virtualId}/upvote`
- **Implementation Steps**:
  1. Toggle `userId` in `upVotes` array.
  2. Fire Notification & Activity events (idea_upvoted).
  3. Return `200 OK`.

### 8. POST `/ideas/{virtualId}/subscribe`
- **Implementation Steps**:
  1. Toggle `userId` in `subscription` array. 
  2. Fire Notification & Activity events (idea_subscribed).
  3. Return `200 OK`.

### 9. POST `/ideas/{virtualId}/view` (NEW)
- **Implementation Steps**:
  1. `Idea.findOneAndUpdate({ ideaId: virtualId }, { $inc: { viewCount: 1 } }, { new: true })`.
  2. If not found, `404 Not Found`.
  3. Apply **Common Aggregation Logic** to return updated idea.
  4. Return `200 OK`.
