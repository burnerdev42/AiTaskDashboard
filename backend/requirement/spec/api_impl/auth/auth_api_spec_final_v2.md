# Auth API Implementation Specification — v2

> **Source:** `Data requirements.txt`, `user_model_spec.md`, `swagger.yaml`
> **Replaces:** `auth_api_spec_final_v1.md`

---

## Endpoints

### `POST /auth/register`
1. Accept full User profile payload.
2. Validate required fields: `name`, `email`, `password`.
3. Check email uniqueness in User collection — return 409 if duplicate.
4. Hash `password` via bcrypt (pre-save hook on User schema handles this).
5. Set defaults: `role: 'USER'`, `status: 'PENDING'`, `innovationScore: 0`, `interestAreas: []`, `upvotedChallengeList: []`, `upvotedAppreciatedIdeaList: []`.
6. Save user to User collection.
7. Return 201 with `UserResponse` (password MUST be stripped from response).

### `POST /auth/login`
1. Accept `{ "email": "...", "password": "..." }`.
2. Find user by `email`. Return 401 if not found.
3. Compare provided `password` with stored hashed password via `bcrypt.compare()`.
4. Return 401 if password mismatch.
5. Generate JWT token.
6. Create Activity: `{ type: 'log_in', fk_id: null, userId: user._id }`.
7. Return 200 with:
   ```json
   {
     "token": "<JWT>",
     "user": <UserResponse without password>
   }
   ```

---

## Security Notes
- Passwords must never be returned in any response.
- bcrypt salt rounds: 10.
- JWT should contain `userId`, `email`, `role` in payload.
- JWT expiry: configurable (recommend 24h).
