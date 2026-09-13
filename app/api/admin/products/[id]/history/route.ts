import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { withApiError } from "@/lib/api";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export const GET = withApiError(
  async (_request: Request, { params }: RouteParams) => {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isFinite(productId)) {
      return NextResponse.json(
        { error: "Identifiant invalide." },
        { status: 422 },
      );
    }

    const logs = await prisma.auditLog.findMany({
      where: { entityType: "Product", entityId: String(productId) },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log.id,
        action: log.action,
        userName: log.user?.name ?? "Système",
        userEmail: log.user?.email ?? null,
        metadata: log.metadata,
        createdAt: log.createdAt.toISOString(),
      })),
    });
  },
);
