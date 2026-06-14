import pino from "pino";
import { env } from "../config/environment.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "civic-ai-api",
  },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    censor: "[REDACTED]",
  },
});

