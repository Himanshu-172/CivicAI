import type { RequestHandler } from "express";
import {
  registerUser,
  authenticateUser,
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../../../application/auth/auth-service.js";
import { logger } from "../../../infrastructure/logging/logger.js";

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await storeRefreshToken(user.id, refreshToken);

    // set httpOnly refresh cookie as optional (not required by spec) - keep simple and return tokens in body
    res.status(200).json({ accessToken, refreshToken, user: payload });
  } catch (error) {
    logger.warn({ err: error }, "Login failed");
    next(error);
  }
};

export const logoutHandler: RequestHandler = async (req, res, next) => {
  try {
    const auth = req.authToken;
    if (!auth) {
      // try to read user id from body
      const { userId } = req.body as { userId?: string };
      if (userId) await revokeRefreshToken(userId);
      return res.status(200).json({ ok: true });
    }

    // if auth token provided, try to decode and revoke all refresh tokens
    // decode without verifying expiration
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jwt = require("jsonwebtoken");
    const decoded = jwt.decode(auth) as { id?: string } | null;
    if (decoded?.id) await revokeRefreshToken(decoded.id);

    return res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
};

export const refreshHandler: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const { user, payload } = await verifyRefreshToken(refreshToken);

    // issue new tokens
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);

    // rotate refresh tokens: remove old and store new
    await revokeRefreshToken(user.id, refreshToken);
    await storeRefreshToken(user.id, newRefresh);

    res.status(200).json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (error) {
    next(error);
  }
};

export const currentUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const token = req.authToken;
    if (!token) return res.status(200).json({ user: null });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jwt = require("jsonwebtoken");
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "") as {
        id: string;
        email: string;
        role: string;
      };
      res.status(200).json({ user: payload });
    } catch (_e) {
      res.status(200).json({ user: null });
    }
  } catch (error) {
    next(error);
  }
};
