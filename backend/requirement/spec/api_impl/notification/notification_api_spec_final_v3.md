# Notification API Implementation Specification — v3

> **Source:** `Data requirements.txt`, `notification_model_spec.md`, `swagger.yaml`
> **Replaces:** `notification_api_spec_final_v2.md`

---

## Endpoints

### `GET /notifications`
1. Fetch all notifications from DB, paginated via `limit` & `offset`, sorted by `createdAt` descending.
2. For each notification, compute and attach derived fields:
   - `description`: Dynamically generated string from `type` + `initiatorDetails.name`. E.g., "John upvoted your challenge".
   - `linkedEntityDetails`: Fetch ChallengeMinimal or IdeaMinimal via `fk_id` based on `type` prefix.
   - `recipientDetails`: Fetch UserMinimal via `userId`.
   - `initiatorDetails`: Fetch UserMinimal via `initiatorId`.
3. Return array of `NotificationResponse`.

### `GET /notifications/{id}`
1. Find notification by MongoDB `_id`. 404 if not found.
2. Attach all derived fields as above.
3. Return single `NotificationResponse`.

### `POST /notifications`
1. Validate payload against `NotificationBase` schema.
2. Return 201.

> **Note:** Notifications are primarily created internally by other services. Direct POST for admin/testing only.

### `PUT /notifications/{id}`
1. Find notification by `_id`. 404 if not found.
2. Update provided fields.
3. Return 200.

### `PATCH /notifications/{id}/status`
1. Find notification by `_id`. 404 if not found.
2. Update `isSeen` field only (expects `{ "isSeen": true }`).
3. Return 200.

### `DELETE /notifications/{id}`
1. Find notification by `_id`. 404 if not found.
2. Delete notification.
3. Return 204.

### `GET /notifications/count`
1. Return `{ count: <total notifications> }`.

### `GET /notifications/user/{userId}` *(NEW in v3)*
1. Validate `userId` is a valid 24-char hex string. 404 if user not found.
2. Fetch all notifications from DB where `userId == userId`, paginated via `limit` & `offset`, sorted by `createdAt` descending.
3. For each notification, compute and attach all derived fields (same as `GET /notifications`).
4. Return array of `NotificationResponse`.

### `GET /notifications/user/{userId}/count` *(NEW in v3)*
1. Validate `userId` is a valid 24-char hex string. 404 if user not found.
2. If query parameter `isSeen` is present:
   - Parse as boolean (`true` or `false`).
   - Count notifications where `userId == userId` AND `isSeen == isSeen`.
3. If query parameter `isSeen` is absent:
   - Count all notifications where `userId == userId` (regardless of seen status).
4. Return `{ count: <number> }`.

---

## Notification Recipient Logic

| Trigger Event | Recipients |
|---------------|-----------|
| `challenge_created` | All users (except initiator) |
| `challenge_status_update` | All challenge subscribers (except initiator) |
| `challenge_edited` | All challenge subscribers (except initiator) |
| `idea_created` | Idea subscribers + Challenge owner + Challenge subscribers (except initiator) |
| `idea_edited` | Idea subscribers + Challenge owner + Challenge subscribers (except initiator) |
| `challenge_upvoted` | Challenge subscribers + Challenge owner (except initiator) |
| `idea_upvoted` | Idea subscribers + Challenge owner + Challenge subscribers (except initiator) |
| `challenge_commented` | Challenge subscribers + Challenge owner (except initiator) |
| `idea_commented` | Idea subscribers + Challenge owner + Challenge subscribers (except initiator) |
| `challenge_subscribed` | Challenge subscribers + Challenge owner (except initiator) |
| `idea_subscribed` | Idea subscribers + Challenge owner + Challenge subscribers (except initiator) |
| `challenge_deleted` | Challenge subscribers + Challenge owner (except initiator) |
| `idea_deleted` | Idea subscribers + Challenge owner + Challenge subscribers (except initiator) |

## Notification Type Enum
```
challenge_created, challenge_status_update, challenge_edited, idea_edited,
challenge_upvoted, idea_upvoted,
challenge_commented, idea_commented, challenge_subscribed, idea_subscribed,
challenge_deleted, idea_deleted
```
