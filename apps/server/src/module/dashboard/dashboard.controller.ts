import type { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "./dashboard.service.js";

export async function getDashboardStatsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getDashboardStats(req.user!.id, req.user!.role);
    return res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}
