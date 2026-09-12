import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { hashPassword, getFreshAdminSession } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, userUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

function prismaErrorCode(error: unknown): string | null {
  return error instanceof Prisma.PrismaClientKnownRequestError
    ? error.code
    : null;
}

type RouteParams = { params: Promise<{ id: string }> };

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

export const GET = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const session = await requireSuperAdmin(request);
    if (session instanceof NextResponse) return session;

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
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

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  },
);

export const PUT = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const session = await requireSuperAdmin(request);
    if (session instanceof NextResponse) return session;

    const { id } = await params;
    const userId = Number(id);

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const parsed = userUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: firstIssueMessage(parsed.error) },
        { status: 422 },
      );
    }

    const body = parsed.data;

    if (session.userId === userId && body.role !== "SUPER_ADMIN") {
      const self = await prisma.user.findUnique({ where: { id: userId } });
      if (self?.role === "SUPER_ADMIN") {
        const otherSuperAdmins = await prisma.user.count({
          where: { role: "SUPER_ADMIN", id: { not: userId } },
        });
        if (otherSuperAdmins === 0) {
          return NextResponse.json(
            {
              error:
                "Impossible de rétrograder le dernier super administrateur.",
            },
            { status: 422 },
          );
        }
      }
    }

    const email = body.email.trim().toLowerCase();

    try {
      const data: {
        name: string;
        email: string;
        role: UserRole;
        isActive: boolean;
        passwordHash?: string;
      } = {
        name: body.name.trim(),
        email,
        role: body.role,
        isActive: body.isActive,
      };

      if (body.password) {
        data.passwordHash = await hashPassword(body.password);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data,
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
        userId: session.userId,
        action: "USER_UPDATE",
        entityType: "User",
        entityId: user.id,
        metadata: {
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
        ipAddress: getClientIp(request),
      });

      return NextResponse.json({ user });
    } catch (error) {
      const code = prismaErrorCode(error);
      if (code === "P2002") {
        return NextResponse.json(
          { error: "Un utilisateur avec cet email existe déjà." },
          { status: 409 },
        );
      }
      if (code === "P2025") {
        return NextResponse.json(
          { error: "Utilisateur introuvable." },
          { status: 404 },
        );
      }
      throw error;
    }
  },
);

export const DELETE = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const session = await requireSuperAdmin(request);
    if (session instanceof NextResponse) return session;

    const { id } = await params;
    const userId = Number(id);

    if (session.userId === userId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte." },
        { status: 422 },
      );
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
    } catch (error) {
      if (prismaErrorCode(error) === "P2025") {
        return NextResponse.json(
          { error: "Utilisateur introuvable." },
          { status: 404 },
        );
      }
      throw error;
    }

    await logAudit({
      userId: session.userId,
      action: "USER_DELETE",
      entityType: "User",
      entityId: userId,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ success: true });
  },
);
