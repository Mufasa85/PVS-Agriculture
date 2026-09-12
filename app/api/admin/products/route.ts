import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCategorySlugs, slugify } from "@/lib/products";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { firstIssueMessage, productInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function generateUniqueSlug(
  name: string,
  desired: string | null,
): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "produit";
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

export const GET = withApiError(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get("page");
  const perPageParam = searchParams.get("perPage");

  // Corbeille : ?trash=1 renvoie les produits supprimés (soft delete)
  if (searchParams.get("trash") === "1") {
    const products = await prisma.product.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    return NextResponse.json({ products });
  }

  // Pagination opt-in : sans ?page, la réponse renvoie tout (rétrocompatible).
  if (pageParam || perPageParam) {
    const page = Math.max(1, Number(pageParam || "1"));
    const perPage = Math.min(100, Math.max(1, Number(perPageParam || "25")));
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
        include: { images: { orderBy: { sortOrder: "asc" } } },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where: { deletedAt: null } }),
    ]);
    return NextResponse.json({
      products,
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    });
  }

  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ products });
});

export const POST = withApiError(async (request: Request) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = productInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const body = parsed.data;
  const validSlugs = await getCategorySlugs();
  if (!validSlugs.includes(body.category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 422 });
  }

  const slug = await generateUniqueSlug(body.name.trim(), body.slug ?? null);
  const images = body.images.filter((img) => img.url?.trim());

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      category: body.category,
      priceAmount: body.comingSoon ? null : body.priceAmount,
      currency: body.currency,
      unit: body.unit?.trim() || null,
      note: body.note?.trim() || null,
      badge: body.badge?.trim() || null,
      imageSrc: body.imageSrc.trim(),
      imageAlt: body.imageAlt.trim(),
      comingSoon: body.comingSoon,
      onDemand: body.onDemand,
      isPublished: body.isPublished,
      sortOrder: body.sortOrder,
      images: {
        create: images.map((img, index) => ({
          url: img.url.trim(),
          alt: img.alt?.trim() || body.imageAlt.trim(),
          sortOrder: index,
        })),
      },
    },
    include: { images: true },
  });

  const session = await getSessionFromRequest(request);
  await logAudit({
    userId: session?.userId ?? null,
    action: "PRODUCT_CREATE",
    entityType: "Product",
    entityId: product.id,
    metadata: { name: product.name, slug: product.slug },
    ipAddress: getClientIp(request),
  });

  return NextResponse.json({ product }, { status: 201 });
});
