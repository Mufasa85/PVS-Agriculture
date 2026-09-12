import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCategorySlugs, slugify } from "@/lib/products";
import { getSessionFromRequest } from "@/lib/auth";
import { getClientIp, logAudit } from "@/lib/audit";
import { withApiError } from "@/lib/api";
import { deleteLocalUploads } from "@/lib/uploads";
import { firstIssueMessage, productInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function generateUniqueSlug(
  name: string,
  desired: string | null,
  excludeId: number,
): Promise<string> {
  const base = slugify(desired?.trim() || name);
  let candidate = base || "produit";
  let suffix = 2;
  while (true) {
    const existing = await prisma.product.findUnique({
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
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    if (!product || product.deletedAt) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
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
      return NextResponse.json(
        { error: "Catégorie invalide." },
        { status: 422 },
      );
    }

    const productId = Number(id);
    const slug = await generateUniqueSlug(
      body.name.trim(),
      body.slug ?? null,
      productId,
    );
    const images = body.images.filter((img) => img.url?.trim());

    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!oldProduct || oldProduct.deletedAt) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 },
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId } });
      return tx.product.update({
        where: { id: productId },
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
    });

    // Nettoie les fichiers locaux devenus orphelins (image principale
    // remplacée ou images retirées de la galerie).
    const newImageUrls = new Set(images.map((img) => img.url.trim()));
    await deleteLocalUploads([
      oldProduct.imageSrc !== product.imageSrc ? oldProduct.imageSrc : null,
      ...oldProduct.images
        .map((img) => img.url)
        .filter((url) => !newImageUrls.has(url)),
    ]);

    const session = await getSessionFromRequest(request);
    await logAudit({
      userId: session?.userId ?? null,
      action: "PRODUCT_UPDATE",
      entityType: "Product",
      entityId: product.id,
      metadata: { name: product.name, slug: product.slug },
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ product });
  },
);

export const DELETE = withApiError(
  async (request: Request, { params }: RouteParams) => {
    const { id } = await params;
    const productId = Number(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product || product.deletedAt) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 },
      );
    }

    try {
      await prisma.product.update({
        where: { id: productId },
        data: { deletedAt: new Date() },
      });
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

    // Supprime les fichiers locaux associés au produit
    await deleteLocalUploads([
      product.imageSrc,
      ...product.images.map((img) => img.url),
    ]);

    const session = await getSessionFromRequest(request);
    await logAudit({
      userId: session?.userId ?? null,
      action: "PRODUCT_DELETE",
      entityType: "Product",
      entityId: productId,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ success: true });
  },
);
