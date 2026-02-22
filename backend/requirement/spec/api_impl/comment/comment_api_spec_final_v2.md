# Comment API Implementation Specification — v2

> **Source:** `Data requirements.txt`, `comment_model_spec.md`, `swagger.yaml`
> **Replaces:** `comment_api_spec_final_v1.md`

---

## Endpoints

### `GET /comments`
1. Fetch all comments from DB, paginated via `limit` & `offset`.
2. For each comment, compute and attach derived fields:
   - `userDetails`: Fetch UserMinimal from User collection via `userId`.
3. Return array of `CommentResponse`.

### `GET /comments/{id}`
1. Find comment by MongoDB `_id`. 404 if not found.
2. Attach `userDetails` derived field.
3. Return single `CommentResponse`.

### `POST /comments`
1. Validate payload against `CommentBase` schema.
2. Set `createdat` to current time (default in schema).
3. If `type == 'CH'`: Auto-subscribe commenter to the challenge (add userId to challenge's `subcriptions`).
4. If `type == 'ID'`: Auto-subscribe commenter to the idea (add userId to idea's `subscription`) AND to the parent challenge.
5. Create Activity: `{ type: 'challenge_commented' or 'idea_commented', fk_id: typeId, userId }`.
6. Create Notification:
   - If `type == 'CH'`: Notify challenge subscribers + challenge owner (except commenter): `{ type: 'challenge_commented' }`.
   - If `type == 'ID'`: Notify idea subscribers + challenge owner + challenge subscribers (except commenter): `{ type: 'idea_commented' }`.
7. Return 201.

### `PUT /comments/{id}`
1. Find comment by `_id`. 404 if not found.
2. Update comment text.
3. Return 200.

### `DELETE /comments/{id}`
1. Find comment by `_id`. 404 if not found.
2. Delete comment.
3. Return 204.

### `GET /comments/count`
1. Return `{ count: <total comments> }`.
