import { Router } from "express";
import { verifyToken, requireAdmin } from "../../middleware/verifyToken.js";
import * as tasksController from "./tasks.controller.js";

const router = Router();

// Apply verifyToken to all routes
router.use(verifyToken);

// Task operations (USER & ADMIN)
router.patch("/:id/status", tasksController.updateTaskStatusHandler);

// Task operations (ADMIN ONLY)
router.put("/:id", requireAdmin, tasksController.updateTaskHandler);
router.delete("/:id", requireAdmin, tasksController.deleteTaskHandler);

export default router;
