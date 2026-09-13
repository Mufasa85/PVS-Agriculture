import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { withApiError } from "@/lib/api";

export const runtime = "nodejs";

export const GET = withApiError(async (request: Request) => {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ products: [], messages: [], users: [] });
  }

  const [products, messages, users] = await Promise.all([
    prisma.product.findMany({
      where: {
        deletedAt: null,
        OR: [{ name: { contains: q } }, { slug: { contains: q } }],
      },
      select: { id: true, name: true, category: true },
      take: 5,
      orderBy: { name: "asc" },
    }),
    prisma.contactMessage.findMany({
      where: {
        OR: [
          { nom: { contains: q } },
          { email: { contains: q } },
          { sujet: { contains: q } },
          { message: { contains: q } },
        ],
      },
      select: {
        id: true,
        nom: true,
        email: true,
        sujet: true,
        isRead: true,
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: {
        OR: [{ name: { contains: q } }, { email: { contains: q } }],
      },
      select: { id: true, name: true, email: true, role: true },
      take: 5,
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({ products, messages, users });
});
