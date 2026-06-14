import type { RequestHandler } from "express";
import { createComplaint, updateComplaint, deleteComplaint, getComplaintById, listComplaints } from "../../../application/complaint/complaint-service.js";
import { logger } from "../../../infrastructure/logging/logger.js";
import { AppError } from "../../../application/errors/app-error.js";

type CreateComplaintBody = {
  title: string;
  description?: string;
  category: string;
  severity: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  imageUrls?: string[];
  department?: string;
};

type UpdateComplaintBody = Partial<CreateComplaintBody> & {
  status?: string;
  assignedOfficerId?: string;
  assignedWorkerId?: string;
};

export const createComplaintHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as CreateComplaintBody;
    // citizenId comes from authenticated user
  const citizenId = req.user?.id;
    if (!citizenId) throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
    const data = { ...body, citizenId } as Partial<import("../../../infrastructure/models/complaint.model.js").IComplaint>;
    const complaint = await createComplaint(data);
    res.status(201).json({ complaint });
  } catch (error) {
    logger.error({ err: error }, "Create complaint failed");
    next(error);
  }
};

export const listComplaintsHandler: RequestHandler = async (req, res, next) => {
  try {
    const q = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (q.category) filter.category = q.category;
    if (q.status) filter.status = q.status;
    if (q.severity) filter.severity = q.severity;
    const limit = q.limit ? Number(q.limit) : 50;
    const skip = q.skip ? Number(q.skip) : 0;
    const items = await listComplaints(filter, limit, skip);
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const getComplaintHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const complaint = await getComplaintById(id);
    if (!complaint) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Complaint not found" } });
    res.status(200).json({ complaint });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await getComplaintById(id);
    if (!existing) throw new AppError("Not found", 404, "NOT_FOUND");

    // only owner (citizen) or admin can update
    const requester = req.user;
    const isOwner = requester?.id === existing.citizenId;
    const isAdmin = requester?.role === "ADMIN";
    if (!isOwner && !isAdmin) throw new AppError("Forbidden", 403, "FORBIDDEN");

    const body = req.body as UpdateComplaintBody;
    const updated = await updateComplaint(id, body as Partial<import("../../../infrastructure/models/complaint.model.js").IComplaint>);
    res.status(200).json({ complaint: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteComplaintHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await getComplaintById(id);
    if (!existing) throw new AppError("Not found", 404, "NOT_FOUND");

    const requester = req.user;
    const isOwner = requester?.id === existing.citizenId;
    const isAdmin = requester?.role === "ADMIN";
    if (!isOwner && !isAdmin) throw new AppError("Forbidden", 403, "FORBIDDEN");

    await deleteComplaint(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
