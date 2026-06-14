import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  currentUserHandler,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate-request.js";
import {
  registerBodySchema,
  loginBodySchema,
  refreshBodySchema,
} from "../validators/auth.validators.js";

export const authRouter = Router();

authRouter.post("/register", validateRequest({ body: registerBodySchema }), registerHandler);
authRouter.post("/login", validateRequest({ body: loginBodySchema }), loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/refresh", validateRequest({ body: refreshBodySchema }), refreshHandler);
authRouter.get("/me", currentUserHandler);
