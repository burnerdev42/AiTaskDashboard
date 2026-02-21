# Challenge Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`challenges`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Title`: String
- `opco`: String (Enum from list of hardcoded options)
- `Platform`: String (Enum from list of hardcoded options)
- `Description`: Long text - String
- `Summary`: String
- `Outcome`: String
- `Timeline`: String (Enum from list of hardcoded options)
- `Portfolio Lane`: String (Enum from list of hardcoded options)
- `Priority`: String (Hardcoded)
- `Tags`: List of Strings. Default: `["ai"]`
- `Constraint`: String
- `StackeHolder`: String
- `Virtual Id`: String. Format `CH-001` (Programmatically generated 001 to 999)
- `Status`: String (Swim lane status)
- `userId`: MongoDB ObjectId (Reference to the User collection)
- `CreatedAt`: DateTime
- `month`: Number (Integer)
- `year`: Number (Integer)
- `updatedAt`: DateTime (Initially same as `CreatedAt`)
- `upVotes`: List of MongoDB ObjectIds (userId list). Default: `[]`
- `Subcriptions`: List of MongoDB ObjectIds (userId list). Default: `[]`
- `View count`: Number (Long)
- `timestampOfStatusChangedToPilot`: DateTime (Nullable)
- `timestampOfCompleted`: DateTime (Nullable)

## Generating the Schema
Please generate a Mongoose schema matching the above fields. Convert field names to standard camelCase where appropriate (keeping typos like `StackeHolder` and `Subcriptions` exactly as written in the database field name). Use Mongoose's `timestamps` option for `CreatedAt` and `updatedAt`. Set correct defaults and data types as specified.
