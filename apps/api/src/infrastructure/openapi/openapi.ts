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
  },
} as const;

