# Notification Database Model Specification

> Source: `backend/requirement/Data requirements.txt`

## Collection Name
`notifications`

## Database Fields

| Field | Mongoose Type | Required | Default | Notes |
|-------|--------------|----------|---------|-------|
| `_id` | `ObjectId` | auto | auto | MongoDB default PK |
| `type` | `String` | yes | — | → `NOTIFICATION_TYPES` (12 values) |
| `fk_id` | `String` | no | `null` | Nullable. ID of linked Challenge/Idea |
| `userId` | `String` | yes | — | Recipient Mongo Hex ID (Not the initiator) |
| `initiatorId` | `String` | yes | — | Mongo Hex ID of the user who caused the notification |
| `createdAt` | `Date` | no | `Date.now` | |
| `isSeen` | `Boolean` | no | `false` | |

**Options:** `{ timestamps: true }` — auto-manages `createdAt` and `updatedAt`.

**Indexes:** `{ userId: 1, isSeen: 1, createdAt: -1 }` for efficient querying.

## Generating the Schema
Generate a Mongoose schema matching the above fields. Use `String` type for `userId`, `initiatorId`, and `fk_id`. Add compound index. Ensure `isSeen` defaults to `false`.
