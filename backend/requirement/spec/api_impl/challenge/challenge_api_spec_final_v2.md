# Challenge API Implementation Specification

This document details the step-by-step implementation logic for the Challenge domain API endpoints, adhering to the database schema, business logic, and the Swagger API documentation.

## Common Aggregation & Derived Fields Logic

For a given `challenge`:
1. **`ownerDetails`**: `User.findById(challenge.userId).select('_id name email companyTechRole role')`
2. **`ideaList`**: `Idea.find({ challengeId: challenge.virtualId }).select('_id ideaId title')`
3. **`countOfIdeas`**: Length of `ideaList`.
4. **`contributorsDetails`**: Distinct `userId` from `ideaList` mapped to `User` profiles.
5. **`contributorsCount`**: Length of `contributorsDetails`.
6. **`comments`**: `Comment.find({ type: 'CH', typeId: challenge.virtualId })`.
7. **`commentCount`**: Length of `comments`.
8. **`upvoteCount`**: Length of `upVotes` array.
9. **`totalViews`**: Direct map from DB `viewCount`.
10. **`upvoteList`**: Alias/Direct map from DB `upVotes`.

## Endpoints

### 1. GET `/challenges`
- **Implementation Steps**: 
  1. Extract `limit`/`offset`. 
  2. Query `Challenge.find({}).skip(offset).limit(limit).lean()`.
  3. Apply **Common Aggregation Logic**.
  4. Return `200 OK`.

### 2. POST `/challenges`
- **Implementation Steps**: 
  1. Generate `virtualId`.
  2. Set explicit defaults (`viewCount: 0`). User automatically becomes subscriber.
  3. `Challenge.create(...)`.
  4. Fire Notification & Activity events (challenge_created).
  5. Return `201 Created`.

### 3. GET `/challenges/count`
- **Implementation Steps**: `Challenge.countDocuments({})`. Return `200`.

### 4. GET `/challenges/{virtualId}`
- **Implementation Steps**: 
  1. Query `Challenge.findOne({ virtualId }).lean()`. `404` if not found.
  2. Apply **Common Aggregation Logic**.
  3. Return `200 OK`.

### 5. PUT `/challenges/{virtualId}`
- **Implementation Steps**: 
  1. `Challenge.findOneAndUpdate({ virtualId }, req.body, { new: true })`. `404` if not found.
  2. Fire Notification & Activity events (challenge_edited).
  3. Return `200 OK`.

### 6. PATCH `/challenges/{virtualId}`
- **Implementation Steps**: 
  1. Validate status updates. Set `timestampOfStatusChangedToPilot` if moving to pilot. Set `timestampOfCompleted` if completed.
  2. `Challenge.findOneAndUpdate({ virtualId }, { status: ... })`.
  3. Fire Notification & Activity events (challenge_status_update).
  4. Return `200 OK`.

### 7. DELETE `/challenges/{virtualId}`
- **Implementation Steps**:
  1. `Challenge.findOneAndDelete({ virtualId })`. `404` if not found.
  2. Cascade deletions.
  3. Fire Notification & Activity events (challenge_deleted).
  4. Return `204 No Content`.

### 8. POST `/challenges/{virtualId}/upvote`
- **Implementation Steps**:
  1. Toggle `userId` in `upVotes` array. `$pull` if exists, `$addToSet` if not.
  2. Fire Notification & Activity events (challenge_upvoted).
  3. Return `200 OK`.

### 9. POST `/challenges/{virtualId}/subscribe`
- **Implementation Steps**:
  1. Toggle `userId` in `subcriptions` array.
  2. Fire Notification & Activity events (challenge_subscribed).
  3. Return `200 OK`.

### 10. POST `/challenges/{virtualId}/view` (NEW)
- **Implementation Steps**:
  1. `Challenge.findOneAndUpdate({ virtualId }, { $inc: { viewCount: 1 } }, { new: true })`.
  2. If not found, `404 Not Found`.
  3. Apply **Common Aggregation Logic** to return updated challenge.
  4. Return `200 OK`.
