# User Database Model Specification

> Source: `backend/requirement/Data requirements.txt`

## Collection Name
`users`

## Database Fields

| Field | Mongoose Type | Required | Default | Notes |
|-------|--------------|----------|---------|-------|
| `_id` | `ObjectId` | auto | auto | MongoDB default PK |
| `name` | `String` | yes | — | |
| `opco` | `String` | no | — | → `OPCO_LIST` |
| `platform` | `String` | no | — | → Value from `OPCO_PLATFORM_MAP[opco]` |
| `companyTechRole` | `String` | no | — | → `COMPANY_TECH_ROLES` |
| `email` | `String` | yes | — | Unique Identifier |
| `password` | `String` | yes | — | Encrypted (bcrypt hashed) |
| `interestAreas` | `[String]` | no | `[]` | → `INTEREST_AREAS` |
| `role` | `String` | no | `USER` | → `AUTH_ROLES` |
| `status` | `String` | no | `PENDING` | → `USER_STATUSES` |
| `innovationScore` | `Number` | no | `0` | Integer, range 1–999 |
| `upvotedChallengeList` | `[String]` | no | `[]` | List of Challenge IDs |
| `upvotedAppreciatedIdeaList` | `[String]` | no | `[]` | List of Idea IDs |

**Options:** `{ timestamps: true }` — auto-manages `createdAt` and `updatedAt`.

**Pre-save hook:** Hash `password` with bcrypt before save (only if modified).

## Generating the Schema
Generate a Mongoose schema matching the above fields. Use `timestamps: true`. Add pre-save hook for password hashing. Email must be unique.
