import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getFreshAdminSession } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, totpVerifySchema } from "@/lib/validation";
import { verifyTotp } from "@/lib/totp";

export const runtime = "nodejs";

// Désactivation exige un code TOTP valide — évite qu'une session volée
// puisse retirer la protection.
export const POST = withApiError(async (request: Request) => {
  const session = await getFreshAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = totpVerifySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return NextResponse.json(
      { error: "La double authentification n'est pas activée." },
      { status: 422 },
    );
  }

  if (!(await verifyTotp(user.twoFactorSecret, parsed.data.code))) {
    return NextResponse.json(
      { error: "Code invalide. Vérifiez votre application." },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  await logAudit({
    userId: session.userId,
    action: "2FA_DISABLE",
    entityType: "User",
    entityId: user.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ success: true });
});
