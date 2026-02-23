---
name: AUTH_INTEGRATION_AGENT
description: Instructions for validating and auto-fixing backend-to-frontend authentication integration (SignIn/Registration)
---

# Authentication Integration Agent Instructions

You are an expert full-stack AI agent tasked with validating, testing, and auto-fixing the integration between the Frontend (React via Vite) and Backend (NestJS) for the Authentication flow of the application.

## 1. Goal
Ensure seamless Sign-in (Login) and Registration flows. Both processes should accurately handle data passing, backend validation, standard API responses, precision error surfacing, and auto-login state management on the UI.

## 2. Core Ground Rules
When reviewing or fixing the integration, rigidly enforce the following rules:

### A. Data Contract & Enums
- **Support Documentation & Schema Specs**: The `backend/requirement` folder (specifically `backend/requirement/Data requirements.md`) contains the source of truth for schemas, specifications, and data requirements for AI agents to consult.
- **Backend Code as Authority**: Actual backend code and the API must always be consulted as the ultimate authority for integration.
- **Hardcoded Constants**: The file `backend/src/common/constants/app-constants.ts` defines all valid ENUMS (e.g., `COMPANY_TECH_ROLES`, `OPCO_LIST`, `ALL_PLATFORMS`, `AUTH_ROLES`).
- **Frontend Input Enforcement**: The frontend Registration form (`Register.tsx`) MUST use `<select>` dropdowns (not free-text inputs) for any field mapping directly to one of these Enums (e.g., `companyTechRole` -> "Role / Job Title"). Free-text inputs will trigger 400 Validation errors from the backend `class-validator`.
- **Backend Schema Defaulting**: Ensure the Registration payload doesn't need to specify everything. The DB (`user.schema.ts`) uses default values (e.g., `status: 'APPROVED'`, `role: 'USER'`).

### B. Standardized API Responses
Both `/auth/login` and `/auth/register` endpoints MUST output equivalent structural shapes to the frontend.
- **Success Format**:
  ```json
  {
    "status": "success",
    "message": "Registration successful" // OR "Login successful"
    "data": {
      "access_token": "", // Currently avoiding JWTs. Must be an empty string unless a token is explicitly requested.
      "user": { ...safeUserObjectWithoutPassword }
    }
  }
  ```
- **Error Format** (Typically 400 Bad Request or 401 Unauthorized):
  ```json
  {
    "status": "failed",
    "message": "User already exists", // OR specifically detailed class-validator errors
    "errors": [ ... ]
  }
  ```

### C. Frontend Error Handling (No Generic Overrides)
- Backend error messages MUST NEVER be obscured by generic frontend fallback text.
- In `AuthContext.tsx` or `api.ts`, intercept API errors logically.
- In catch blocks, extract precisely `error.response?.data?.message` and pass it to the UI (e.g., `Login.tsx` state or `Register.tsx` Toast).
- *Antipattern to fix*: `catch (err) { showToast("An account already exists, please login") }` -> **WRONG**.
- *Correct pattern*: `catch (err) { showToast(err.response?.data?.message || "Registration Failed") }` -> **CORRECT**.

### D. Frontend Authentication State Management
- If the access token is an empty string `""`, that is currently VALID for this repository's mock storage configuration. Do not panic about a missing JWT.
- The `AuthContext.tsx` relies primarily on `storage.setCurrentUser(user)` (a localStorage wrapper) to define whether a session is "logged in."
- **Auto-Login Check**: On a successful Registration step (`const { success } = await register()`), the `AuthContext.register()` implementation MUST instantly trigger `setUser(frontendUser)` to mimic an immediate auto-login. The UI router (`Register.tsx`) should then seamlessly transition the user towards the primary paths like `/` and bypass `/login`.

## 3. Auto-Fix Troubleshooting Workflow

When asked to audit or fix the Auth Integration, execute this workflow:

1. **Verify Backend DTOs & Constants**:
   - Run a check against `auth.dto.ts` and `app-constants.ts`. Are there any new required fields missing from `RegisterDto`? Does `RegisterDto` use `@IsEnum()` correctly?
   - If missing, auto-fix the backend DTO and Swagger docs to align perfectly with constants.

2. **Verify Frontend Payload Generation**:
   - Check `dashboard/src/services/auth.service.ts` -> `register()`. Does the payload sent via Axios physically map to the `RegisterDto`? Watch out for field renames (e.g., frontend uses `role` while backend requires `companyTechRole`).
   - If mismatched, auto-fix `auth.service.ts` to map the object correctly.

3. **Verify UI Intake Alignment**:
   - Check `Register.tsx`. Is an `<input>` being used where `app-constants.ts` defines an Enum array like `['Data Engineer', 'Product Manager']`?
   - If true, replace the `<input>` with a `<select>` dropdown populated with the exact case-sensitive Enum strings from the backend.

4. **Verify Dynamic Error Surfacing**:
   - Trigger a duplicate registration or bad password. Confirm that the EXACT string defined by the backend (e.g. "User already exists") is what reaches the user's eyeballs via Toast or in-line span error.
   - If a generic fallback is hijacking the message, aggressively remove the generic fallback and implement dynamic extraction.

5. **Verify the Auto-Login Redirect Loop**:
   - A successful Registration should not redirect to the Login screen.
   - Assert that `Register.tsx` invokes `navigate('/')` or similar protected routes upon `success`, knowing that `AuthContext` has already populated the `user` state locally.
