export const openApiDocument = {
  openapi: "3.1.0",
  info: { title: "CivicAI API", version: "0.1.0", description: "CivicAI backend foundation API" },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      RegisterRequest: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string" }, role: { type: "string" } } },
      LoginRequest: { type: "object", required: ["email", "password"], properties: { email: { type: "string" }, password: { type: "string" } } },
      RefreshRequest: { type: "object", required: ["refreshToken"], properties: { refreshToken: { type: "string" } } },
      TokenResponse: { type: "object", properties: { accessToken: { type: "string" }, refreshToken: { type: "string" } } },
      CurrentUserResponse: { type: "object", properties: { user: { anyOf: [{ type: "null" }, { type: "object", properties: { id: { type: "string" }, email: { type: "string" }, role: { type: "string" } } }] } } },
      Complaint: { type: "object", properties: { id: { type: "string" }, title: { type: "string" }, description: { type: "string" } } },
      CreateComplaintRequest: { type: "object", required: ["title", "category", "severity"], properties: { title: { type: "string" }, category: { type: "string" }, severity: { type: "string" } } },
      UpdateComplaintRequest: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } } },
    },
  },
  paths: {
    "/api/health": { get: { summary: "Return API health", tags: ["Health"], responses: { "200": { description: "API is healthy", content: { "application/json": { schema: { type: "object" } } } } } } },
  },
} as const;
