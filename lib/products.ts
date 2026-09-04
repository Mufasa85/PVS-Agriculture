import type { Currency } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CategoryInfo = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export async function getAllCategories(): Promise<CategoryInfo[]> {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getActiveCategories(): Promise<CategoryInfo[]> {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getCategoryLabels(): Promise<Record<string, string>> {
  const categories = await prisma.category.findMany();
  const map: Record<string, string> = {};
  for (const cat of categories) {
    map[cat.slug] = cat.name;
  }
  return map;
}

export async function getCategorySlugs(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return categories.map((c) => c.slug);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);
  return currency === "USD" ? `${formattedAmount} $` : `${formattedAmount} FC`;
}

export function formatProductPrice(product: {
  comingSoon: boolean;
  priceAmount: { toString(): string } | null;
  currency: Currency;
}): string {
  if (product.comingSoon || product.priceAmount === null) {
    return "Bientôt disponible";
  }
  return formatCurrency(Number(product.priceAmount), product.currency);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
