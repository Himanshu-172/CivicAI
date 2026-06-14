import { Router } from "express";
import { z } from "zod";
import { getHealth } from "../../../application/health/get-health.js";
import { validateRequest } from "../middleware/validate-request.js";

const healthQuerySchema = z.object({}).strict();

export const healthRouter = Router();

healthRouter.get(
  "/",
  validateRequest({ query: healthQuerySchema }),
  (_request, response) => {
    response.status(200).json(getHealth());
  },
);
