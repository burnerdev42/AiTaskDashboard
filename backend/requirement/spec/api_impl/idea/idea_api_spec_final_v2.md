# Idea API Implementation Specification — v2

> **Source:** `Data requirements.txt`, `idea_model_spec.md`, `swagger.yaml`
> **Replaces:** `idea_api_spec_final_v1.md`

---

## Endpoints

### `GET /ideas`
1. Fetch all ideas from DB, paginated via `limit` & `offset`.
2. For each idea, compute and attach derived fields:
   - `challengeDetails`: Fetch ChallengeMinimal from Challenge collection via `challengeId`.
   - `problemStatement`: The `description` field from the parent Challenge.
   - `commentCount`: Count from Comment collection where `typeId == idea._id` AND `type == 'ID'`.
   - `comments`: Fetch CommentMinimal list from Comment collection by `typeId` and `type == 'ID'`.
   - `ownerDetails`: Fetch UserMinimal from User collection via `userId`.
3. Return array of `IdeaResponse`.

### `GET /ideas/{virtualId}`
1. Find idea by `ideaId` field (e.g., `ID-0001`).
2. Compute and attach all derived fields as above.
3. Return single `IdeaResponse`. 404 if not found.

### `POST /ideas`
1. Validate payload against `IdeaBase` schema.
2. Auto-generate `ideaId` programmatically (`ID-0001` to `ID-9999`, sequential).
3. Set `month` and `year` from current date (pre-save hook).
4. Set defaults: `upVotes: []`, `subscription: [userId]` (creator auto-subscribes), `viewCount: 0`, `appreciationCount: 0`, `status: true`.
5. Auto-subscribe creator to the parent challenge (add userId to challenge's `subcriptions` if not present).
6. Create Activity: `{ type: 'idea_created', fk_id: idea._id, userId }`.
7. Create Notification for challenge subscribers + challenge owner (except creator): `{ type: 'idea_created' }`.
8. Return 201.

### `PUT /ideas/{virtualId}`
1. Find idea by `ideaId`. 404 if not found.
2. Update provided fields.
3. Create Activity: `{ type: 'idea_edited', fk_id, userId }`.
4. Create Notification for idea subscribers + challenge owner + challenge subscribers (except editor): `{ type: 'idea_edited' }`.
5. Return 200.

### `DELETE /ideas/{virtualId}`
1. Find idea by `ideaId`. 404 if not found.
2. Delete associated comments.
3. Create Activity: `{ type: 'idea_deleted', fk_id, userId }`.
4. Create Notification for idea subscribers + challenge owner + challenge subscribers (except deleter): `{ type: 'idea_deleted' }`.
5. Return 204.

### `POST /ideas/{virtualId}/upvote`
1. Find idea by `ideaId`. 404 if not found.
2. Toggle `userId` in `upVotes` array.
3. Update `appreciationCount` to match `upVotes.length`.
4. Auto-subscribe user to the idea and its parent challenge.
5. Create Activity: `{ type: 'idea_upvoted', fk_id, userId }`.
6. Create Notification for idea subscribers + challenge owner + challenge subscribers (except voter): `{ type: 'idea_upvoted' }`.
7. Return 200.

### `POST /ideas/{virtualId}/subscribe`
1. Find idea by `ideaId`. 404 if not found.
2. Toggle `userId` in `subscription` array.
3. Auto-subscribe user to the parent challenge.
4. Create Activity: `{ type: 'idea_subscribed', fk_id, userId }`.
5. Create Notification for idea subscribers + challenge owner + challenge subscribers (except subscriber): `{ type: 'idea_subscribed' }`.
6. Return 200.

### `GET /ideas/count`
1. Return `{ count: <total ideas> }`.
