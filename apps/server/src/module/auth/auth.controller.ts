import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "./auth.service.js";

// ─── Cookie helpers ───────────────────────────────────────────────────────────
const REFRESH_COOKIE = "refresh_token";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/api/auth/refresh", // scope cookie to refresh endpoint
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth/refresh" });
}

// ─── Validation schemas ───────────────────────────────────────────────────────
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password, role } = parsed.data;
    const { user, tokens } = await authService.signup(name, email, password, role as "USER" | "ADMIN");

    setRefreshCookie(res, tokens.refreshToken);
    res.status(201).json({ user, accessToken: tokens.accessToken });
  } catch (err: unknown) {
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parsed.data;
    const { user, tokens } = await authService.login(email, password);

    setRefreshCookie(res, tokens.refreshToken);
    res.status(200).json({ user, accessToken: tokens.accessToken });
  } catch (err: unknown) {
    next(err);
  }
}

export function refreshController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string | undefined = req.cookies[REFRESH_COOKIE];
    if (!token) {
      res.status(401).json({ message: "No refresh token" });
      return;
    }

    const tokens = authService.refreshTokens(token);

    setRefreshCookie(res, tokens.refreshToken);
    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (err: unknown) {
    next(err);
  }
}

export function logoutController(_req: Request, res: Response) {
  clearRefreshCookie(res);
  res.status(200).json({ message: "Logged out" });
}

// ─── Global error handler ─────────────────────────────────────────────────────
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = (err as { status?: number }).status ?? 500;
  const message =
    err instanceof Error ? err.message : "Internal server error";
  res.status(status).json({ message });
}
