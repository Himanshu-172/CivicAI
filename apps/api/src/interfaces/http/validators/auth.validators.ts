import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z
    .enum(["CITIZEN", "GOVERNMENT_OFFICER", "FIELD_WORKER", "ADMIN"])
    .optional(),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});
