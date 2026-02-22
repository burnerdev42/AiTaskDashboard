# Comment API Implementation Specification — v3

> **Source:** `Data requirements.txt`, `comment_model_spec.md`, `swagger.yaml`
> **Replaces:** `comment_api_spec_final_v2.md`

---

## Global Response Envelope

All endpoints in this domain MUST wrap their response in the standardized API response envelope:

```json
{
  "status": "success" | "failed",
  "message": "<human-readable message>",
  "timestamp": "<ISO 8601 date-time>",
  "data": { /* domain-specific payload */ }
}
```

- List responses: `data.comments` (array)
- Single entity responses: `data.comment` (object)
- Count responses: `data.count` (integer)
- On failure: `data` may be `null`.

---

## Common Derived Fields Logic

For every `CommentResponse`, attach:
- `userDetails`: `User.findById(comment.userId).select('_id name email companyTechRole role').lean()`

---

## Virtual ID Prefix Routing

Comment endpoints that accept a `virtualId` parameter use the prefix to determine the comment type:
- Prefix `CH-` → `type = "CH"` (Challenge). Resolve challenge via `Challenge.findOne({ virtualId })`.
- Prefix `ID-` → `type = "ID"` (Idea). Resolve idea via `Idea.findOne({ ideaId: virtualId })`.

This maps directly to Comment Types `["CH", "ID"]`.

---

## Endpoints

### `GET /comments`
1. Fetch all comments from DB, paginated via `limit` & `offset`.
2. For each comment, compute and attach derived fields:
   - `userDetails`: Fetch UserMinimal from User collection via `userId`.
3. Return `{ status: "success", message: "Comments fetched successfully", timestamp, data: { comments: [...] } }`.

### `GET /comments/{id}`
1. Find comment by MongoDB `_id`. 404 if not found.
2. Attach `userDetails` derived field.
3. Return `{ status: "success", ..., data: { comment: { ... } } }`.

### `POST /comments`
1. Validate payload against `CommentBase` schema.
2. Set `createdat` to current time (default in schema).
3. If `type == 'CH'`: Auto-subscribe commenter to the challenge (add userId to challenge's `subcriptions`).
4. If `type == 'ID'`: Auto-subscribe commenter to the idea (add userId to idea's `subscription`) AND to the parent challenge.
5. Create Activity: `{ type: 'challenge_commented' or 'idea_commented', fk_id: typeId, userId }`.
6. Create Notification:
   - If `type == 'CH'`: Notify challenge subscribers + challenge owner (except commenter): `{ type: 'challenge_commented' }`.
   - If `type == 'ID'`: Notify idea subscribers + challenge owner + challenge subscribers (except commenter): `{ type: 'idea_commented' }`.
7. Return 201 with `{ status: "success", message: "Comment created successfully", timestamp, data: { comment: { ... } } }`.

### `PUT /comments/{id}`
1. Find comment by `_id`. 404 if not found.
2. Update comment text.
3. Return 200 with `{ status: "success", ..., data: { comment: { ... } } }`.

### `DELETE /comments/{id}`
1. Find comment by `_id`. 404 if not found.
2. Delete comment.
3. Return 204 (no body).

### `GET /comments/count`
1. Count total comments via `Comment.countDocuments()`.
2. Return `{ status: "success", message: "Comment count fetched successfully", timestamp, data: { count: <number> } }`.

---

### `GET /comments/challenge/{virtualId}`
1. Resolve the challenge by `Challenge.findOne({ virtualId })`. 404 if not found.
2. Query `Comment.find({ typeId: challenge._id.toString(), type: 'CH' })` with derived field population.
3. Attach `userDetails` for each comment.
4. Return `{ status: "success", ..., data: { comments: [...] } }`.

### `GET /comments/challenge/{virtualId}/count`
1. Resolve the challenge by `Challenge.findOne({ virtualId })`. 404 if not found.
2. Count via `Comment.countDocuments({ typeId: challenge._id.toString(), type: 'CH' })`.
3. Return `{ status: "success", ..., data: { count: <number> } }`.

### `GET /comments/idea/{virtualId}`
1. Resolve the idea by `Idea.findOne({ ideaId: virtualId })`. 404 if not found.
2. Query `Comment.find({ typeId: idea._id.toString(), type: 'ID' })` with derived field population.
3. Attach `userDetails` for each comment.
4. Return `{ status: "success", ..., data: { comments: [...] } }`.

### `GET /comments/idea/{virtualId}/count`
1. Resolve the idea by `Idea.findOne({ ideaId: virtualId })`. 404 if not found.
2. Count via `Comment.countDocuments({ typeId: idea._id.toString(), type: 'ID' })`.
3. Return `{ status: "success", ..., data: { count: <number> } }`.

### `GET /comments/user/{userId}`
1. Validate `userId` is a valid 24-character hex string. 400 if invalid.
2. Query `Comment.find({ userId })` with pagination (`limit`, `offset`).
3. Attach `userDetails` for each comment.
4. Return `{ status: "success", ..., data: { comments: [...] } }`.

### `GET /comments/user/{userId}/count`
1. Validate `userId` is a valid 24-character hex string. 400 if invalid.
2. Count via `Comment.countDocuments({ userId })`.
3. Return `{ status: "success", ..., data: { count: <number> } }`.
