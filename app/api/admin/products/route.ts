import { NextResponse } from "next/server";
import type { Currency } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCategorySlugs, slugify } from "@/lib/products";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";

export const runtime = "nodejs";

type ProductImageInput = {
  url: string;
  alt: string;
};

type ProductInput = {
  name: string;
  slug: string | null;
  description: string;
  category: string;
  priceAmount: number | null;
  currency: Currency;
  unit: string | null;
  note: string | null;
  badge: string | null;
  imageSrc: string;
  imageAlt: string;
  images: ProductImageInput[];
  comingSoon: boolean;
  onDemand: boolean;
  isPublished: boolean;
  sortOrder: number;
};

async function generateUniqueSlug(name: string, desired: string | null): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "produit";
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

function getSessionFromRequest(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  return verifyAdminSessionToken(token);
}

async function validateInput(body: Partial<ProductInput>): Promise<string | null> {
  if (!body.name || !body.name.trim()) return "Le nom est requis.";
  if (!body.description || !body.description.trim())
    return "La description est requise.";
  const validSlugs = await getCategorySlugs();
  if (!body.category || !validSlugs.includes(body.category))
    return "Catégorie invalide.";
  if (!body.imageSrc || !body.imageSrc.trim())
    return "L'URL de l'image est requise.";
  if (!body.imageAlt || !body.imageAlt.trim())
    return "Le texte alternatif de l'image est requis.";
  if (!body.comingSoon && (body.priceAmount === null || body.priceAmount === undefined))
    return "Le prix est requis sauf si le produit est marqué « à venir ».";
  return null;
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  let body: Partial<ProductInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const error = await validateInput(body);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const slug = await generateUniqueSlug(body.name!.trim(), body.slug ?? null);
  const images = (body.images ?? []).filter((img) => img.url?.trim());

  const product = await prisma.product.create({
    data: {
      name: body.name!.trim(),
      slug,
      description: body.description!.trim(),
      category: body.category!,
      priceAmount: body.comingSoon ? null : body.priceAmount,
      currency: body.currency ?? "FC",
      unit: body.unit?.trim() || null,
      note: body.note?.trim() || null,
      badge: body.badge?.trim() || null,
      imageSrc: body.imageSrc!.trim(),
      imageAlt: body.imageAlt!.trim(),
      comingSoon: body.comingSoon ?? false,
      onDemand: body.onDemand ?? false,
      isPublished: body.isPublished ?? true,
      sortOrder: body.sortOrder ?? 0,
      images: {
        create: images.map((img, index) => ({
          url: img.url.trim(),
          alt: img.alt?.trim() || body.imageAlt!.trim(),
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
}
