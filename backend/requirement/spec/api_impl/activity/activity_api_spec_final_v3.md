# Activity API Implementation Specification — v3

> **Source:** `Data requirements.txt`, `activity_model_spec.md`, `swagger.yaml`
> **Replaces:** `activity_api_spec_final_v2.md`

---

## Endpoints

### `GET /activities`
1. Fetch all activities from DB, paginated via `limit` & `offset`, sorted by `createdAt` descending.
2. For each activity, compute and attach derived fields:
   - `userDetails`: Fetch UserMinimal from User collection via `userId`.
   - `entityDetails`: Fetch ChallengeMinimal or IdeaMinimal via `fk_id` based on `type` prefix (`challenge_*` → Challenge, `idea_*` → Idea). Null for `log_in`/`log_out`.
   - `activitySummary`: Dynamically generated human-readable string combining `type` + `userDetails.name` + entity title. E.g., "John created challenge CH-001".
3. Return array of `ActivityResponse`.

### `GET /activities/{id}`
1. Find activity by MongoDB `_id`. 404 if not found.
2. Attach all derived fields as above.
3. Return single `ActivityResponse`.

### `POST /activities`
1. Validate payload against `ActivityBase` schema.
2. Set `month` and `year` from current date (pre-save hook).
3. Return 201.

> **Note:** Activities are primarily created internally by other services (Challenge, Idea, Comment, Auth). Direct POST is available for administrative or testing purposes.

### `PUT /activities/{id}`
1. Find activity by `_id`. 404 if not found.
2. Update provided fields.
3. Return 200.

### `DELETE /activities/{id}`
1. Find activity by `_id`. 404 if not found.
2. Delete activity.
3. Return 204.

### `GET /activities/count`
1. Return `{ count: <total activities> }`.

### `GET /activities/user/{userId}` *(NEW in v3)*
1. Validate `userId` is a valid 24-char hex string. 404 if user not found.
2. Fetch all activities from DB where `userId == userId`, paginated via `limit` & `offset`, sorted by `createdAt` descending.
3. For each activity, compute and attach all derived fields (same as `GET /activities`).
4. Return array of `ActivityResponse`.

### `GET /activities/user/{userId}/count` *(NEW in v3)*
1. Validate `userId` is a valid 24-char hex string. 404 if user not found.
2. Count all activity records where `userId == userId`.
3. Return `{ count: <number> }`.

> **Note:** Activities are an internal audit trail and do not have a seen/unseen status. Count reflects the total number of activities for the user.

---

## Activity Type Enum
```
challenge_created, idea_created, challenge_status_update,
challenge_edited, idea_edited, challenge_upvoted, idea_upvoted,
challenge_commented, idea_commented, challenge_subscribed,
idea_subscribed, challenge_deleted, idea_deleted, log_in, log_out
```
