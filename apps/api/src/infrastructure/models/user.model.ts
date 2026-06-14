import mongoose, { type Document } from "mongoose";
import { UserRole } from "../../domain/user.js";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshTokens: string[]; // hashed refresh tokens
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.Citizen },
    refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
