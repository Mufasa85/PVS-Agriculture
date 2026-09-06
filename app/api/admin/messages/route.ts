import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";

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
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";

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

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = await prisma.contactMessage.count({ where: { isRead: false } });

  return NextResponse.json({ messages, unreadCount });
}

export async function PATCH(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: { id?: number; isRead?: boolean; isStarred?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "ID requis." }, { status: 422 });
  }

  const data: Record<string, boolean> = {};
  if (typeof body.isRead === "boolean") data.isRead = body.isRead;
  if (typeof body.isStarred === "boolean") data.isStarred = body.isStarred;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucune donnée à mettre à jour." }, { status: 422 });
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
  } catch {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }
}

export async function DELETE(request: Request) {
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
  } catch {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }
}
