import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPasswordResetToken } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, resetPasswordSchema } from "@/lib/validation";

export const runtime = "nodejs";

export const POST = withApiError(async (request: Request) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const payload = await verifyPasswordResetToken(parsed.data.token);
  if (!payload) {
    return NextResponse.json(
      { error: "Lien de réinitialisation expiré. Recommencez." },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: "Compte introuvable ou désactivé." },
      { status: 404 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });

  await logAudit({
    userId: user.id,
    action: "PASSWORD_RESET",
    entityType: "User",
    entityId: user.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ success: true });
});
