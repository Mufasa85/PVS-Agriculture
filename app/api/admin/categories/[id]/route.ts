import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/products";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";

export const runtime = "nodejs";

type CategoryInput = {
  name: string;
  slug: string | null;
  icon: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

function getSessionFromRequest(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  return verifyAdminSessionToken(token);
}

function validateInput(body: Partial<CategoryInput>): string | null {
  if (!body.name || !body.name.trim()) return "Le nom est requis.";
  if (!body.icon || !body.icon.trim()) return "L'icône est requise.";
  return null;
}

async function generateUniqueSlug(
  name: string,
  desired: string | null,
  excludeId: number,
): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "categorie";
  let suffix = 2;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) break;
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }

  const productCount = await prisma.product.count({
    where: { category: category.slug, deletedAt: null },
  });

  return NextResponse.json({ category, productCount });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  let body: Partial<CategoryInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const error = validateInput(body);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const categoryId = Number(id);
  const slug = await generateUniqueSlug(body.name!.trim(), body.slug ?? null, categoryId);

  try {
    const oldCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!oldCategory) {
      return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: body.name!.trim(),
        slug,
        icon: body.icon!.trim(),
        description: body.description?.trim() || null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
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

    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const categoryId = Number(id);

  try {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
    }

    const productCount = await prisma.product.count({
      where: { category: category.slug, deletedAt: null },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer : ${productCount} produit(s) utilisent cette catégorie.` },
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }
}
