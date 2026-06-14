import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { UserModel, type IUser } from "../../infrastructure/models/user.model.js";
import { env } from "../../infrastructure/config/environment.js";
import { AppError } from "../errors/app-error.js";
import type { UserPayload } from "../../domain/user.js";
import { UserRole } from "../../domain/user.js";

const SALT_ROUNDS = 10;

export async function registerUser(
  email: string,
  password: string,
  role: UserRole = UserRole.Citizen,
): Promise<UserPayload> {
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) throw new AppError("Email already registered", 400, "EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ email, passwordHash, role });
  const payload: UserPayload = {
    id: String(user.id ?? user._id),
    email: String(user.email),
  role: user.role ?? UserRole.Citizen,
  };
  return payload;
}

export async function authenticateUser(email: string, password: string): Promise<IUser> {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  return user;
}

export function signAccessToken(payload: UserPayload): string {
  const options: SignOptions = { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as unknown as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: UserPayload): string {
  const options: SignOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as unknown as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export async function storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const hash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await UserModel.findByIdAndUpdate(userId, { $push: { refreshTokens: hash } });
}

export async function revokeRefreshToken(userId: string, refreshToken?: string): Promise<void> {
  if (!refreshToken) {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
    return;
  }

  const user = await UserModel.findById(userId);
  if (!user) return;

  // compare all stored tokens in parallel to avoid await-in-loop
  const checks: boolean[] = await Promise.all(
    user.refreshTokens.map((stored) => bcrypt.compare(refreshToken, stored)),
  );

  const remaining = user.refreshTokens.filter((_, idx) => !checks[idx]);
  user.refreshTokens = remaining;
  await user.save();
}

export async function verifyRefreshToken(
  token: string,
): Promise<{ user: IUser; payload: UserPayload }> {
  let payload: UserPayload;
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
  } catch {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const user = await UserModel.findById(payload.id);
  if (!user) throw new AppError("User not found for refresh token", 401, "INVALID_REFRESH_TOKEN");

  const checks: boolean[] = await Promise.all(user.refreshTokens.map((stored) => bcrypt.compare(token, stored)));

  const found = checks.some(Boolean);
  if (!found) throw new AppError("Refresh token revoked", 401, "REFRESH_REVOKED");

  return { user, payload };
}

export function verifyAccessToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
  } catch {
    return null;
  }
}
