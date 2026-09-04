import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const INITIAL_CATEGORIES = [
  { name: "Œufs", slug: "oeufs", icon: "egg", sortOrder: 1 },
  { name: "Poulets", slug: "poulets", icon: "cattle", sortOrder: 2 },
  { name: "Porc", slug: "porc", icon: "pig", sortOrder: 3 },
  { name: "Poissons", slug: "poissons", icon: "fish", sortOrder: 4 },
  { name: "Agriculture", slug: "agriculture", icon: "sprout", sortOrder: 5 },
  { name: "Produits pour animaux", slug: "produits_animaux", icon: "feedbag", sortOrder: 6 },
  { name: "Bovins", slug: "bovins", icon: "cattle", sortOrder: 7 },
  { name: "Caprins", slug: "caprins", icon: "cattle", sortOrder: 8 },
];

async function main() {
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  console.log(`Seeded ${INITIAL_CATEGORIES.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
