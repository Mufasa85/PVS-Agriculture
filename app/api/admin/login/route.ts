import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  createPending2faToken,
  verifyAdminCredentials,
} from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { withApiError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// 5 tentatives par IP toutes les 5 minutes
const LOGIN_RATE_LIMIT = 5;
const LOGIN_WINDOW_MS = 5 * 60 * 1000;

export const POST = withApiError(async (request: Request) => {
  const ip = getClientIp(request) ?? "unknown";
  const { success, retryAfter } = rateLimit(
    `admin-login:${ip}`,
    LOGIN_RATE_LIMIT,
    LOGIN_WINDOW_MS,
  );

  if (!success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis." },
      { status: 422 },
    );
  }

  const user = await verifyAdminCredentials(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 },
    );
  }

  // 2FA activée : le mot de passe est bon mais il faut le code TOTP.
  // On renvoie un token temporaire (5 min) au lieu de la session.
  if (user.twoFactorEnabled) {
    const pendingToken = await createPending2faToken(user.id);
    return NextResponse.json({ requires2fa: true, pendingToken });
  }

  const token = await createAdminSessionToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await logAudit({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
    ipAddress: getClientIp(request),
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
});
