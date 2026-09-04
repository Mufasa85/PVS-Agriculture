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

async function generateUniqueSlug(name: string, desired: string | null): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "categorie";
  let suffix = 2;
  while (await prisma.category.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

export async function GET() {
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
}

export async function POST(request: Request) {
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

  const slug = await generateUniqueSlug(body.name!.trim(), body.slug ?? null);

  const category = await prisma.category.create({
    data: {
      name: body.name!.trim(),
      slug,
      icon: body.icon!.trim(),
      description: body.description?.trim() || null,
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive ?? true,
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

  return NextResponse.json({ category }, { status: 201 });
}
