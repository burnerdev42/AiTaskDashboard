# Comment Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`comments`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `UserId`: MongoDB ObjectId or String (Reference to User collection)
- `Comment`: String (Text)
- `Type`: String (Enum: `Challenges` (CH) or `Ideas` (IDX))
- `Createdat`: DateTime (Should map to standard Mongoose `createdAt` timestamp)
- `TypeId`: String or MongoDB ObjectId (Either a linking ID to the Challenge or Idea collection, depending on the `Type` field)

## Generating the Schema
Generate the Mongoose schema mapping to the specified database fields. Convert field names to standard camelCase. Ensure proper typings for enums and references. Use Mongoose `timestamps` if suitable.
