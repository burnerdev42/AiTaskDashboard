# Challenge Database Model Specification

> Source: `backend/requirement/Data requirements.txt`

## Collection Name
`challenges`

## Database Fields

| Field | Mongoose Type | Required | Default | Notes |
|-------|--------------|----------|---------|-------|
| `_id` | `ObjectId` | auto | auto | MongoDB default PK |
| `title` | `String` | yes | — | |
| `opco` | `String` | yes | — | → `OPCO_LIST` |
| `platform` | `String` | yes | — | → Value from `OPCO_PLATFORM_MAP[opco]` |
| `description` | `String` | yes | — | Long text |
| `summary` | `String` | no | — | |
| `outcome` | `String` | no | — | |
| `timeline` | `String` | no | — | → `TIMELINE_OPTIONS` |
| `portfolioLane` | `String` | no | — | → `PORTFOLIO_LANES` |
| `priority` | `String` | no | — | → `PRIORITY_LEVELS` |
| `tags` | `[String]` | no | `["ai"]` | |
| `constraint` | `String` | no | — | |
| `stakeHolder` | `String` | no | — | Preserve original spelling |
| `virtualId` | `String` | yes | — | Unique. Format: `CH-001` to `CH-999` (CH = Challenge) |
| `status` | `String` | yes | — | → `SWIM_LANE_STATUS` (short codes only) |
| `userId` | `String` | yes | — | Creator Mongo Hex ID (ref: User) |
| `month` | `Number` | no | — | Integer, derived from `createdAt` via pre-save hook |
| `year` | `Number` | no | — | Integer, derived from `createdAt` via pre-save hook |
| `upVotes` | `[String]` | no | `[]` | Array of User IDs |
| `subcriptions` | `[String]` | no | `[]` | Array of User IDs. Preserve original spelling |
| `viewCount` | `Number` | no | `0` | Long |
| `timestampOfStatusChangedToPilot` | `Date` | no | `null` | Nullable |
| `timestampOfCompleted` | `Date` | no | `null` | Nullable |

**Options:** `{ timestamps: true }` — auto-manages `createdAt` and `updatedAt`.

**Pre-save hook:** Extract `month` (1–12) and `year` from `createdAt`.

## Generating the Schema
Generate a Mongoose schema matching the above fields. Use `timestamps: true`. Keep typo fields (`stakeHolder`, `subcriptions`) as-is. Use `String` type for `userId` (not ObjectId). Add pre-save hook for `month`/`year`.
