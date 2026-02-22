# Challenge API Implementation Specification — v2

> **Source:** `Data requirements.txt`, `challenge_model_spec.md`, `swagger.yaml`
> **Replaces:** `challenge_api_spec_final_v1.md`

---

## Endpoints

### `GET /challenges`
1. Fetch all challenges from DB, paginated via `limit` & `offset`.
2. For each challenge, compute and attach derived fields:
   - `countOfIdeas`: Count from Idea collection where `challengeId == challenge._id`.
   - `ownerDetails`: Fetch UserMinimal from User collection via `userId`.
   - `commentCount`: Count from Comment collection where `typeId == challenge._id` AND `type == 'CH'`.
   - `ideaList`: Fetch IdeaMinimal list from Idea collection by `challengeId`.
   - `comments`: Fetch CommentMinimal list from Comment collection by `typeId` and `type == 'CH'`.
   - `contributorsDetails`: Fetch UserMinimal for each unique idea owner under this challenge.
   - `contributors`: Same as `contributorsDetails` (owner details of all ideas under challenge). Default `[]`.
3. Return array of `ChallengeResponse`.

### `GET /challenges/{virtualId}`
1. Find challenge by `virtualId` field (e.g., `CH-001`).
2. Compute and attach all derived fields as above.
3. Return single `ChallengeResponse`. 404 if not found.

### `POST /challenges`
1. Validate payload against `ChallengeBase` schema.
2. Auto-generate `virtualId` programmatically (`CH-001` to `CH-999`, sequential).
3. Set `month` and `year` from current date (pre-save hook handles this).
4. Set defaults: `upVotes: []`, `subcriptions: [userId]` (creator auto-subscribes), `viewCount: 0`, `timestampOfStatusChangedToPilot: null`, `timestampOfCompleted: null`.
5. Create Activity record: `{ type: 'challenge_created', fk_id: challenge._id, userId }`.
6. Create Notification for all users (except creator): `{ type: 'challenge_created', fk_id: challenge._id, initiatorId: userId, userId: recipientId }`.
7. Return 201 with created challenge.

### `PUT /challenges/{virtualId}`
1. Find challenge by `virtualId`. 404 if not found.
2. Update provided fields.
3. Create Activity: `{ type: 'challenge_edited', fk_id: challenge._id, userId }`.
4. Create Notification for all subscribers (except editor): `{ type: 'challenge_edited', fk_id, initiatorId, userId }`.
5. Return 200.

### `PATCH /challenges/{virtualId}/status`
1. Find challenge by `virtualId`. 404 if not found.
2. Update `status` field only.
3. If new status is "In Pilot", set `timestampOfStatusChangedToPilot = new Date()`.
4. If new status is "Completed", set `timestampOfCompleted = new Date()`.
5. Create Activity: `{ type: 'challenge_status_update', fk_id, userId }`.
6. Create Notification for all subscribers (except initiator): `{ type: 'challenge_status_update' }`.
7. Return 200.

### `DELETE /challenges/{virtualId}`
1. Find challenge by `virtualId`. 404 if not found.
2. Delete all associated ideas, comments, activities, and notifications.
3. Create Activity: `{ type: 'challenge_deleted', fk_id, userId }`.
4. Create Notification for all subscribers (except deleter): `{ type: 'challenge_deleted' }`.
5. Return 204.

### `POST /challenges/{virtualId}/upvote`
1. Find challenge by `virtualId`. 404 if not found.
2. Toggle `userId` in `upVotes` array (add if absent, remove if present).
3. Auto-subscribe user to challenge if not already subscribed (add to `subcriptions`).
4. Create Activity: `{ type: 'challenge_upvoted', fk_id, userId }`.
5. Create Notification for subscribers + owner (except voter): `{ type: 'challenge_upvoted' }`.
6. Return 200 with updated upVotes.

### `POST /challenges/{virtualId}/subscribe`
1. Find challenge by `virtualId`. 404 if not found.
2. Toggle `userId` in `subcriptions` array (add if absent, remove if present).
3. Create Activity: `{ type: 'challenge_subscribed', fk_id, userId }`.
4. Create Notification for subscribers + owner (except subscriber): `{ type: 'challenge_subscribed' }`.
5. Return 200 with updated subscriptions.

### `GET /challenges/count`
1. Return `{ count: <total challenges> }`.
