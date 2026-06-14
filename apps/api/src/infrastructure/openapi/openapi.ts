export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "CivicAI API",
    version: "0.1.0",
    description: "CivicAI backend foundation API",
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Return API health",
        tags: ["Health"],
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["service", "status", "timestamp"],
                  properties: {
                    service: { type: "string", const: "api" },
                    status: { type: "string", const: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  role: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login and receive tokens",
        tags: ["Auth"],
        responses: { "200": { description: "Tokens" } },
      },
    },
    "/api/auth/refresh": {
      post: {
        summary: "Refresh access token",
        tags: ["Auth"],
        responses: { "200": { description: "New tokens" } },
      },
    },
    "/api/auth/me": {
      get: { summary: "Get current user", tags: ["Auth"], responses: { "200": { description: "Current user" } } },
    },
    "/api/complaints": {
      post: {
        summary: "Create complaint",
        tags: ["Complaints"],
        responses: { "201": { description: "Complaint created" } },
      },
      get: {
        summary: "List complaints",
        tags: ["Complaints"],
        responses: { "200": { description: "List" } },
      },
    },
    "/api/complaints/{id}": {
      get: { summary: "Get complaint", tags: ["Complaints"], responses: { "200": { description: "Complaint" } } },
      put: { summary: "Update complaint", tags: ["Complaints"], responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete complaint", tags: ["Complaints"], responses: { "204": { description: "Deleted" } } },
    },
  },
} as const;

