import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { csvResponse, toCsv } from "@/lib/csv";
import { withApiError } from "@/lib/api";

export const runtime = "nodejs";

type ExportType = "products" | "messages" | "analytics";

export const GET = withApiError(async (request: Request) => {
  const type = new URL(request.url).searchParams.get("type") as ExportType;
  const stamp = new Date().toISOString().split("T")[0];

  switch (type) {
    case "products": {
      const products = await prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      });
      const csv = toCsv(
        [
          "ID",
          "Nom",
          "Slug",
          "Catégorie",
          "Prix",
          "Devise",
          "Unité",
          "Publié",
          "À venir",
          "Sur demande",
          "Créé le",
        ],
        products.map((p) => [
          p.id,
          p.name,
          p.slug,
          p.category,
          p.priceAmount,
          p.currency,
          p.unit,
          p.isPublished ? "oui" : "non",
          p.comingSoon ? "oui" : "non",
          p.onDemand ? "oui" : "non",
          p.createdAt,
        ]),
      );
      return csvResponse(csv, `produits-${stamp}.csv`);
    }

    case "messages": {
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      const csv = toCsv(
        ["ID", "Nom", "Téléphone", "Email", "Sujet", "Message", "Lu", "Date"],
        messages.map((m) => [
          m.id,
          m.nom,
          m.telephone,
          m.email,
          m.sujet,
          m.message,
          m.isRead ? "oui" : "non",
          m.createdAt,
        ]),
      );
      return csvResponse(csv, `messages-${stamp}.csv`);
    }

    case "analytics": {
      const events = await prisma.analyticsEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 50000,
      });
      const csv = toCsv(
        ["ID", "Type", "Chemin", "Référent", "User-Agent", "Date"],
        events.map((e) => [
          e.id,
          e.type,
          e.path,
          e.referrer,
          e.userAgent,
          e.createdAt,
        ]),
      );
      return csvResponse(csv, `analytics-${stamp}.csv`);
    }

    default:
      return NextResponse.json(
        { error: "Type d'export invalide (products|messages|analytics)." },
        { status: 422 },
      );
  }
});
