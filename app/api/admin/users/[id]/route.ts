import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, hashPassword, verifyAdminSessionToken } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const ALL_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

type UserUpdateInput = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
};

function validateInput(body: Partial<UserUpdateInput>): string | null {
  if (!body.name || !body.name.trim()) return "Le nom est requis.";
  if (!body.email || !body.email.trim()) return "L'email est requis.";
  if (!body.role || !ALL_ROLES.includes(body.role)) return "Rôle invalide.";
  if (body.password && body.password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  return null;
}

function getSessionFromRequest(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  return verifyAdminSessionToken(token);
}

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);

  let body: Partial<UserUpdateInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const error = validateInput(body);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const session = await getSessionFromRequest(request);

  if (session?.userId === userId && body.role !== "SUPER_ADMIN") {
    const self = await prisma.user.findUnique({ where: { id: userId } });
    if (self?.role === "SUPER_ADMIN") {
      const otherSuperAdmins = await prisma.user.count({
        where: { role: "SUPER_ADMIN", id: { not: userId } },
      });
      if (otherSuperAdmins === 0) {
        return NextResponse.json(
          { error: "Impossible de rétrograder le dernier super administrateur." },
          { status: 422 },
        );
      }
    }
  }

  const email = body.email!.trim().toLowerCase();

  try {
    const data: {
      name: string;
      email: string;
      role: UserRole;
      isActive: boolean;
      passwordHash?: string;
    } = {
      name: body.name!.trim(),
      email,
      role: body.role!,
      isActive: body.isActive ?? true,
    };

    if (body.password) {
      data.passwordHash = await hashPassword(body.password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });

    await logAudit({
      userId: session?.userId ?? null,
      action: "USER_UPDATE",
      entityType: "User",
      entityId: user.id,
      metadata: { name: user.name, email: user.email, role: user.role, isActive: user.isActive },
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Utilisateur introuvable ou email déjà utilisé." }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);

  const session = await getSessionFromRequest(request);

  if (session?.userId === userId) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 422 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (target?.role === "SUPER_ADMIN") {
    const otherSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", id: { not: userId } },
    });
    if (otherSuperAdmins === 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer le dernier super administrateur." },
        { status: 422 },
      );
    }
  }

  try {
    await prisma.user.delete({ where: { id: userId } });

    await logAudit({
      userId: session?.userId ?? null,
      action: "USER_DELETE",
      entityType: "User",
      entityId: userId,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }
}
