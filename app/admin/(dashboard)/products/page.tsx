import ProductsTable from "@/components/admin/ProductsTable";
import { prisma } from "@/lib/prisma";
import { getAllCategories, serializeProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: openNew } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
    getAllCategories(),
  ]);

  const serialized = products.map(serializeProduct);
  const grouped = categories.map((cat) => ({
    category: cat,
    items: serialized.filter((p) => p.category === cat.slug),
  }));

  return (
    <ProductsTable
      grouped={grouped}
      totalCount={products.length}
      categories={categories}
      openCreateOnMount={openNew === "1"}
    />
  );
}
