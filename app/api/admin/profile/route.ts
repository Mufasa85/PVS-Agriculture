import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getFreshAdminSession } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, profileUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export const GET = withApiError(async (request: Request) => {
  const session = await getFreshAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastLoginAt: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable." },
      { status: 404 },
    );
  }

  return NextResponse.json({ user });
});

export const PUT = withApiError(async (request: Request) => {
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

  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { name: parsed.data.name.trim() },
    select: { id: true, name: true, email: true, role: true },
  });

  await logAudit({
    userId: session.userId,
    action: "PROFILE_UPDATE",
    entityType: "User",
    entityId: user.id,
    metadata: { name: user.name },
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ user });
});
