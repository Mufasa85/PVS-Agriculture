import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getFreshAdminSession, hashPassword } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, passwordChangeSchema } from "@/lib/validation";

export const runtime = "nodejs";

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

  const parsed = passwordChangeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable." },
      { status: 404 },
    );
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!valid) {
    return NextResponse.json(
      { error: "Le mot de passe actuel est incorrect." },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });

  await logAudit({
    userId: session.userId,
    action: "PASSWORD_CHANGE",
    entityType: "User",
    entityId: user.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ success: true });
});
