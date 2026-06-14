# CivicAI API Foundation

## Clean Architecture Boundaries

- `src/domain`: future domain entities and rules
- `src/application`: framework-independent application use cases and errors
- `src/infrastructure`: environment, MongoDB, logging, OpenAPI, and storage
- `src/interfaces/http`: Express routes and middleware
- `src/interfaces/socket`: Socket.io initialization
- `src/main.ts`: composition root and process lifecycle

Milestone 1 intentionally contains no authentication implementation, user or
complaint models, AI integration, or business logic.

## Endpoints

- `GET /api/health`
- `GET /api/openapi.json`
- `GET /api/docs`

