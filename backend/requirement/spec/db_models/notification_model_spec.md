# Notification Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`notifications`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Type`: String. Enum with the following values: `challenge_created`, `challenge_status_update`, `challenge_edited`, `idea_edited`, `challenge_upvoted`, `idea_upvoted`, `challenge_commented`, `idea_commented`, `challenge_subscribed`, `idea_subscribed`, `challenge_deleted`, `idea_deleted`
- `fk_id`: String or MongoDB ObjectId (Nullable: ID of the linked Challenge, Idea, or Comment entity)
- `userId`: MongoDB ObjectId or String (Reference to the recipient User collection)
- `CreatedAt`: DateTime (Should map to Mongoose `createdAt` timestamp)
- `IsSeen`: Boolean. Default value: `false`

## Generating the Schema
Create a Mongoose schema using the defined database fields. Ensure the Enums are correctly validated, field keys are transformed to standard camelCase formatting, `CreatedAt` operates correctly with timestamps, and `IsSeen` defaults to a boolean `false`.
