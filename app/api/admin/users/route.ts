import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword, getFreshAdminSession } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, userCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function requireSuperAdmin(request: Request) {
  const session = await getFreshAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Accès réservé aux super administrateurs." },
      { status: 403 },
    );
  }
  return session;
}

export const GET = withApiError(async (request: Request) => {
  const session = await requireSuperAdmin(request);
  if (session instanceof NextResponse) return session;

  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ users });
});

export const POST = withApiError(async (request: Request) => {
  const session = await requireSuperAdmin(request);
  if (session instanceof NextResponse) return session;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = userCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const body = parsed.data;
  const email = body.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Un utilisateur avec cet email existe déjà." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(body.password);

  const user = await prisma.user.create({
    data: {
      name: body.name.trim(),
      email,
      passwordHash,
      role: body.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  await logAudit({
    userId: session?.userId ?? null,
    action: "USER_CREATE",
    entityType: "User",
    entityId: user.id,
    metadata: { name: user.name, email: user.email, role: user.role },
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ user }, { status: 201 });
});
