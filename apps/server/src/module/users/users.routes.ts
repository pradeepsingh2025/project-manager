import { Router } from "express";
import { verifyToken, requireAdmin } from "../../middleware/verifyToken.js";
import * as usersController from "./users.controller.js";

const router = Router();

// Apply verifyToken to all routes
router.use(verifyToken);

// Admin only: Get all users
router.get("/", requireAdmin, usersController.getUsersHandler);

export default router;
