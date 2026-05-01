import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "@/module/auth/auth.routes.js";

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

// ─── Health ──────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

export default app;
