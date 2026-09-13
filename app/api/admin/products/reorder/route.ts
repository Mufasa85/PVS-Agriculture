import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { revalidatePublicCatalog } from "@/lib/revalidate-catalog";
import { firstIssueMessage, reorderSchema } from "@/lib/validation";

export const runtime = "nodejs";

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

  const parsed = reorderSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  await logAudit({
    userId: session.userId,
    action: "PRODUCT_REORDER",
    entityType: "Product",
    metadata: { order: parsed.data.ids },
    ipAddress: getClientIp(request),
  });

  revalidatePublicCatalog();

  return NextResponse.json({ success: true });
});
