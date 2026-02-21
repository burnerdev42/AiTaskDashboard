# Authentication & Registration API Implementation Specification

This document details the step-by-step implementation logic for the Authentication domain (Registration and Login) API endpoints, adhering to the security constraints in `Data requirements.txt` and the `swagger.yaml` routes.

## Core Concepts

Unlike standard CRUD domains, Authentication does not have a dedicated Mongoose Model. Instead, it interacts directly with the `users` collection. 
The core requirement is that **passwords must never be stored in plain text**. A library such as `bcrypt` must be utilized to hash the password during registration and verify it during login.
Additionally, when returning user data after these flows, the password hash must be stripped from the response payload to prevent accidental leakage.

## Endpoints

### 1. POST `/auth/register`
- **Summary**: Register a new user profile securely.
- **Request Body**: Matches `UserBase` schema.
- **Implementation Steps**:
  1. **Validation**: Validate the incoming request body against the `UserBase` constraints. At a minimum, `name`, `email`, and `password` are required.
  2. **Uniqueness Check**: Query the database to ensure the email is not already taken: `User.findOne({ email: req.body.email })`. If it exists, return `409 Conflict`.
  3. **Hashing**: 
     - Generate a salt (e.g., typically 10 or 12 rounds using `bcrypt`).
     - Hash the incoming `req.body.password` using the salt.
     - Replace `req.body.password` with the resulting hashed string.
  4. **Initial Setup**: Apply any default values required for new users (e.g., `status: 'PENDING'`, empty arrays for `upvotedChallengeList`, `interestAreas` if not provided).
  5. **Database Insertion**: Save the new user document: `const newUser = await User.create(req.body);`.
  6. **Sanitization**: Convert the Mongoose document to a plain JavaScript object (`newUser.toObject()`) and permanently delete the `password` field from this object.
  7. Return `201 Created` with the sanitized user object.

### 2. POST `/auth/login`
- **Summary**: Authenticate a user and return an active session token.
- **Request Body**: Matches `AuthLoginRequest` (`email`, `password`).
- **Implementation Steps**:
  1. **User Lookup**: Search the database for the user by their email address: `const user = await User.findOne({ email: req.body.email }).lean();`.
  2. **Validation (Not Found)**: If the user does not exist, return `401 Unauthorized`. Make sure not to specify "Email not found" to prevent email enumeration attacks; use a generic "Invalid credentials."
  3. **Password Verification**: 
     - Use bcrypt's comparison utility to compare the incoming plain-text `req.body.password` against the stored `user.password` hash.
  4. **Validation (Invalid Password)**: If the comparison fails, return `401 Unauthorized` with "Invalid credentials."
  5. **Token Generation**: 
     - Upon a successful match, generate an authentication token. (e.g., A JSON Web Token (JWT) signed using a secret key, encoding the `user._id` and `user.role` as the payload).
  6. **Sanitization**: Delete the `password` property from the `user` object.
  7. Return `200 OK` sending back a JSON payload structure containing both the `token` string and the sanitized `user` object.