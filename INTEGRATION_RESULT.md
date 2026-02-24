# Frontend-Backend Integration Mapping

This document serves as the source of truth for how the React frontend components integrate with the NestJS backend endpoints. It is designed to be easily parseable by AI agents and developers to detect and fix drift.

## Integration Table

| Feature Domain | Frontend Component(s) | API Service Function | Backend Endpoint & Method | Purpose |
|----------------|-----------------------|----------------------|---------------------------|---------|
| **Authentication** | `AuthContext`, `Login`, `Register` | `authService.login`<br>`authService.register`<br>`authService.logout` | `POST /auth/login`<br>`POST /auth/register`<br>`POST /auth/logout` | Manages user session, login, registration, and logout. |
| **Home Dashboard** | `Home` | `homeService.getTopChallenges`<br>`homeService.getStatusDistribution`<br>`homeService.getKeyMetrics`<br>...and more | `GET /home/top-challenges`<br>`GET /home/status-distribution`<br>`GET /home/key-metrics`<br>`GET /challenges/status/:status`<br>...and more | Fetches aggregated data (top challenges, metrics, throughput) for the main landing page. |
| **Challenges (List/Board)** | `SwimLanes`, `ChallengeCards` | `challengeService.getChallenges`<br>`challengeService.updateChallengeStatus` | `GET /challenges`<br>`PATCH /challenges/:virtualId/status` | Retrieves challenges for Kanban/List views and updates status on drag-and-drop. |
| **Challenge Creation** | `SubmitChallenge` | `challengeService.createChallenge` | `POST /challenges` | Submits a new challenge to the system. |
| **Challenge Detail** | `ChallengeDetail` | `challengeService.getChallengeById`<br>`challengeService.recordView`<br>`challengeService.toggleUpvote`<br>`challengeService.toggleSubscribe`<br>`ideaService.getIdeasForChallenge`<br>`commentService.getCommentsForChallenge` | `GET /challenges/:virtualId`<br>`POST /challenges/:virtualId/view`<br>`POST /challenges/:virtualId/upvote`<br>`POST /challenges/:virtualId/subscribe`<br>`GET /ideas/challenge/:virtualId`<br>`GET /comments/challenge/:virtualId` | Displays full challenge details, tracks views, handles upvotes/subscriptions, and loads associated ideas and comments. |
| **Idea Detail** | `IdeaDetail` | `ideaService.getIdeaById`<br>`ideaService.recordView`<br>`ideaService.toggleUpvote`<br>`ideaService.toggleSubscribe`<br>`challengeService.getChallengeById`<br>`commentService.getCommentsForChallenge` | `GET /ideas/:virtualId`<br>`POST /ideas/:virtualId/view`<br>`POST /ideas/:virtualId/upvote`<br>`POST /ideas/:virtualId/subscribe`<br>`GET /challenges/:virtualId`<br>`GET /comments/challenge/:virtualId` | Displays specific idea details, tracks views, handles upvotes/subscriptions, and fetches parent challenge and comments. |
| **Idea Creation** | `ChallengeDetail` (Modal) | `ideaService.createIdea` | `POST /ideas` | Submits a new idea associated with a specific challenge. |
| **Comments** | `ChallengeDetail`, `IdeaDetail` | `commentService.createComment` | `POST /comments` | Adds a new comment to either a challenge or an idea. |
| **Notifications** | `Notifications`, `Header` | `notificationService.getNotifications`<br>`notificationService.getUnreadCount`<br>`notificationService.markAsRead`<br>`notificationService.deleteNotification` | `GET /notifications/user/:userId`<br>`GET /notifications/user/:userId/count`<br>`PATCH /notifications/:notificationId/status`<br>`DELETE /notifications/:notificationId` | Fetches user notifications, unread count badge, and handles reading/deleting actions. |
| **Metrics/Analytics** | `Metrics` | `metricsService.getSummary`<br>`metricsService.getThroughput`<br>`metricsService.getFunnel`<br>...and more | `GET /metrics/summary`<br>`GET /metrics/throughput`<br>`GET /metrics/funnel`<br>...and more | Fetches detailed analytics for the Metrics dashboard page. |
| **User Profile** | `Profile` | `userService.getUserById` | `GET /users/:id` | Fetches specific user details for the profile view. |

## Quick Troubleshooting Guide
- **If a frontend component fails to load data:** Check the **API Service Function** in the second column to trace the request, then verify the **Backend Endpoint** is correctly defined in the corresponding NestJS controller and Swagger specs.
- **If a backend endpoint signature changes:** Search the frontend codebase for the **API Service Function** listed in the table and update the payload map. Using this document helps localize the drift impact instantly.
