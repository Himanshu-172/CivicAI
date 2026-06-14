import type { RequestHandler } from "express";
import { verifyAccessToken } from "../../../application/auth/auth-service.js";
import { AppError } from "../../../application/errors/app-error.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.authToken;
  if (!token) return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));

  const payload = verifyAccessToken(token);
  if (!payload) return next(new AppError("Invalid or expired access token", 401, "INVALID_TOKEN"));

  // attach user info to request
  // attach typed user to request
  (req as any).user = payload;
  next();
};
