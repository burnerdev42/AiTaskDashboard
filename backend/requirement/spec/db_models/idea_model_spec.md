# Idea Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`ideas`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Idea Id`: String. Format: `ID-0001` (Programmatic 0001-9999)
- `Title`: String
- `Description / Idea Summary`: String
- `Proposed Solution`: String
- `Challenge Id`: String (Link to Challenge collection)
- `Appreciation Count` (Upvote): Number (Long)
- `View Count`: Number (Long)
- `User Id`: String (Creator mongo hex ID)
- `Subscription`: List of Strings (User hex IDs, default [])
- `Created At`: DateTime
- `Month`: Number (Int, from Created At)
- `Year`: Number (Int, from Created At)
- `Updated At`: DateTime (Initially same as Created At)
- `Status`: Boolean (Accepted/Declined - Default: true/Accepted)
- `UpVotes`: userId list - default []

## Generating the Schema
Please generate a Mongoose schema based on the spec above. Convert field names to standard camelCase. Ensure proper relationships (`Schema.Types.ObjectId` with `ref`) if suitable. Use the `timestamps: true` configuration for generating timestamps.
