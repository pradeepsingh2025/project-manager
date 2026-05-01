import { Router } from "express";
import { verifyToken, requireAdmin } from "../../middleware/verifyToken.js";
import * as projectsController from "./projects.controller.js";

const router = Router();

// Apply verifyToken to all routes in this module
router.use(verifyToken);

// Read operations (USER & ADMIN)
router.get("/", projectsController.getProjectsHandler);
router.get("/:id", projectsController.getProjectByIdHandler);
router.get("/:id/tasks", projectsController.getProjectTasksHandler);

// Project operations (ADMIN ONLY)
router.post("/", requireAdmin, projectsController.createProjectHandler);
router.put("/:id", requireAdmin, projectsController.updateProjectHandler);
router.delete("/:id", requireAdmin, projectsController.deleteProjectHandler);

// Project member operations (ADMIN ONLY)
router.post("/:id/members", requireAdmin, projectsController.addMemberHandler);
router.delete("/:id/members/:userId", requireAdmin, projectsController.removeMemberHandler);

// Project task operations (ADMIN ONLY)
router.post("/:id/tasks", requireAdmin, projectsController.createProjectTaskHandler);

export default router;
