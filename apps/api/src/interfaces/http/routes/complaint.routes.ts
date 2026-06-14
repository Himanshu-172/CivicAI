import { Router } from "express";
import { validateRequest } from "../middleware/validate-request.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  createComplaintHandler,
  listComplaintsHandler,
  getComplaintHandler,
  updateComplaintHandler,
  deleteComplaintHandler,
} from "../controllers/complaint.controller.js";
import { createComplaintSchema, updateComplaintSchema, listComplaintsQuery } from "../validators/complaint.validators.js";

export const complaintRouter = Router();

complaintRouter.post("/", requireAuth, validateRequest({ body: createComplaintSchema.shape.body }), createComplaintHandler);
complaintRouter.get("/", validateRequest({ query: listComplaintsQuery.shape.query }), listComplaintsHandler);
complaintRouter.get("/:id", getComplaintHandler);
complaintRouter.put("/:id", requireAuth, validateRequest({ body: updateComplaintSchema.shape.body }), updateComplaintHandler);
complaintRouter.delete("/:id", requireAuth, deleteComplaintHandler);
