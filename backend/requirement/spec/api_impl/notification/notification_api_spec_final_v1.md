# Notification API Implementation Specification

This document details the step-by-step implementation logic for the Notification domain API endpoints, adhering to the Database schema (`notification_model_spec.md`), business requirements (`Data requirements.txt`), and the API Swagger documentation (`swagger.yaml`).

## Common Aggregation & Derived Fields Logic

Several `GET` endpoints require enriching the base `Notification` MongoDB document with derived fields. When fetching a notification or a list of notifications, the following logic should be applied:

For a given `notification`:
1. **`recipientDetails`** (Maps to `UserMinimal`):
   - Query `users` collection: `User.findById(notification.userId).select('_id name email companyTechRole role')`

2. **`initiatorDetails`** (Maps to `UserMinimal`):
   - Query `users` collection: `User.findById(notification.initiatorId).select('_id name email companyTechRole role')`

3. **`linkedEntityDetails`** (Maps to `ChallengeMinimal` or `IdeaMinimal`):
   - Determine the foreign key target based on `notification.type`. 
     - If the `type` starts with `challenge_` (e.g., `challenge_created`):
       - Query `challenges` collection: `Challenge.findOne({ virtualId: notification.fk_id }).select('_id virtualId title')`
     - If the `type` starts with `idea_` (e.g., `idea_upvoted`):
       - Query `ideas` collection: `Idea.findOne({ ideaId: notification.fk_id }).select('_id ideaId title')`

4. **`description`** (String):
   - Dynamically generated string based on `Type` and `initiatorDetails.name` (e.g., "John Doe submitted a challenge").

## Endpoints

### 1. GET `/notifications`
- **Summary**: Get all notifications for the requesting user (assuming user context is known) with pagination.
- **Query Params**: `limit` (default: 20), `offset` (default: 0).
- **Implementation Steps**:
  1. Determine the requesting user's `userId`. (If no auth layer is present yet, potentially pass `userId` via query param or headers, or if fetching literally *all* notifications system-wide, omit this filter).
  2. Parse `limit` and `offset` from `req.query`.
  3. Query `Notification.find({ userId: requestingUserId }).sort({ createdAt: -1 }).skip(offset).limit(limit).lean()`.
  4. Execute the **Common Aggregation Logic** to populate `recipientDetails` and `linkedEntityDetails`.
  5. Return `200 OK` with the array formatted per `NotificationResponse`.

### 2. POST `/notifications`
- **Summary**: Create a new notification manually (system events usually trigger creation, but this is a standard CRUD route).
- **Request Body**: Matches `NotificationBase` schema.
- **Implementation Steps**:
  1. Validate incoming request body.
  2. Map out implicit `createdAt` using Mongoose timestamps.
  3. Ensure `isSeen` defaults to `false`.
  4. Insert document: `Notification.create(req.body)`.
  5. Return `201 Created`.

### 3. GET `/notifications/count`
- **Summary**: Get total count of notifications (for a user).
- **Implementation Steps**:
  1. Query `Notification.countDocuments({ userId: requestingUserId })`.
  2. Return `200 OK` with `{ count: <result> }`.

### 4. GET `/notifications/{id}`
- **Summary**: Get a specific notification by its MongoDB `_id`.
- **Path Param**: `id` (24-char hex string).
- **Implementation Steps**:
  1. Query `Notification.findById(id).lean()`.
  2. If not found, return `404 Not Found`.
  3. Execute **Common Aggregation Logic** to populate derived fields.
  4. Return `200 OK` with the enriched `NotificationResponse` object.

### 5. PUT `/notifications/{id}`
- **Summary**: Fully update a notification.
- **Path Param**: `id`.
- **Request Body**: Matches `NotificationBase` schema.
- **Implementation Steps**:
  1. Find and update the document: `Notification.findByIdAndUpdate(id, req.body, { new: true })`.
  2. If not found, return `404 Not Found`.
  3. Return `200 OK`.

### 6. PATCH `/notifications/{id}/status`
- **Summary**: Update the `isSeen` status of a notification.
- **Path Param**: `id`.
- **Request Body**: `{ "isSeen": true }`
- **Implementation Steps**:
  1. Validate the body contains `isSeen` as a boolean.
  2. Update the document: `Notification.findByIdAndUpdate(id, { isSeen: req.body.isSeen }, { new: true })`.
  3. If not found, return `404 Not Found`.
  4. Return `200 OK`.

### 7. DELETE `/notifications/{id}`
- **Summary**: Delete a notification.
- **Path Param**: `id`.
- **Implementation Steps**:
  1. Find and delete the notification: `Notification.findByIdAndDelete(id)`.
  2. If not found, return `404 Not Found`.
  3. Return `204 No Content`.
