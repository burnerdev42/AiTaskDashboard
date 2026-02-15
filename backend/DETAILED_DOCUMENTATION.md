
# AiTaskDashboard Backend Documentation

## Overview
This project is a **Layered Monolith** NestJS application using MongoDB (Mongoose). It was modernized from a legacy Express/Monorepo structure to follow NestJS best practices.

## Architecture
The application follows a strict layered architecture:
- **Presentation Layer** (`src/controllers`): Handles HTTP requests, validation, and serialization. Uses `GlobalExceptionFilter` and `TransformInterceptor` for consistent API responses.
- **Service Layer** (`src/services`): Contains business logic and orchestrates data operations.
- **Data Access Layer** (`src/database/repositories`): Handles database interactions using Mongoose models via `AbstractRepository`.
- **Data Model** (`src/models`): Defines Mongoose Schemas and TypeScript interfaces.
- **Modules** (`src/modules`): Feature-based modules encapsulating related components.

## Key Modules
1.  **AuthModule**: Handles JWT authentication, Login, Register, and Guards.
2.  **ChallengesModule**: Challenge management with sorting, filtering, and pagination.
3.  **IdeasModule**: Idea management.
4.  **TasksModule**: Task management.
5.  **NotificationsModule**: Real-time notifications (placeholder/structure).
6.  **DashboardModule**: Aggregates data for specific views (e.g., Swimlanes).
7.  **MetricsModule**: KPI summaries and throughput data.
8.  **UsersModule**: User management (Meet the Team).
9.  **NotificationsModule**: Includes Newsletter subscription.

## Standardized Responses
All API responses follow the `ApiResponse<T>` structure:
```json
{
  "status": "success",
  "data": { ... },
  "timestamp": "2023-10-27T10:00:00.000Z"
}
```
Errors are normalized:
```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2023-10-27T10:00:00.000Z"
}
```

## Logging
Structured logging is implemented using `nestjs-pino`. Request correlation IDs are tracked via `AsyncLocalStorage`. In development, logs are pretty-printed. In tests, logs are silent or minimal.

## Security
- `helmet` is used for security headers.
- `class-validator` ensures input validation.
- `Authentication` via JWT strategy.

## Testing
- Unit tests co-located with source files (`*.spec.ts`). achieving high coverage.
- E2E tests in `test/` for critical flows.
- Run `npm run test:cov` for coverage reports.

## Local Development & Seeding
To populate the local MongoDB with mock data (Users, Challenges, Ideas):
```bash
npx ts-node scripts/seed.ts
```
This script clears existing data and inserts a consistent set of mock entities for development and testing.
