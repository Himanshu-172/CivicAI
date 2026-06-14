import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "../../infrastructure/config/environment.js";
import { logger } from "../../infrastructure/logging/logger.js";
import { openApiDocument } from "../../infrastructure/openapi/openapi.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/error-handler.js";
import { jwtStub } from "./middleware/jwt-stub.js";
import { apiRateLimiter } from "./middleware/rate-limit.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(apiRateLimiter);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(jwtStub);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get("/api/openapi.json", (_request, response) => {
    response.status(200).json(openApiDocument);
  });
  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
