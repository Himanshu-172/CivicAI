# CivicAI Scaffold Architecture

## Runtime Boundaries

```text
React/Vite web application
          |
          v
Express API + Socket.io
     |             |
     v             v
MongoDB       FastAPI AI service
                   |
                   v
             YOLOv8 + OpenCV
```

The web application communicates with the Express API over HTTP and Socket.io.
Only the Express API reads and writes MongoDB. The API calls the internal
FastAPI service for future image-analysis workflows.

## Frontend Structure

- `src/app`: application providers and routing
- `src/components/ui`: shadcn/ui components
- `src/features`: future feature modules
- `src/lib`: shared Axios client and utilities
- `src/pages`: route-level components

## Backend Structure

- `src/config`: runtime configuration
- `src/middleware`: JWT, authorization, and Multer middleware
- `src/models`: Mongoose schemas and models
- `src/modules`: domain API modules
- `src/sockets`: Socket.io namespaces and handlers

## AI Service Structure

- `app/models`: YOLOv8 model loading and model metadata
- `app/pipelines`: OpenCV and Ultralytics processing pipelines

## Planned MongoDB Collections

- `users`
- `jurisdictions`
- `organizations`
- `memberships`
- `issues`
- `issueCategories`
- `comments`
- `attachments`
- `assignments`
- `notifications`
- `aiRuns`
- `auditLogs`

Tenant-owned documents will carry a `jurisdictionId`. Mongoose schemas and
indexes will be created only after scaffold approval.

