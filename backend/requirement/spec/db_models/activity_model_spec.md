# User Activity Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`activities`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Type`: String. Enum with values: `challenge_created`, `idea_created`, `challenge_status_update`, `challenge_edited`, `idea_edited`, `challenge_upvoted`, `challenge_downvoted`, `idea_upvoted`, `challenge_commented`, `idea_commented`, `challenge_subscribed`, `idea_subscribed`, `challenge_deleted`, `idea_deleted`, `log_in`, `log_out`
- `fk_id`: String or MongoDB ObjectId (Nullable: ID of related Challenge, Idea, or Comment; can be null for login/logout actions)
- `userId`: MongoDB ObjectId or String (Reference to the User collection)
- `CreatedAt`: DateTime (Should map to Mongoose `createdAt` timestamp)
- `Month`: Number (Integer, derived from `CreatedAt`)
- `Year`: Number (Integer, derived from `CreatedAt`)

## Generating the Schema
Generate the Mongoose schema representing the fields above. Please apply standard camelCase formatting for the property names. Implement the specified constraints (like the enums and nullable attributes) where indicated.
