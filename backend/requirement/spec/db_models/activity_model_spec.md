# Activity Database Model Specification

> Source: `backend/requirement/Data requirements.txt`

## Collection Name
`activities`

## Database Fields

| Field | Mongoose Type | Required | Default | Notes |
|-------|--------------|----------|---------|-------|
| `_id` | `ObjectId` | auto | auto | MongoDB default PK |
| `type` | `String` | yes | — | → `ACTIVITY_TYPES` (15 values) |
| `fk_id` | `String` | no | `null` | Nullable. ID of related Challenge, Idea, or Comment; null for login/logout |
| `userId` | `String` | yes | — | User Hex ID (ref: User) |
| `month` | `Number` | no | — | Integer, derived from `createdAt` via pre-save hook |
| `year` | `Number` | no | — | Integer, derived from `createdAt` via pre-save hook |

**Options:** `{ timestamps: true }` — auto-manages `createdAt`.

**Pre-save hook:** Extract `month` (1–12) and `year` from `createdAt`.

**Indexes:** `{ userId: 1, createdAt: -1 }`, `{ type: 1 }`, `{ fk_id: 1 }` for efficient querying.

## Generating the Schema
Generate a Mongoose schema matching the above fields. Use `String` type for `userId` and `fk_id`. Add pre-save hook for `month`/`year`. Add indexes.
