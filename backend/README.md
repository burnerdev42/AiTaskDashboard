# 🚀 AiTaskDashboard Backend

[![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](https://opensource.org/licenses/MIT)

> **Architect**: Antigravity  
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
│   ├── tasks/             # Automated AI/Background tasks
│   ├── notifications/     # Notification dispatch & Newsletter subscription
│   ├── dashboard/         # Aggregated views (e.g., Swimlanes)
│   └── metrics/           # ROI and KPI reporting APIs
├── common/                # Shared Cross-Cutting Concerns
│   ├── enums/             # System-wide Enums (ApiStatus, UserRole, etc.)
│   ├── filters/           # Global Exception Filters
│   ├── interceptors/      # Response Transformers & Logging Interceptors
│   ├── interfaces/        # Shared Type definitions & Interfaces
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
- **Authentic Feature**: Ensures every API response contains `status: "success"`, `data`, and `timestamp`.

### `GlobalExceptionFilter`
Captures all exceptions (Http, Database, Runtime) and converts them into a secure, standard error format.

### `LoggingInterceptor`
Intercepts every request to log the HTTP method, URL, and total execution time in milliseconds.

---

## 6. API Design Standards

### RESTful Conventions
- **Base Prefix**: `/api`
- **Versioning**: Versioning via header or prefix is supported (currently `v1` implied).
- **Paths**: Plural nouns for resource names (e.g., `/api/challenges`).

### Communication Formats
**Success Response (200 OK / 201 Created)**
```json
{
  "status": "success",
  "data": { ... },
  "timestamp": "2024-03-20T10:00:00.000Z"
}
```

**Error Response (400 Bad Request / 500 Internal)**
```json
{
  "status": "error",
  "message": "User-friendly error message",
  "errors": [ ... ],
  "path": "/api/resource",
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
1.  **Base URL**: `http://localhost:3000/api`
2.  **Auth**: Send JWT in the header: `Authorization: Bearer <token>`.
3.  **Standard Response**: Expect the `data` object for the actual payload.
4.  **Errors**: Check for `status: "error"` and the `message` field for user feedback.
5.  **Swagger UI**: Visit `/api/docs` for the interactive playground and model definitions.

---
© 2024 AiTaskDashboard. All Rights Reserved.
