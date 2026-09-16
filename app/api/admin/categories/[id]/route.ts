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
  excludeId: number,
): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "categorie";
  let suffix = 2;
  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug: candidate },
    });
    if (!existing || existing.id === excludeId) break;
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

type RouteParams = { params: Promise<{ id: string }> };

export const GET = withApiError(
  async (_request: Request, { params }: RouteParams) => {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie introuvable." },
        { status: 404 },
      );
    }

    const productCount = await prisma.product.count({
      where: { category: category.slug, deletedAt: null },
    });

    return NextResponse.json({ category, productCount });
  },
);

export const PUT = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const { id } = await params;
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
    const categoryId = Number(id);
    const slug = await generateUniqueSlug(
      body.name.trim(),
      body.slug ?? null,
      categoryId,
    );

    const oldCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!oldCategory) {
      return NextResponse.json(
        { error: "Catégorie introuvable." },
        { status: 404 },
      );
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: body.name.trim(),
        slug,
        icon: body.icon.trim(),
        description: body.description?.trim() || null,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });

    if (slug !== oldCategory.slug) {
      await prisma.product.updateMany({
        where: { category: oldCategory.slug },
        data: { category: slug },
      });
    }

    const session = await getSessionFromRequest(request);
    await logAudit({
      userId: session?.userId ?? null,
      action: "CATEGORY_UPDATE",
      entityType: "Category",
      entityId: category.id,
      metadata: { name: category.name, slug: category.slug },
      ipAddress: getClientIp(request),
    });

    revalidatePublicCatalog();

    return NextResponse.json({ category });
  },
);

export const DELETE = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const { id } = await params;
    const categoryId = Number(id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Catégorie introuvable." },
        { status: 404 },
      );
    }

    const productCount = await prisma.product.count({
      where: { category: category.slug, deletedAt: null },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer : ${productCount} produit(s) utilisent cette catégorie.`,
        },
        { status: 422 },
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });

    const session = await getSessionFromRequest(request);
    await logAudit({
      userId: session?.userId ?? null,
      action: "CATEGORY_DELETE",
      entityType: "Category",
      entityId: categoryId,
      metadata: { name: category.name, slug: category.slug },
      ipAddress: getClientIp(request),
    });

    revalidatePublicCatalog();

    return NextResponse.json({ success: true });
  },
);
