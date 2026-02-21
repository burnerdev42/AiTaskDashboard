# Idea Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`ideas`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Idea Id`: String. Format: `IDX-0001` (Programmatic 0001-9999)
- `Title`: String
- `Description/Idea Summary`: String
- `Proposed Solution`: String
- `Expected Impact`: String
- `Challenge Id`: MongoDB ObjectId or String (Link/Reference to Challenge collection)
- `Appreciation Count` (Upvote): Number (Long/Integer)
- `View Count`: Number (Long/Integer)
- `User Id`: MongoDB ObjectId or String (Creator's reference to the User collection)
- `Subscription`: List of MongoDB ObjectIds or Strings (References to User collection). Default: `[]`
- `Created At`: DateTime (Should map to Mongoose's `createdAt` timestamp)
- `Month`: Number (Integer, extracted from Created At time)
- `Year`: Number (Integer, extracted from Created At time)
- `Updated At`: DateTime (Initially same as Created At, map to Mongoose's `updatedAt` timestamp)
- `Status`: Boolean (Represents Accepted/Declined). Default: `true` (Accepted)

## Generating the Schema
Please generate a Mongoose schema based on the spec above. Convert field names to standard camelCase. Ensure proper relationships (`Schema.Types.ObjectId` with `ref`) if suitable. Use the `timestamps: true` configuration for generating timestamps.
