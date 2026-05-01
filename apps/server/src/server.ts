import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "@/module/auth/auth.routes.js";
import projectsRouter from "@/module/projects/projects.routes.js";
import tasksRouter from "@/module/tasks/tasks.routes.js";
import dashboardRouter from "@/module/dashboard/dashboard.routes.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true, // needed for HttpOnly cookie exchange
  })
);
app.use(express.json());
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/dashboard", dashboardRouter);

// ─── Health ──────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

export default app;
