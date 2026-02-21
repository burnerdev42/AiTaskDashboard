# User Database Model Specification

This specification is designed to be fed to an LLM for generating a MongoDB (Mongoose) schema.

## Collection Name
`users`

## Database Fields

- `_id`: MongoDB ObjectId (Hex String PK). Use the default Mongoose `_id`.
- `Name`: String
- `Opco`: String (Enum, conceptually a hardcoded dropdown)
- `Platform`: String (Enum, conceptually a hardcoded dropdown)
- `Company Tech Role`: String
- `Email`: String (Must be a Unique Identifier)
- `Interest Areas`: List of Strings (Enum/Hardcoded options). Default: `[]`
- `Role`: String (Enum: `ADMIN`, `MEMBER`, `USER`)
- `Created At`: DateTime (Should map to Mongoose's `createdAt` timestamp)
- `Updated At`: DateTime (Should map to Mongoose's `updatedAt` timestamp)
- `Status`: String (Enum: `PENDING`, `APPROVED`, `BLOCKED`, `INACTIVE`)
- `Innovation Score`: Number (Integer between 1 and 999)
- `Upvoted Challenge List`: List of Strings or ObjectIds (References to Challenge IDs). Default: `[]`
- `Upvoted/Appreciated Idea List`: List of Strings or ObjectIds (References to Idea IDs). Default: `[]`

## Generating the Schema
Please generate a Mongoose schema matching the exact field names (in standard camelCase). Include appropriate Mongoose schema configurations like `timestamps: true` for `createdAt` and `updatedAt`.
