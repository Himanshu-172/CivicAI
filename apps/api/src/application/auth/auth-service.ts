import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, type IUser } from "../../infrastructure/models/user.model.js";
import { env } from "../../infrastructure/config/environment.js";
import { AppError } from "../errors/app-error.js";
import { type UserPayload, UserRole } from "../../domain/user.js";

const SALT_ROUNDS = 10;

function toPayload(user: IUser): UserPayload {
  return { id: user.id, email: user.email, role: user.role as UserRole };
}

export async function registerUser(email: string, password: string, role = UserRole.Citizen) {
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) throw new AppError("Email already registered", 400, "EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ email, passwordHash, role });
  return toPayload(user);
}

export async function authenticateUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  return user;
}

export function signAccessToken(payload: UserPayload) {
  // cast to any to satisfy jsonwebtoken TypeScript overloads
  return (jwt as any).sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN });
}

export function signRefreshToken(payload: UserPayload) {
  return (jwt as any).sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN });
}

export async function storeRefreshToken(userId: string, refreshToken: string) {
  // store hashed refresh token
  const hash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await UserModel.findByIdAndUpdate(userId, { $push: { refreshTokens: hash } });
}

export async function revokeRefreshToken(userId: string, refreshToken?: string) {
  if (!refreshToken) {
    // clear all
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
    return;
  }

  const user = await UserModel.findById(userId);
  if (!user) return;

  const remaining = [] as string[];
  for (const stored of user.refreshTokens) {
    const match = await bcrypt.compare(refreshToken, stored);
    if (!match) remaining.push(stored);
  }
  user.refreshTokens = remaining;
  await user.save();
}

export async function verifyRefreshToken(token: string) {
  let payload: UserPayload;
  try {
    payload = (jwt as any).verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
  } catch (e) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const user = await UserModel.findById(payload.id);
  if (!user) throw new AppError("User not found for refresh token", 401, "INVALID_REFRESH_TOKEN");

  // ensure token exists
  let found = false;
  for (const stored of user.refreshTokens) {
    // compare hashed stored token
    // bcrypt.compare will return true if token matches hashed stored
    // run compare sequentially for safety
    // eslint-disable-next-line no-await-in-loop
    if (await bcrypt.compare(token, stored)) {
      found = true;
      break;
    }
  }

  if (!found) throw new AppError("Refresh token revoked", 401, "REFRESH_REVOKED");

  return { user, payload } as { user: IUser; payload: UserPayload };
}

export function verifyAccessToken(token: string) {
  try {
    return (jwt as any).verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
  } catch (e) {
    return null;
  }
}
