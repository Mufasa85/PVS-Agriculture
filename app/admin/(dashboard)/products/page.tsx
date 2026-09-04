import ProductsTable from "@/components/admin/ProductsTable";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
    getAllCategories(),
  ]);

  const grouped = categories.map((cat) => ({
    category: cat,
    items: products.filter((p) => p.category === cat.slug),
  }));

  return (
    <ProductsTable
      grouped={grouped}
      totalCount={products.length}
      categories={categories}
    />
  );
}
