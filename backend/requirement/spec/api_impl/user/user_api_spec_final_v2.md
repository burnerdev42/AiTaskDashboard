# User API Implementation Specification — v2

> **Source:** `Data requirements.txt`, `user_model_spec.md`, `swagger.yaml`
> **Replaces:** `user_api_spec_final_v1.md`

---

## Endpoints

### `GET /users`
1. Fetch all users from DB, paginated via `limit` & `offset`.
2. **Never include `password`** in response — strip it in the service layer.
3. For each user, compute and attach derived fields:
   - `upvoteCount`: Sum of upvotes on all challenges + ideas submitted by this user (count from Challenge where `userId == user._id` and sum `upVotes.length`, plus count from Idea where `userId == user._id` and sum `upVotes.length`).
   - `recentActivity`: Top 3 activities from Activity collection where `userId == user._id`, sorted by `createdAt` descending. Return as `ActivityResponse`.
   - `recentSubmission`: Top 5 activities from Activity collection where `userId == user._id` AND `type IN ['challenge_created', 'idea_created']`, sorted by `createdAt` descending.
   - `contributionGraph`: Map of month name (String) to activity count (Long) from Activity DB for the last 6 months.
   - `commentCount`: Total comments from Comment collection where `userId == user._id`.
   - `challengeCount`: Total challenges from Challenge collection where `userId == user._id`.
   - `totalIdeaCount`: Total ideas from Idea collection where `userId == user._id`.
4. Return array of `UserResponse`.

### `GET /users/{id}`
1. Find user by MongoDB `_id`. 404 if not found.
2. Strip `password` from response.
3. Compute and attach all derived fields as above.
4. Return single `UserResponse`.

### `POST /users`
1. Validate payload against `UserBase` schema.
2. Hash `password` via bcrypt (pre-save hook handles this).
3. Check email uniqueness — return 409 if duplicate.
4. Set defaults: `role: 'USER'`, `status: 'PENDING'`, `innovationScore: 0`, `interestAreas: []`, `upvotedChallengeList: []`, `upvotedAppreciatedIdeaList: []`.
5. Return 201 with user (no password in response).

### `PUT /users/{id}`
1. Find user by `_id`. 404 if not found.
2. Update provided fields. If `password` is changed, bcrypt will hash it on save.
3. Return 200.

### `DELETE /users/{id}`
1. Find user by `_id`. 404 if not found.
2. Delete user.
3. Return 204.

### `GET /users/count`
1. Return `{ count: <total users> }`.
