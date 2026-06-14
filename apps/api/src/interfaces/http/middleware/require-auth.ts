import type { RequestHandler } from "express";
import { verifyAccessToken } from "../../../application/auth/auth-service.js";
import { AppError } from "../../../application/errors/app-error.js";
import type { UserPayload } from "../../../domain/user.js";

export const requireAuth: RequestHandler = (req, _res, next): void => {
  const token = req.authToken;
  if (!token) {
    next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    next(new AppError("Invalid or expired access token", 401, "INVALID_TOKEN"));
    return;
  }

  // attach user info to request
  (req as { user?: UserPayload }).user = payload;
  next();
};
