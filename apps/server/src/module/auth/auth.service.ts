import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function buildTokenPair(user: {
  id: string;
  email: string;
  role: string;
}): TokenPair {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function signup(
  name: string,
  email: string,
  password: string,
  role: "USER" | "ADMIN" = "USER"
): Promise<{ user: { id: string; name: string; email: string; role: string }; tokens: TokenPair }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw Object.assign(new Error("Email already in use"), { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
    select: { id: true, name: true, email: true, role: true },
  });

  const tokens = buildTokenPair(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: { id: string; name: string; email: string; role: string }; tokens: TokenPair }> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, password: true },
  });

  if (!user || !user.password) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }

  const tokens = buildTokenPair(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens };
}

export function refreshTokens(refreshToken: string): TokenPair {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
  } catch {
    throw Object.assign(new Error("Invalid or expired refresh token"), {
      status: 401,
    });
  }

  // Stateless: trust the signed refresh token — no DB round-trip needed
  return buildTokenPair({
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  });
}

