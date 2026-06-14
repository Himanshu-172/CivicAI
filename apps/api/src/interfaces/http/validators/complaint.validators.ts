import { z } from "zod";
const CATEGORY_VALUES = [
  "SANITATION",
  "ROAD",
  "ELECTRICITY",
  "WATER",
  "OTHER",
] as const;

const SEVERITY_VALUES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const STATUS_VALUES = ["OPEN", "IN_PROGRESS", "CLOSED", "REJECTED"] as const;

export const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    category: z.enum(CATEGORY_VALUES),
    severity: z.enum(SEVERITY_VALUES),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
    department: z.string().optional(),
  }),
});

export const updateComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    category: z.enum(CATEGORY_VALUES).optional(),
    severity: z.enum(SEVERITY_VALUES).optional(),
    status: z.enum(STATUS_VALUES).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
    assignedOfficerId: z.string().optional(),
    assignedWorkerId: z.string().optional(),
    department: z.string().optional(),
  }),
});

export const listComplaintsQuery = z.object({
  query: z.object({
    category: z.string().optional(),
    status: z.string().optional(),
    severity: z.string().optional(),
    limit: z.coerce.number().int().positive().optional(),
    skip: z.coerce.number().int().min(0).optional(),
  }),
});
