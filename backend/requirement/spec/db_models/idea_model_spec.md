# Idea Database Model Specification

> Source: `backend/requirement/Data requirements.txt`

## Collection Name
`ideas`

## Database Fields

| Field | Mongoose Type | Required | Default | Notes |
|-------|--------------|----------|---------|-------|
| `_id` | `ObjectId` | auto | auto | MongoDB default PK |
| `ideaId` | `String` | yes | — | Unique. Format: `ID-0001` to `ID-9999` (ID = Idea) |
| `title` | `String` | yes | — | |
| `description` | `String` | yes | — | Idea Summary |
| `proposedSolution` | `String` | no | — | |
| `challengeId` | `String` | yes | — | Link to Challenge collection (virtualId) |
| `appreciationCount` | `Number` | no | `0` | Upvote count (Long) |
| `viewCount` | `Number` | no | `0` | Long |
| `userId` | `String` | yes | — | Creator Mongo Hex ID (ref: User) |
| `subscription` | `[String]` | no | `[]` | List of User IDs |
| `month` | `Number` | no | — | Integer, derived from `createdAt` via pre-save hook |
| `year` | `Number` | no | — | Integer, derived from `createdAt` via pre-save hook |
| `status` | `Boolean` | no | `true` | Accepted/Declined. Default: Accepted |
| `upVotes` | `[String]` | no | `[]` | List of User IDs |

**Options:** `{ timestamps: true }` — auto-manages `createdAt` and `updatedAt`.

**Pre-save hook:** Extract `month` (1–12) and `year` from `createdAt`.

## Generating the Schema
Generate a Mongoose schema matching the above fields. Use `timestamps: true`. Use `String` type for `userId` and `challengeId` (not ObjectId). Add pre-save hook for `month`/`year`.
