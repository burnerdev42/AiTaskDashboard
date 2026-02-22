# Comment Database Model Specification

> Source: `backend/requirement/Data requirements.txt`

## Collection Name
`comments`

## Database Fields

| Field | Mongoose Type | Required | Default | Notes |
|-------|--------------|----------|---------|-------|
| `_id` | `ObjectId` | auto | auto | MongoDB default PK |
| `userId` | `String` | yes | — | Mongo Hex ID (ref: User) |
| `comment` | `String` | yes | — | Text content |
| `type` | `String` | yes | — | → `COMMENT_TYPES`: `CH` (Challenge) or `ID` (Idea) |
| `createdat` | `Date` | no | `Date.now` | Preserve original lowercase spelling |
| `typeId` | `String` | yes | — | Either challenge virtualId or idea ideaId |

**Options:** `{ timestamps: false }` — uses explicit `createdat` field, not Mongoose timestamps.

## Generating the Schema
Generate a Mongoose schema matching the above fields. Use `String` type for `userId` and `typeId`. Field `createdat` uses lowercase 'a' per requirements. Add index on `{ typeId: 1, type: 1 }`.
