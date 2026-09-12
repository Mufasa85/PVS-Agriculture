import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";

export const runtime = "nodejs";

export const POST = withApiError(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { id } = await params;
    const productId = Number(id);

    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { deletedAt: null },
      });

      await logAudit({
        userId: session.userId,
        action: "PRODUCT_RESTORE",
        entityType: "Product",
        entityId: product.id,
        metadata: { name: product.name, slug: product.slug },
        ipAddress: getClientIp(request),
      });

      return NextResponse.json({ product });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return NextResponse.json(
          { error: "Produit introuvable." },
          { status: 404 },
        );
      }
      throw error;
    }
  },
);
