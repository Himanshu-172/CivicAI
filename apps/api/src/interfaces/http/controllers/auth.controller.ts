import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import {
  registerUser,
  authenticateUser,
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../../../application/auth/auth-service.js";
import { logger } from "../../../infrastructure/logging/logger.js";
import type { UserPayload } from "../../../domain/user.js";
import { UserRole } from "../../../domain/user.js";

type RegisterBody = { email: string; password: string; role?: string };
export const registerHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const body = req.body as RegisterBody;
    const role =
      body.role && Object.values(UserRole).includes(body.role as UserRole)
        ? (body.role as UserRole)
        : undefined;
    const user = await registerUser(body.email, body.password, role ?? UserRole.Citizen);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

type LoginBody = { email: string; password: string };
export const loginHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const body = req.body as LoginBody;
    const user = await authenticateUser(body.email, body.password);

    const id = String(user.id ?? user._id);
  const role = user.role ?? UserRole.Citizen;
    const payload: UserPayload = { id, email: String(user.email), role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await storeRefreshToken(id, refreshToken);

    res.status(200).json({ accessToken, refreshToken, user: payload });
  } catch (error) {
    logger.warn({ err: error }, "Login failed");
    next(error);
  }
};

export const logoutHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const auth = req.authToken;
    if (!auth) {
      const { userId } = req.body as { userId?: string };
      if (userId) await revokeRefreshToken(userId);
      res.status(200).json({ ok: true });
      return;
    }

    const decoded = jwt.decode(auth) as JwtPayload | null;
    const id = typeof decoded === "object" && decoded?.id ? String(decoded.id) : undefined;
    if (id) await revokeRefreshToken(id);

    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
};

type RefreshBody = { refreshToken: string };
export const refreshHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { refreshToken } = req.body as RefreshBody;
    const { user, payload } = await verifyRefreshToken(refreshToken);

    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);

  await revokeRefreshToken(String(user.id ?? user._id), refreshToken);
  await storeRefreshToken(String(user.id ?? user._id), newRefresh);

    res.status(200).json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (error) {
    next(error);
  }
};

export const currentUserHandler: RequestHandler = (req, res, next): void => {
  try {
    const token = req.authToken;
    if (!token) {
      res.status(200).json({ user: null });
      return;
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      res.status(200).json({ user: null });
      return;
    }

    res.status(200).json({ user: payload });
  } catch (error) {
    next(error);
  }
};
