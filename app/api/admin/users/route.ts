import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { hashPassword, ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const ALL_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

type UserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

function validateInput(body: Partial<UserInput>, requirePassword: boolean): string | null {
  if (!body.name || !body.name.trim()) return "Le nom est requis.";
  if (!body.email || !body.email.trim()) return "L'email est requis.";
  if (!body.role || !ALL_ROLES.includes(body.role)) return "Rôle invalide.";
  if (requirePassword && (!body.password || body.password.length < 8)) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  return null;
}

export async function GET() {
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
}

export async function POST(request: Request) {
  let body: Partial<UserInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const error = validateInput(body, true);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const email = body.email!.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà." }, { status: 409 });
  }

  const passwordHash = await hashPassword(body.password!);

  const user = await prisma.user.create({
    data: {
      name: body.name!.trim(),
      email,
      passwordHash,
      role: body.role!,
    },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  const token = request.headers.get("cookie")?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  const session = await verifyAdminSessionToken(token);

  await logAudit({
    userId: session?.userId ?? null,
    action: "USER_CREATE",
    entityType: "User",
    entityId: user.id,
    metadata: { name: user.name, email: user.email, role: user.role },
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ user }, { status: 201 });
}
