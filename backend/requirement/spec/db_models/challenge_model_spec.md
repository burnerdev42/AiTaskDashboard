# Challenge Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`challenges`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Title`: String
- `opco`: String (Enum from a list of hardcoded options)
- `Platform`: String (Enum from a list of hardcoded options)
- `Description`: String (Long text)
- `Summary`: String
- `Outcome`: String
- `Timeline`: String (Enum from a list of hardcoded options)
- `Portfolio Lane`: String (Enum from a list of hardcoded options)
- `Priority`: String (Enum from a list of hardcoded options)
- `Tags`: List of Strings. Default: `["ai"]`
- `Constraint`: String
- `StackeHolder`: String
- `Virtual Id`: String. Format `CH-001` (Programmatically generated 001 to 999)
- `Status` (swim lane): String (Enum among swim lane statuses)
- `userId`: MongoDB ObjectId (Reference to the User collection, representing the creator)
- `CreatedAt`: DateTime (Should map to Mongoose's `createdAt` timestamp)
- `month`: Number (Integer)
- `year`: Number (Integer)
- `updatedAt`: DateTime (Initially same as `CreatedAt`, should map to `updatedAt` timestamp)
- `UpVotes`: List of MongoDB ObjectIds (userId list). Default: `[]`
- `Subcriptions`: List of MongoDB ObjectIds (userId list). Default: `[]`
- `View count`: Number (Long/Integer)
- `timestamp of status changed to pilot (z1)`: DateTime
- `timestamp of completed (z2)`: DateTime

## Generating the Schema
Please generate a Mongoose schema matching the above fields. Convert field names to standard camelCase where appropriate. Use Mongoose's `timestamps` option for `createdAt` and `updatedAt`. Set correct defaults and data types as specified.
