import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, messagePatchSchema } from "@/lib/validation";

export const runtime = "nodejs";

function isNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export const GET = withApiError(async (request: Request) => {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = Math.min(
    50,
    Math.max(1, Number(searchParams.get("perPage") || "20")),
  );

  const where: Record<string, unknown> = {};

  if (filter === "unread") where.isRead = false;
  if (filter === "starred") where.isStarred = true;

  if (search.trim()) {
    where.OR = [
      { nom: { contains: search } },
      { email: { contains: search } },
      { telephone: { contains: search } },
      { sujet: { contains: search } },
      { message: { contains: search } },
    ];
  }

  const [messages, total, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return NextResponse.json({
    messages,
    unreadCount,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  });
});

export const PATCH = withApiError(async (request: Request) => {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = messagePatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const body = parsed.data;

  const data: Record<string, boolean> = {};
  if (typeof body.isRead === "boolean") data.isRead = body.isRead;
  if (typeof body.isStarred === "boolean") data.isStarred = body.isStarred;

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Aucune donnée à mettre à jour." },
      { status: 422 },
    );
  }

  try {
    const message = await prisma.contactMessage.update({
      where: { id: body.id },
      data,
    });

    await logAudit({
      userId: session.userId,
      action: "MESSAGE_UPDATE",
      entityType: "ContactMessage",
      entityId: String(message.id),
      metadata: data,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ message });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 },
      );
    }
    throw error;
  }
});

export const DELETE = withApiError(async (request: Request) => {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID requis." }, { status: 422 });
  }

  try {
    await prisma.contactMessage.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      action: "MESSAGE_DELETE",
      entityType: "ContactMessage",
      entityId: String(id),
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 },
      );
    }
    throw error;
  }
});
