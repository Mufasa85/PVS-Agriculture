import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

function getSessionFromRequest(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  return verifyAdminSessionToken(token);
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "";
  const entityType = searchParams.get("entityType") || "";
  const userId = searchParams.get("userId") || "";
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = Math.min(100, Math.max(1, Number(searchParams.get("perPage") || "25")));

  const where: Record<string, unknown> = {};

  if (action) where.action = action;
  if (entityType) where.entityType = entityType;
  if (userId) where.userId = Number(userId);
  if (search.trim()) {
    where.OR = [
      { action: { contains: search } },
      { entityType: { contains: search } },
      { entityId: { contains: search } },
      { ipAddress: { contains: search } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const actionTypes = await prisma.auditLog.findMany({
    distinct: ["action"],
    select: { action: true },
    orderBy: { action: "asc" },
  });

  const entityTypes = await prisma.auditLog.findMany({
    distinct: ["entityType"],
    select: { entityType: true },
    orderBy: { entityType: "asc" },
  });

  return NextResponse.json({
    logs,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    actionTypes: actionTypes.map((a) => a.action),
    entityTypes: entityTypes.map((e) => e.entityType),
  });
}
