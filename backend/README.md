# 🚀 AiTaskDashboard Backend

[![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](https://opensource.org/licenses/MIT)

> **Architect**: Ananta  
> **Status**: Production-Hardened, Enterprise-Ready

---

## 📋 Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Repository Structure](#2-repository-structure)
- [3. Technology Stack](#3-technology-stack)
- [4. Architecture & Design Principles](#4-architecture--design-principles)
- [5. Common & Reusable Components](#5-common--reusable-components)
- [6. API Design Standards](#6-api-design-standards)
- [7. MongoDB Design Strategy](#7-mongodb-design-strategy)
- [8. Logging & Observability](#8-logging--observability)
- [9. Error Handling Strategy](#9-error-handling-strategy)
- [10. Security Best Practices](#10-security-best-practices)
- [11. Testing Strategy](#11-testing-strategy)
- [12. Environment Setup](#12-environment-setup)
- [13. Scripts & Lifecycle Commands](#13-scripts--lifecycle-commands)
- [14. Performance & Scalability](#14-performance--scalability)
- [15. Frontend Integration Guide](#15-frontend-integration-guide)
- [16. Complete API Reference](#16-complete-api-reference)
- [17. Data Models](#17-data-models)
- [18. Docker & Deployment](#18-docker--deployment)
- [19. Current Test Status](#19-current-test-status)
- [20. Enums Reference](#20-enums-reference)
- [21. Query Parameters](#21-query-parameters)
- [22. Swagger/OpenAPI Documentation](#22-swaggeropenapi-documentation)
- [23. Distributed Tracing](#23-distributed-tracing)
- [24. Healthcheck Endpoints](#24-healthcheck-endpoints)
- [25. DTO & Response Model Architecture](#25-dto--response-model-architecture)

---

## 1. Project Overview

**AiTaskDashboard** is an enterprise-grade backend system designed to bridge the gap between AI-driven task automation and human-centric innovation management. It provides a robust infrastructure for tracking automated tasks, managing corporate challenges, and nurturing ideas from ideation to scale.

### High-Level Architecture
The system utilizes a **Feature-Based Modular Architecture** (Layered Monolith approach). Each feature is encapsulated within its own module, containing its own Controller, Service, and Repository. This ensures high cohesion and low coupling, making the system easy to scale horizontally or refactor into microservices if needed.

### Why This Architecture?
- **Modularity**: Isolated features prevent side effects during development.
- **Maintainability**: Shared logic is centralized in `libs/common`.
- **Developer Velocity**: Features can be worked on in parallel without merge conflicts.

---

## 2. Repository Structure

The project follows a clean, hierarchical structure designed for clarity and scalability.

```text
src/
├── modules/               # Feature-Specific Modules (Self-contained)
│   ├── auth/              # JWT, Passport, Guards, and Authentication logic
│   ├── users/             # User profiles and management
│   ├── challenges/        # Corporation innovation challenges
│   ├── ideas/             # Idea management and status tracking
│   ├── comments/          # Shared comments (for Challenges & Ideas)
│   ├── user-actions/      # Shared user actions (votes, subscriptions)
│   ├── tasks/             # Automated AI/Background tasks
│   ├── notifications/     # Notification dispatch & Newsletter subscription
│   ├── dashboard/         # Aggregated views (e.g., Swimlanes)
│   └── metrics/           # ROI and KPI reporting APIs
├── common/                # Shared Cross-Cutting Concerns
│   ├── auth/              # Authentication decorators (CurrentUser, etc.)
│   ├── controllers/       # Abstract base controller
│   ├── database/          # Abstract repository and schema
│   ├── enums/             # System-wide Enums (ApiStatus, UserRole, etc.)
│   ├── filters/           # Global Exception Filters
│   ├── interceptors/      # Response Transformers & Logging Interceptors
│   ├── interfaces/        # Shared Type definitions & Interfaces
│   ├── middleware/        # Request middleware (Correlation/TraceId)
│   ├── metrics/           # Prometheus metrics module
│   ├── services/          # Abstract base service
│   └── library/           # Shared logic (CommonModule)
├── database/              # Persistence Layer
│   ├── seeds/             # Database seeding scripts for Mock Data
│   └── schemas/           # Mongoose Schema definitions
├── models/                # Document definitions & Schema mappings
└── dto/                   # Data Transfer Objects with class-validator
```

---

## 3. Technology Stack

| Component | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | Industry standard for high-performance I/O bound backends. |
| **Framework** | NestJS | Strong typing, dependency injection, and modular structure. |
| **Language** | TypeScript | Compile-time safety and self-documenting code. |
| **Database** | MongoDB (Mongoose) | Schema flexibility for evolving AI and Idea data structures. |
| **Logs** | Pino (nestjs-pino) | Extremely low overhead and structured JSON output. |
| **Metrics** | Prometheus | Real-time monitoring of API throughput and latency. |
| **Security** | Helmet + JWT | Protection against common web vulnerabilities and secure Auth. |
| **Testing** | Jest + Supertest | Comprehensive testing suite with excellent mocking support. |

---

## 4. Architecture & Design Principles

The codebase adheres strictly to enterprise software engineering standards:

- **SOLID Principles**: Focused classes, interface-based communication.
- **Dry (Don't Repeat Yourself)**: Shared logic in `AbstractRepository` and `CommonModule`.
- **KISS & YAGNI**: Avoiding over-engineering while maintaining extensibility.
- **Dependency Flow**: Outer layers (Controllers) depend on Services/Repositories; inner layers never depend on outer layers.
- **Separation of Concerns**: Controllers handle HTTP, Services handle Business Logic, Repositories handle Persistence.

---

## 5. Common & Reusable Components

### `AbstractRepository<T>`
A generic implementation providing standard CRUD operations (`find`, `findOne`, `create`, `findOneAndUpdate`, `delete`) and transaction support.
- **Authentic Feature**: Implements `lean: true` globally for performance.

### `TransformInterceptor`
Automatically wraps all successful responses into a standardized format.
- **Authentic Feature**: Ensures every API response contains `status: "success"`, `data`, `requestId`, `traceId`, and `timestamp`.


### `GlobalExceptionFilter`
Captures all exceptions (Http, Database, Runtime) and converts them into a secure, standard error format.

### `LoggingInterceptor`
Intercepts every request to log the HTTP method, URL, and total execution time in milliseconds.

### `CorrelationMiddleware`
Assigns a unique trace ID (`traceId`) to every incoming request for distributed tracing.
- **Authentic Feature**: Accepts `x-correlation-id`, `x-trace-id`, or `x-request-id` headers from clients.
- **Authentic Feature**: Sets trace ID in response headers for client visibility.
- **Authentic Feature**: Attaches trace ID to request object for downstream access in logs and error responses.

---

## 6. API Design Standards

### RESTful Conventions
- **Base Prefix**: `/api`
- **Versioning**: Explicitly versioned via URI prefix (`/api/v1`).
- **Paths**: Plural nouns for resource names (e.g., `/api/v1/challenges`).


### Communication Formats
**Success Response (200 OK / 201 Created)**
```json
{
  "status": "success",
  "data": { ... },
  "requestId": "uuid-v4",
  "traceId": "uuid-v4",
  "timestamp": "2024-03-20T10:00:00.000Z"
}
```

**Error Response (400 Bad Request / 500 Internal)**
```json
{
  "status": "error",
  "message": "User-friendly error message",
  "errors": [ ... ],
  "requestId": "uuid-v4",
  "traceId": "uuid-v4",
  "path": "/api/v1/resource",
  "timestamp": "2024-03-20T10:00:00.000Z"
}
```


---

## 7. MongoDB Design Strategy

- **Schema Management**: Strict typing via `MongooseSchema` with `Document` extensions.
- **Concurrency**: Versioning (`__v`) enabled by default.
- **Performance**: Heavy use of `.lean()` in the `AbstractRepository` to reduce memory overhead and bypass Mongoose hydration when not needed.
- **Relationships**: Soft relations using `Types.ObjectId` with automatic population (`.populate()`) supported in generic queries.
- **Transactions**: Multi-document atomic operations supported in the `AbstractRepository.startTransaction()` flow.

---

## 8. Logging & Observability

### Log Standards
We use **JSON Structured Logging**. This allows logs to be easily indexed by ELK, Datadog, or Grafana Loki.

**Sample Request Log:**
```json
{"level":30,"time":1710928800000,"msg":"GET /api/challenges/123 45ms","context":"LoggingInterceptor"}
```

**Sample Error Log:**
```json
{"level":50,"time":1710928800000,"msg":"Http Status: 404 Error Message: \"Challenge not found\"","context":"GlobalExceptionFilter"}
```

### Metrics (NFRs)
- **API Latency**: Average response time per endpoint.
- **Throughput**: Requests per minute (RPM).
- **Error Rate**: Percentage of 4xx and 5xx responses.
- **System Health**: CPU, Memory, and Node Event Loop usage.

---

## 9. Error Handling Strategy

1.  **Throw Early**: Errors are thrown at the service or repository level (e.g., `NotFoundException`).
2.  **Catch Globally**: The `GlobalExceptionFilter` intercepts all errors.
3.  **Sanitize**: In `NODE_ENV=production`, precise internal error messages (e.g., Database connection strings) are masked to prevent data leakage.
4.  **Audit**: Every error is logged with the request path and a timestamp for backtracking.

---

## 10. Security Best Practices

- **Helmet**: Secures the app by setting various HTTP headers (XSS, Sniffing, etc.).
- **CORS**: Strict white-listing of frontend domains.
- **Input Validation**: `ValidationPipe` with `whitelist: true` strips any non-requested properties from input objects (Mass Assignment protection).
- **No Secrets in Logs**: Sensitive data (passwords, tokens) is never logged.
- **Secrets Management**: Sensitive config is loaded via `ConfigModule` from protected `.env` files.

---

## 11. Testing Strategy

### Unit Tests (`*.spec.ts`)
- Located adjacent to the file being tested.
- 100% Mocking of dependencies (Repositories/Services).
- Focused on business logic branches.

### Integration & E2E Tests (`test/*.e2e-spec.ts`)
- Uses `Supertest` to test actual HTTP entry points.
- Interacts with a test database to verify the full stack (Controller -> Service -> Repo).

### Quality Gates
- **Line Coverage**: Targeted at 100% for critical modules.
- **Linting**: Strict ESLint rules to ensure coding consistency.

---

## 12. Environment Setup

Copy `.env.example` to `.env` and configure the following:

| Key | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | API Port | `3000` |
| `MONGODB_URI` | Connection string for MongoDB | `mongodb://localhost:27017/dashboard` |
| `JWT_SECRET` | Secret key for signing tokens | *Mandatory Change* |
| `LOG_LEVEL` | Pino log level (info/debug/error) | `info` |

---

## 13. Scripts & Lifecycle Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install all dependencies. |
| `npm run start:dev` | Start the application in watch mode. |
| `npm run build` | Compile TypeScript into production JavaScript. |
| `npm run start:prod` | Run the compiled production build. |
| `npm run lint` | Run code quality checks. |
| `npm run test` | Run unit tests. |
| `npm run test:cov` | Run tests and generate coverage report. |
| `npm run seed` | Populate the database with initial mock data. |

---

## 14. Performance & Scalability

- **Stateless Design**: The API stores no session state, allowing Easy horizontal scaling behind a Load Balancer.
- **Indexing**: MongoDB indexes are defined on frequently queried fields (`status`, `owner`, `stage`).
- **Caching**: The architecture is ready for Redis integration at the Service level (Omit if not implemented).

---

## 15. Frontend Integration Guide

### How to use these APIs
1.  **Base URL**: `http://localhost:3000/api/v1`
2.  **Auth**: Send JWT in the header: `Authorization: Bearer <token>`.
3.  **Standard Response**: Expect the `data` object for the actual payload.
4.  **Traceability**: Every response includes `requestId` and `traceId` for debugging.
5.  **Errors**: Check for `status: "error"` and the `message` field for user feedback.
6.  **Swagger UI**: Visit `/api/docs` for the interactive playground and model definitions.


---

## 16. Complete API Reference

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Authenticate and receive JWT token | ❌ |

**Register Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "user"
}
```

**Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Login Response:**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

---

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | List all users | ✅ |
| `GET` | `/users/:id` | Get user by ID | ✅ |

---

### Challenges (`/api/v1/challenges`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/challenges` | Create a new challenge | ✅ |
| `GET` | `/challenges` | List all challenges (supports pagination) | ✅ |
| `GET` | `/challenges/:id` | Get challenge by ID (enriched with ideas, votes) | ✅ |
| `PUT` | `/challenges/:id` | Update challenge | ✅ |
| `DELETE` | `/challenges/:id` | Delete challenge | ✅ |

**Create / Update Challenge Request Body (ChallengeDto):**
```json
{
  "title": "AI-Powered Customer Support",
  "description": "Implement conversational AI for customer queries",
  "portfolioLane": "Customer Value Driver",
  "status": "submitted",
  "priority": "High",
  "tags": ["AI", "Customer Experience"],
  "opco": "Albert Heijn",
  "platform": "STP",
  "outcome": "30% reduction in support tickets",
  "timeline": "6-12 months"
}
```

**Challenge Status Code:** `submitted` | `ideation` | `pilot` | `completed` | `archive`
**Portfolio Lanes:** `Customer Value Driver` | `Non Strategic Product Management` | `Tech Enabler` | `Maintenance`

> **GET /challenges/:id enriched response** includes: linked `ideas`, `upvotes` (userId list), `subscriptions` (userId list), and short `owner`/`contributor` details (`_id, name, email, avatar`).

---

### Comments (`/api/v1/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/comments` | Create a comment on a Challenge or Idea | ✅ |
| `GET` | `/comments?parentId=&type=` | List comments for a specific entity | ✅ |
| `DELETE` | `/comments/:id` | Delete a comment | ✅ |

**Why a separate Comment collection?** Comments are shared between Challenges and Ideas using a polymorphic `type` field (`Challenge` or `Idea`) and a `parentId` reference. This avoids duplicating comment logic across modules and ensures a consistent commenting experience.

---

### User Actions (`/api/v1/user-actions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/user-actions` | Toggle a vote or subscription (idempotent) | ✅ |
| `GET` | `/user-actions?targetId=&targetType=` | Get actions on an entity | ✅ |
| `GET` | `/user-actions/counts?targetId=&targetType=` | Get aggregated action counts | ✅ |

**Why a separate UserAction collection?** Votes (upvote) and subscriptions are shared between Challenges and Ideas using polymorphic `targetType`/`targetId` fields. A unique compound index (`userId + targetId + targetType + actionType`) prevents duplicate actions. This design avoids embedding votes inside parent documents (which would cause write contention at scale).

---

### Ideas (`/api/v1/ideas`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/ideas` | Submit a new idea | ✅ |
| `GET` | `/ideas` | List all ideas (supports pagination) | ✅ |
| `GET` | `/ideas/:id` | Get idea by ID | ✅ |
| `PUT` | `/ideas/:id` | Update idea | ✅ |
| `DELETE` | `/ideas/:id` | Delete idea | ✅ |

**Create Idea Request Body:**
```json
{
  "title": "Chatbot for FAQ Handling",
  "description": "Automate common customer questions with AI",
  "linkedChallenge": "60d21b4667d0d8992e610c86",
  "tags": ["AI", "Automation"],
  "problemStatement": "High volume of repetitive customer queries",
  "proposedSolution": "AI-powered FAQ chatbot"
}
```

---

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/tasks` | Create a new task | ✅ |
| `GET` | `/tasks` | List all tasks (supports pagination) | ✅ |
| `GET` | `/tasks/:id` | Get task by ID | ✅ |
| `PUT` | `/tasks/:id` | Update task | ✅ |
| `DELETE` | `/tasks/:id` | Delete task | ✅ |

**Create Task Request Body:**
```json
{
  "title": "Review prototype feedback",
  "description": "Analyze user feedback from prototype testing",
  "stage": "Prototype",
  "owner": "60d21b4667d0d8992e610c85",
  "priority": "High",
  "status": "pending"
}
```

**Task Priorities:** `High` | `Medium` | `Low`  
**Task Statuses:** `pending` | `in_progress` | `completed` | `cancelled`

---

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/notifications` | Create a notification | ✅ |
| `GET` | `/notifications/user/:userId` | Get notifications for a user | ✅ |
| `GET` | `/notifications/user/:userId/unread-count` | Get unread notification count | ✅ |
| `POST` | `/notifications/user/:userId/mark-read` | Mark all notifications as read | ✅ |
| `GET` | `/notifications/:id` | Get notification by ID | ✅ |
| `PUT` | `/notifications/:id` | Update notification | ✅ |
| `DELETE` | `/notifications/:id` | Soft delete notification | ✅ |

**Create Notification Request Body:**
```json
{
  "userId": "60d21b4667d0d8992e610c85",
  "type": "challenge",
  "title": "New Challenge Submitted",
  "message": "Ravi Patel submitted 'Optimize Cloud Infrastructure'",
  "link": "/challenges/CH-001"
}
```

**Notification Types:** `challenge` | `idea` | `comment` | `mention` | `status` | `system`

---

### Newsletter (`/api/v1/newsletter`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/newsletter/subscribe` | Subscribe to newsletter | ❌ |

---

### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/dashboard/swimlanes` | Get aggregated swimlane view | ✅ |

---

### Metrics (`/api/v1/metrics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/metrics/summary` | Get KPI summary (ROI, savings, etc.) | ✅ |
| `GET` | `/metrics/throughput` | Get throughput metrics | ✅ |

---

### Prometheus Metrics (`/metrics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/metrics` | Prometheus-compatible metrics endpoint | ❌ |

---

## 17. Data Models

### User Schema

```typescript
{
  _id: ObjectId,
  email: string,           // Unique, required
  password: string,        // Hashed with bcrypt
  name: string,            // Required
  opco: string,            // Validated against OPCO_LIST
  platform: string,        // Validated against OPCO_PLATFORM_MAP
  companyTechRole: string, // Validated against COMPANY_TECH_ROLES
  interestAreas: string[], // Validated against INTEREST_AREAS
  role: UserRole,          // 'ADMIN' | 'MEMBER' | 'USER'
  status: UserStatus,      // 'PENDING' | 'APPROVED' | 'BLOCKED' | 'INACTIVE'
  innovationScore: number, // Default: 0
  upvotedChallengeList: string[],
  upvotedAppreciatedIdeaList: string[],
  avatar?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Challenge Schema

```typescript
{
  _id: ObjectId,
  title: string,              // Required
  description: string,        // Required
  summary?: string,
  opco: string,               // Validated against OPCO_LIST
  platform: string,           // Validated against OPCO_PLATFORM_MAP
  outcome?: string,           // Expected outcome
  timeline?: string,          // Validated against TIMELINE_OPTIONS
  portfolioLane: ChallengeStage, // 'Customer Value Driver' | 'Non Strategic Product Management' | 'Tech Enabler' | 'Maintenance'
  owner: ObjectId,            // Reference to User
  status: ChallengeStatus,    // 'submitted' | 'ideation' | 'pilot' | 'completed' | 'archive'
  priority: Priority,         // 'Critical' | 'High' | 'Medium' | 'Low'
  tags: string[],
  constraint?: string,
  stakeholder?: string,
  virtualId: string,          // E.g., CH-001
  ideasCount: number,         // Denormalized count of linked ideas
  contributor: ObjectId[],    // References to User
  upVotes: string[],          // List of User IDs
  subscriptions: string[],    // List of User IDs
  viewCount: number,          // Long
  timestampOfStatusChangedToPilot?: Date,
  timestampOfCompleted?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema (Shared Collection)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  comment: string,            // Required
  type: TargetType,           // 'Challenge' | 'Idea'
  parentId: ObjectId,         // Reference to parent entity
  createdAt: Date,
  updatedAt: Date
}
```

> Indexed on `{ parentId: 1, type: 1 }` for efficient querying.

### UserAction Schema (Shared Collection)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  targetId: ObjectId,         // Reference to target entity
  targetType: TargetType,     // 'Challenge' | 'Idea'
  actionType: ActionType,     // 'upvote' | 'subscribe'
  createdAt: Date,
  updatedAt: Date
}
```

> Unique compound index on `{ userId, targetId, targetType, actionType }` prevents duplicates.
> Indexed on `{ targetId: 1, targetType: 1 }` for efficient lookup.

### Idea Schema

```typescript
{
  _id: ObjectId,
  ideaId: string,          // E.g., ID-0001
  title: string,           // Required
  description: string,     // Required
  status: boolean,         // Default: true (Accepted)
  owner: ObjectId,         // Reference to User
  linkedChallenge: string, // Reference to Challenge _id
  tags: string[],
  appreciationCount: number, // Upvote count
  viewCount: number,
  problemStatement?: string,
  proposedSolution?: string,
  upVotes: string[],       // List of User IDs
  subscription: string[],  // List of User IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema

```typescript
{
  _id: ObjectId,
  title: string,           // Required
  description: string,     // Required
  stage: ChallengeStage,   // Related challenge stage
  owner: ObjectId,         // Reference to User
  priority: Priority,      // 'High' | 'Medium' | 'Low'
  status: TaskStatus,      // 'pending' | 'in_progress' | 'completed' | 'cancelled'
  progress?: number,       // 0-100
  dueDate?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to User
  type: NotificationType,  // 'challenge' | 'idea' | 'comment' | 'mention' | 'status' | 'system'
  title: string,           // Required
  message: string,         // Required
  link?: string,           // Deep link to related resource
  read: boolean,           // Default: false
  deleted: boolean,        // Soft delete flag
  deletedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 18. Docker & Deployment

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/aitaskdashboard
      - JWT_SECRET=your-production-secret
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    restart: unless-stopped

volumes:
  mongo_data:
```

### Running with Docker

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

---

## 19. Current Test Status

### ✅ Test Coverage Summary

| Metric | Coverage |
|--------|----------|
| **Statements** | 72.4% |
| **Branches** | 61.08% |
| **Functions** | 67.1% |
| **Lines** | 72.56% |

### Test Results

| Test Suite | Tests | Status |
|------------|-------|--------|
| Unit Tests | 105 | ✅ Passing |
| E2E Tests | 25 | ✅ Passing |
| Lint Errors | 0 | ✅ Clean |
| Lint Warnings | 8 | ⚠️ (test files only) |

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests with watch mode
npm run test:watch

# Test coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 20. Enums Reference

### UserRole
```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer'
}
```

### ChallengeStage (Portfolio Lane)
```typescript
enum ChallengeStage {
  CUSTOMER_VALUE_DRIVER = 'Customer Value Driver',
  NON_STRATEGIC_PRODUCT_MANAGEMENT = 'Non Strategic Product Management',
  TECH_ENABLER = 'Tech Enabler',
  MAINTENANCE = 'Maintenance'
}
```

### ChallengeStatus
```typescript
enum ChallengeStatus {
  SUBMITTED = 'submitted',
  IDEATION = 'ideation',
  PILOT = 'pilot',
  COMPLETED = 'completed',
  ARCHIVE = 'archive'
}
```

### TaskStatus
```typescript
enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### Priority
```typescript
enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}
```

### TargetType / CommentType
```typescript
// Shared entities
enum TargetType {
  CHALLENGE = 'CH',
  IDEA = 'ID'
}
```

### ActionType
```typescript
const ACTIVITY_TYPES = [
  'challenge_created', 'idea_created', 'challenge_status_update',
  'challenge_edited', 'idea_edited', 'challenge_upvoted', 'idea_upvoted',
  'challenge_commented', 'idea_commented', 'challenge_subscribed',
  'idea_subscribed', 'challenge_deleted', 'idea_deleted', 'log_in', 'log_out'
] as const;
```

### NotificationType
```typescript
const NOTIFICATION_TYPES = [
  'challenge_created', 'challenge_status_update', 'challenge_edited',
  'idea_edited', 'challenge_upvoted', 'idea_upvoted', 'challenge_commented',
  'idea_commented', 'challenge_subscribed', 'idea_subscribed',
  'challenge_deleted', 'idea_deleted'
] as const;
```

---

## 21. Query Parameters

All list endpoints support standard query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-indexed) | `?page=2` |
| `limit` | number | Items per page (default: 10, max: 100) | `?limit=20` |
| `sort` | string | Sort field | `?sort=createdAt` |
| `order` | string | Sort order (`asc` or `desc`) | `?order=desc` |

**Example:**
```
GET /api/v1/challenges?page=1&limit=10&sort=createdAt&order=desc
```

---

## 22. Swagger/OpenAPI Documentation

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

Features:
- 📖 Full endpoint documentation
- 🧪 Try-it-out functionality
- 📋 Request/Response schemas
- 🔐 JWT authentication support

---

## 23. Distributed Tracing

Every request is assigned a unique trace ID for debugging and correlation across services.

### Headers

| Header | Purpose |
|--------|---------|
| `x-correlation-id` | Client-provided correlation ID (honored if present) |
| `x-trace-id` | Server-assigned trace ID (always in response) |
| `x-request-id` | Alternative to correlation ID |

### Response Headers

```
x-correlation-id: 02c8f2b9-bf88-4dd5-bd79-e060b20bb1c3
x-trace-id: 02c8f2b9-bf88-4dd5-bd79-e060b20bb1c3
```

---

## 24. Healthcheck Endpoints

| Endpoint | Description |
|----------|-------------|
| `/metrics` | Prometheus metrics (system health) |
| `/api/docs` | Swagger UI (API health) |

---

## 25. DTO & Response Model Architecture

The backend implements a comprehensive DTO (Data Transfer Object) structure for request validation, response typing, and Swagger documentation.

### Directory Structure

```text
src/
├── dto/                    # Request/Response DTOs by module
│   ├── auth/
│   │   ├── auth.dto.ts            # AuthDto, RegisterDto
│   │   └── auth-response.dto.ts   # AuthApiResponseDto
│   ├── challenges/
│   │   ├── challenge.dto.ts       # ChallengeDto (create/update)
│   │   └── challenge-response.dto.ts
│   ├── ideas/
│   │   ├── create-idea.dto.ts     # CreateIdeaDto
│   │   ├── update-idea.dto.ts     # UpdateIdeaDto (PartialType)
│   │   └── idea-response.dto.ts   # IdeaApiResponseDto, IdeaListApiResponseDto
│   ├── tasks/
│   │   ├── create-task.dto.ts     # CreateTaskDto
│   │   ├── update-task.dto.ts     # UpdateTaskDto (PartialType)
│   │   └── task-response.dto.ts   # TaskApiResponseDto, TaskListApiResponseDto
│   ├── notifications/
│   │   ├── create-notification.dto.ts
│   │   ├── update-notification.dto.ts
│   │   └── notification-response.dto.ts
│   ├── users/
│   │   └── user-response.dto.ts   # UserApiResponseDto, UserListApiResponseDto
│   ├── dashboard/
│   │   └── dashboard-response.dto.ts
│   ├── metrics/
│   │   └── metrics-response.dto.ts
│   └── newsletter/
│       └── newsletter.dto.ts
└── common/
    └── dto/
        ├── query.dto.ts           # QueryDto for pagination
        └── responses/
            ├── api-response.dto.ts    # BaseApiResponseDto, ErrorResponseDto
            ├── pagination.dto.ts      # PaginationMetaDto, PaginatedResponseDto
            └── index.ts               # Barrel exports
```

### DTO Design Patterns

#### 1. Create/Update Pattern
For modules requiring both create and update operations, we use NestJS's `PartialType`:

```typescript
// create-idea.dto.ts
export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  // ... other required fields
}

// update-idea.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateIdeaDto } from './create-idea.dto';

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {}
```

> **Important**: `PartialType` is imported from `@nestjs/swagger` (not `@nestjs/mapped-types`) to ensure proper Swagger schema generation.

#### 2. Response Wrapper Pattern
All API responses follow a consistent wrapper structure:

```typescript
// Success Response
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful",
  "requestId": "uuid-v4",
  "traceId": "uuid-v4",
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// Error Response
{
  "status": "error",
  "message": "Error description",
  "error": "ErrorType",
  "statusCode": 404,
  "requestId": "uuid-v4",
  "traceId": "uuid-v4",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 3. Pagination Response Pattern
List endpoints return paginated data with metadata:

```typescript
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Response DTOs by Module

| Module | Response DTOs |
|--------|---------------|
| **Auth** | `AuthApiResponseDto` |
| **Challenges** | `ChallengeApiResponse`, `ChallengeListApiResponse` |
| **Ideas** | `IdeaApiResponseDto`, `IdeaListApiResponseDto` |
| **Tasks** | `TaskApiResponseDto`, `TaskListApiResponseDto` |
| **Notifications** | `NotificationApiResponseDto`, `NotificationListApiResponseDto`, `UnreadCountApiResponseDto`, `MarkReadApiResponseDto` |
| **Users** | `UserApiResponseDto`, `UserListApiResponseDto` |
| **Dashboard** | `SwimLanesApiResponseDto` |
| **Metrics** | `MetricsSummaryApiResponseDto`, `ThroughputApiResponseDto` |
| **Newsletter** | `NewsletterApiResponseDto` |

### Swagger Integration
All response DTOs are annotated with `@ApiProperty()` decorators for automatic Swagger schema generation:

```typescript
export class IdeaDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'AI-powered chatbot' })
  title: string;

  @ApiProperty({ enum: ['Ideation', 'Evaluation', 'POC', 'Pilot', 'Scale'] })
  status: IdeaStatus;
}
```

### Common DTOs

#### QueryDto (Pagination)
Standard query parameters for all list endpoints:

```typescript
export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
```

#### ErrorResponseDto
Standardized error response structure:

```typescript
export class ErrorResponseDto {
  @ApiProperty({ example: 'error' })
  status: string;

  @ApiProperty({ example: 'Resource not found' })
  message: string;

  @ApiProperty({ example: 'NotFoundException' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;
}
```

---

© 2024 AiTaskDashboard. All Rights Reserved.
