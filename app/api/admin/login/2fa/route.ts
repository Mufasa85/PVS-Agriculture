import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyPending2faToken,
} from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { firstIssueMessage, login2faSchema } from "@/lib/validation";
import { verifyTotp } from "@/lib/totp";

export const runtime = "nodejs";

export const POST = withApiError(async (request: Request) => {
  const ip = getClientIp(request) ?? "unknown";
  const { success, retryAfter } = rateLimit(
    `admin-login-2fa:${ip}`,
    10,
    5 * 60 * 1000,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = login2faSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const userId = await verifyPending2faToken(parsed.data.pendingToken);
  if (!userId) {
    return NextResponse.json(
      { error: "Session expirée. Reconnectez-vous." },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (
    !user ||
    !user.isActive ||
    !user.twoFactorEnabled ||
    !user.twoFactorSecret
  ) {
    return NextResponse.json(
      { error: "Compte introuvable ou 2FA non configurée." },
      { status: 401 },
    );
  }

  if (!(await verifyTotp(user.twoFactorSecret, parsed.data.code))) {
    return NextResponse.json(
      { error: "Code invalide. Vérifiez votre application." },
      { status: 401 },
    );
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
    metadata: { twoFactor: true },
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
