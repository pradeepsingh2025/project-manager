import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { getDashboardStatsHandler } from "./dashboard.controller.js";

const router = Router();

// Dashboard routes only need token verification (ADMIN/USER handle logic internally)
router.use(verifyToken);

router.get("/stats", getDashboardStatsHandler);

export default router;
