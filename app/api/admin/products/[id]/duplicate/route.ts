import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { revalidatePublicCatalog } from "@/lib/revalidate-catalog";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

async function generateCopySlug(base: string): Promise<string> {
  let candidate = `${base}-copie`;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-copie-${suffix++}`;
  }
  return candidate;
}

export const POST = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const { id } = await params;
    const productId = Number(id);

    const source = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!source || source.deletedAt) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 },
      );
    }

    const slug = await generateCopySlug(source.slug);

    const copy = await prisma.product.create({
      data: {
        name: `${source.name} (copie)`,
        slug,
        description: source.description,
        category: source.category,
        priceAmount: source.priceAmount,
        currency: source.currency,
        unit: source.unit,
        note: source.note,
        badge: source.badge,
        imageSrc: source.imageSrc,
        imageAlt: source.imageAlt,
        comingSoon: source.comingSoon,
        onDemand: source.onDemand,
        isPublished: false,
        sortOrder: source.sortOrder + 1,
        images: {
          create: source.images.map((img) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
          })),
        },
      },
    });

    const session = await getSessionFromRequest(request);
    await logAudit({
      userId: session?.userId ?? null,
      action: "PRODUCT_DUPLICATE",
      entityType: "Product",
      entityId: copy.id,
      metadata: { sourceId: productId, name: copy.name },
      ipAddress: getClientIp(request),
    });

    revalidatePublicCatalog();

    return NextResponse.json({ product: copy }, { status: 201 });
  },
);
