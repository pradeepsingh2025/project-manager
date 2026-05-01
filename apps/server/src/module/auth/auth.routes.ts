import { Router } from "express";
import {
  signupController,
  loginController,
  refreshController,
  logoutController,
  errorHandler,
} from "./auth.controller.js";

export const authRouter = Router();

// POST /api/auth/signup
authRouter.post("/signup", signupController);

// POST /api/auth/login
authRouter.post("/login", loginController);

// POST /api/auth/refresh  — reads HttpOnly cookie, issues new pair
authRouter.post("/refresh", refreshController);

// POST /api/auth/logout   — clears HttpOnly cookie
authRouter.post("/logout", logoutController);

// Route-scoped error handler (must be last)
authRouter.use(errorHandler);
