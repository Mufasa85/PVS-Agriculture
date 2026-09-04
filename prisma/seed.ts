import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedInitialSuperAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "⚠️  ADMIN_EMAIL / ADMIN_PASSWORD non définis : aucun super administrateur créé.",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: email.trim().toLowerCase() },
    update: {},
    create: {
      name: "Super Administrateur",
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super administrateur initial vérifié/créé.");
}

async function main() {
  await seedInitialSuperAdmin();

  await prisma.product.deleteMany();

  const rawProducts = [
      // ── Œufs ──
      {
        name: "Œufs (plateau)",
        description: "Œufs frais vendus par plateau, issus de nos poules pondeuses.",
        category: "oeufs",
        priceAmount: 13000,
        currency: "FC",
        unit: "/ plateau",
        note: "12 500 FC le plateau à partir de 100 plateaux",
        imageSrc:
          "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Plateau d'œufs frais",
        sortOrder: 1,
      },

      // ── Poulets ──
      {
        name: "Poulet — Poids 12",
        description: "Poulet fermier, calibre poids 12, élevé en plein air.",
        category: "poulets",
        priceAmount: 13000,
        currency: "FC",
        unit: "/ pièce",
        imageSrc:
          "https://images.unsplash.com/photo-1516467508483-a7212febe7da?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Poulet fermier",
        sortOrder: 1,
      },
      {
        name: "Poulet — Poids 13",
        description: "Poulet fermier, calibre poids 13, élevé en plein air.",
        category: "poulets",
        priceAmount: 13500,
        currency: "FC",
        unit: "/ pièce",
        imageSrc:
          "https://images.unsplash.com/photo-1516467508483-a7212febe7da?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Poulet fermier",
        sortOrder: 2,
      },

      // ── Porc ──
      {
        name: "Porc",
        description: "Porc élevé dans des conditions d'hygiène strictes, chair de qualité.",
        category: "porc",
        priceAmount: 17000,
        currency: "FC",
        unit: "/ kg",
        badge: "Best-seller",
        imageSrc:
          "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Porc élevé en enclos propre",
        sortOrder: 1,
      },

      // ── Poissons ──
      {
        name: "Tilapia",
        description: "Tilapia élevé en étang contrôlé, pêché du jour.",
        category: "poissons",
        priceAmount: 8,
        currency: "USD",
        unit: "/ kg",
        badge: "Best-seller",
        imageSrc:
          "https://images.unsplash.com/photo-1535473895227-bdecb20fb373?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Tilapia frais",
        sortOrder: 1,
      },
      {
        name: "Ngolo",
        description: "Ngolo (poisson-chat local) élevé en étang, chair ferme et savoureuse.",
        category: "poissons",
        priceAmount: 10,
        currency: "USD",
        unit: "/ kg",
        imageSrc:
          "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Ngolo (poisson-chat)",
        sortOrder: 2,
      },

      // ── Agriculture (produits cultivés à la demande) ──
      {
        name: "Plate-bande épinard",
        description: "Culture d'épinard, produite à la demande.",
        category: "agriculture",
        priceAmount: 50,
        currency: "USD",
        unit: "/ plate-bande",
        onDemand: true,
        imageSrc:
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Plate-bande d'épinard",
        sortOrder: 1,
      },
      {
        name: "Plate-bande oseille",
        description: "Culture d'oseille, produite à la demande.",
        category: "agriculture",
        priceAmount: 30,
        currency: "USD",
        unit: "/ plate-bande",
        onDemand: true,
        imageSrc:
          "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Plate-bande d'oseille",
        sortOrder: 2,
      },
      {
        name: "Plate-bande nduda",
        description: "Culture de nduda, produite à la demande.",
        category: "agriculture",
        priceAmount: 30,
        currency: "USD",
        unit: "/ plate-bande",
        onDemand: true,
        imageSrc:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Plate-bande de nduda",
        sortOrder: 3,
      },

      // ── Produits pour animaux ──
      {
        name: "Aliment poulet",
        description: "Aliment complet pour poulets, riche en protéines.",
        category: "produits_animaux",
        priceAmount: 25000,
        currency: "FC",
        unit: "/ sac 50 kg",
        badge: "Best-seller",
        imageSrc:
          "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Sac d'aliment pour volailles",
        sortOrder: 1,
      },
      {
        name: "Aliment bovin",
        description: "Complément alimentaire pour bovins, croissance et lait.",
        category: "produits_animaux",
        priceAmount: 35000,
        currency: "FC",
        unit: "/ sac 50 kg",
        imageSrc:
          "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Sac d'aliment pour bovins",
        sortOrder: 2,
      },
      {
        name: "Aliment poisson",
        description: "Granulés pour poissons d'élevage, formulation équilibrée.",
        category: "produits_animaux",
        priceAmount: 40000,
        currency: "FC",
        unit: "/ sac 25 kg",
        imageSrc:
          "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Granulés pour poissons",
        sortOrder: 3,
      },
      {
        name: "Aliment caprin",
        description: "Mélange équilibré pour chèvres et boucs.",
        category: "produits_animaux",
        priceAmount: 28000,
        currency: "FC",
        unit: "/ sac 50 kg",
        imageSrc:
          "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Sac d'aliment pour caprins",
        sortOrder: 4,
      },

      // ── Bovins (à venir) ──
      {
        name: "Bœuf adulte",
        description: "Élevage bovin — catégorie bientôt disponible.",
        category: "bovins",
        priceAmount: null,
        currency: "FC",
        comingSoon: true,
        imageSrc:
          "https://images.unsplash.com/photo-1600428853876-6b57d20b9da6?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Bœuf au pâturage",
        sortOrder: 1,
      },

      // ── Caprins (à venir) ──
      {
        name: "Chèvre adulte",
        description: "Élevage caprin — catégorie bientôt disponible.",
        category: "caprins",
        priceAmount: null,
        currency: "FC",
        comingSoon: true,
        imageSrc:
          "https://images.unsplash.com/photo-1564492300010-3a6a3f4e1e1e?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Chèvre dans une étable",
        sortOrder: 1,
      },
  ];

  const usedSlugs = new Set<string>();
  const productsWithSlugs = rawProducts.map((product) => {
    let slug = slugify(product.name);
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(product.name)}-${suffix++}`;
    }
    usedSlugs.add(slug);
    return { ...product, slug };
  });

  await prisma.product.createMany({
    data: productsWithSlugs as Prisma.ProductCreateManyInput[],
  });

  console.log("✅ Seed terminé : produits insérés.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
