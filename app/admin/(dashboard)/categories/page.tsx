import CategoriesTable from "@/components/admin/CategoriesTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, productCounts] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.product.groupBy({
      by: ["category"],
      where: { deletedAt: null },
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of productCounts) {
    countMap[c.category] = c._count;
  }

  return (
    <CategoriesTable categories={categories} countMap={countMap} />
  );
}
