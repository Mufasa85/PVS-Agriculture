import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/products";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { revalidatePublicCatalog } from "@/lib/revalidate-catalog";
import { categoryInputSchema, firstIssueMessage } from "@/lib/validation";

export const runtime = "nodejs";

async function generateUniqueSlug(
  name: string,
  desired: string | null,
): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "categorie";
  let suffix = 2;
  while (await prisma.category.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

export const GET = withApiError(async () => {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const counts = await prisma.product.groupBy({
    by: ["category"],
    where: { deletedAt: null },
    _count: true,
  });
  const countMap: Record<string, number> = {};
  for (const c of counts) {
    countMap[c.category] = c._count;
  }

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    productCount: countMap[cat.slug] ?? 0,
  }));

  return NextResponse.json({ categories: categoriesWithCounts });
});

export const POST = withApiError(async (request: Request) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = categoryInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 422 },
    );
  }

  const body = parsed.data;
  const slug = await generateUniqueSlug(body.name.trim(), body.slug ?? null);

  const category = await prisma.category.create({
    data: {
      name: body.name.trim(),
      slug,
      icon: body.icon.trim(),
      description: body.description?.trim() || null,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
    },
  });

  const session = await getSessionFromRequest(request);
  await logAudit({
    userId: session?.userId ?? null,
    action: "CATEGORY_CREATE",
    entityType: "Category",
    entityId: category.id,
    metadata: { name: category.name, slug: category.slug },
    ipAddress: getClientIp(request),
  });

  revalidatePublicCatalog();

  return NextResponse.json({ category }, { status: 201 });
});
