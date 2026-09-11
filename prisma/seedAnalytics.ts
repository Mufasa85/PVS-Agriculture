import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATHS = [
  "/",
  "/produits",
  "/categories",
  "/contact",
  "/a-propos",
  "/commandes",
];

const SEARCH_QUERIES = [
  "maïs bio",
  "poulet de chair",
  "œufs frais",
  "tournesol",
  "haricots verts",
  "soja premium",
  "farine de maïs",
  "poussins d'un jour",
];

const PRODUCTS = [
  { name: "Maïs Jaune Égrené", category: "Agriculture & Céréales" },
  { name: "Poulets de Chair Vivants", category: "Élevage & Volailles" },
  { name: "Œufs Frais de Ferme (Plateau x30)", category: "Élevage & Volailles" },
  { name: "Haricots Rouges Bio", category: "Agriculture & Céréales" },
  { name: "Poussins d'Un Jour Vaccinés", category: "Élevage & Volailles" },
  { name: "Graines de Tournesol", category: "Agriculture & Céréales" },
];

const DEVICES = ["Desktop", "Desktop", "Desktop", "Mobile", "Mobile", "Mobile", "Mobile", "Tablet"];
const SOURCES = [
  "",
  "https://www.google.com/",
  "https://www.google.com/",
  "https://www.facebook.com/",
  "https://www.linkedin.com/",
  "https://l.instagram.com/",
  "https://bing.com/",
];

const IPS = Array.from({ length: 45 }, (_, i) => `${Math.floor(i / 5) + 1}.${(i % 10) * 23 + 12}.${Math.floor(i / 5) + 1}.${(i % 10) * 23 + 12}`);

async function main() {
  console.log("🌱 Génération des données de test Analytics...");

  // Nettoyage ancien test
  await prisma.analyticsEvent.deleteMany({
    where: {
      path: {
        not: "",
      },
    },
  });

  const events = [];
  const now = new Date();

  // Générer des données sur les 60 derniers jours (30d courants + 30d précédents pour croissance)
  for (let i = 59; i >= 0; i--) {
    const dayDate = new Date();
    dayDate.setDate(now.getDate() - i);

    // Trafic plus important sur les 30 derniers jours (+ 25% de croissance)
    const baseTraffic = i < 30 ? Math.floor(Math.random() * 35) + 40 : Math.floor(Math.random() * 25) + 25;

    for (let j = 0; j < baseTraffic; j++) {
      // Heure aléatoire dans la journée
      const hour = Math.floor(Math.random() * 15) + 7; // entre 7h et 22h
      const min = Math.floor(Math.random() * 60);
      const eventTime = new Date(dayDate);
      eventTime.setHours(hour, min, Math.floor(Math.random() * 60));

      const path = PATHS[Math.floor(Math.random() * PATHS.length)];
      const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
      const referrer = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const ipAddress = IPS[Math.floor(Math.random() * IPS.length)];

      // Type d'événement
      const randType = Math.random();
      let type = "PAGE_VIEW";
      let metadata: any = { device };

      if (randType > 0.85) {
        type = "QUOTE_REQUEST";
        const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        metadata = { ...metadata, productName: prod.name, categoryName: prod.category };
      } else if (randType > 0.55) {
        type = "PRODUCT_VIEW";
        const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        metadata = { ...metadata, productName: prod.name, categoryName: prod.category };
      } else if (randType > 0.40) {
        type = "SEARCH";
        const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];
        metadata = { ...metadata, query };
      }

      events.push({
        type,
        path: type === "PRODUCT_VIEW" ? `/produits/${slugify(metadata.productName || "")}` : path,
        referrer: referrer || null,
        userAgent: `Mozilla/5.0 (${device}; CPU OS like Mac OS X)`,
        ipAddress,
        metadata,
        createdAt: eventTime,
      });
    }
  }

  // Insérer par lots
  const batchSize = 100;
  for (let b = 0; b < events.length; b += batchSize) {
    const batch = events.slice(b, b + batchSize);
    await prisma.analyticsEvent.createMany({
      data: batch,
    });
  }

  console.log(`✅ ${events.length} événements d'analytics générés avec succès sur 60 jours.`);
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
