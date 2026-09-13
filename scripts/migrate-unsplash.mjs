/**
 * scripts/migrate-unsplash.mjs
 *
 * Migre les images de contenu Unsplash vers des fichiers locaux :
 *  1. Scanne les fichiers sources (lib/content.ts, prisma/seed.ts, pages
 *     admin login/forgot-password) et relève les URLs images.unsplash.com.
 *  2. Télécharge chaque photo unique dans public/images/<photoId>.jpg.
 *  3. Réécrit les références dans les fichiers sources.
 *  4. Met à jour la base (products.image_src, product_images.url).
 *
 * Usage : node scripts/migrate-unsplash.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import "dotenv/config";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");

const SOURCE_FILES = [
  "lib/content.ts",
  "prisma/seed.ts",
  "app/admin/login/page.tsx",
  "app/admin/forgot-password/page.tsx",
];

const UNSPLASH_RE =
  /https:\/\/images\.unsplash\.com\/(photo-[a-z0-9-]+)[^"'\\\s)]*/gi;
// Variante sans flag global pour extraire l'identifiant d'une URL isolée.
const UNSPLASH_ID_RE = /https:\/\/images\.unsplash\.com\/(photo-[a-z0-9-]+)/i;

// Photos supprimées d'Unsplash (HTTP 404) : substitut local choisi parmi
// les images déjà téléchargées, au plus proche du sujet d'origine.
const PHOTO_FALLBACKS = {
  // Bovins / élevage
  "photo-1600428853876-6b57d20b9da6": "photo-1500595046743-cd271d694d30.jpg",
  "photo-1564492300010-3a6a3f4e1e1e": "photo-1516467508483-a7212febe31a.jpg",
  "photo-1543374996-3a5d6b3e5e4e": "photo-1587213128862-80345e23a71a.jpg",
  "photo-1570042225831-d1fa9b5c9b29": "photo-1484557985045-edf25e08da73.jpg",
  "photo-1533418436585-5c2c24e0c5dc": "photo-1515735543535-12664d2453f8.jpg",
  // Poissons / pisciculture
  "photo-1535473895227-bdecb20fb373": "photo-1574781330855-d0db8cc6a79c.jpg",
  "photo-1559473242-3740c6c65e1e": "photo-1574781330855-d0db8cc6a79c.jpg",
  // Poulets
  "photo-1516467508483-a7212febe7da": "photo-1548550023-2bdb3c5beed7.jpg",
  "photo-1548559934-4e3a06e1d434": "photo-1548550023-2bdb3c5beed7.jpg",
  // Aliments pour animaux
  "photo-1604908554049-29bf08f5d1a9": "photo-1593113598332-cd288d649433.jpg",
  "photo-1589923188651-268a976c1753": "photo-1593113598332-cd288d649433.jpg",
};

/** Variante de téléchargement : on conserve les paramètres d'origine. */
function downloadUrl(originalUrl) {
  // Certains liens ont un espace en tête (bug de saisie) — on nettoie.
  return originalUrl.trim();
}

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });

  // ── 1. Collecte des URLs uniques par photo ──────────────────────────
  /** @type {Map<string, string>} photoId -> URL la plus grande (w max) */
  const photos = new Map();
  const fileContents = new Map();

  for (const rel of SOURCE_FILES) {
    const filePath = path.join(ROOT, rel);
    const content = await readFile(filePath, "utf8");
    fileContents.set(rel, content);

    for (const match of content.matchAll(UNSPLASH_RE)) {
      const url = match[0].trim();
      const photoId = match[1];
      const existing = photos.get(photoId);
      const w = Number(new URL(url).searchParams.get("w")) || 0;
      const existingW = existing
        ? Number(new URL(existing).searchParams.get("w")) || 0
        : -1;
      if (!existing || w > existingW) photos.set(photoId, url);
    }
  }

  console.log(`→ ${photos.size} image(s) Unsplash unique(s) détectée(s).`);

  // ── 2. Téléchargement ───────────────────────────────────────────────
  let downloaded = 0;
  const missing = [];
  for (const [photoId, url] of photos) {
    const fileName = `${photoId}.jpg`;
    const dest = path.join(IMAGES_DIR, fileName);
    const res = await fetch(downloadUrl(url), {
      headers: { Accept: "image/jpeg,image/*" },
    });
    if (!res.ok) {
      missing.push(photoId);
      console.error(`  ✗ ${photoId} : HTTP ${res.status} (${url})`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buffer);
    downloaded++;
    console.log(`  ✓ ${fileName} (${Math.round(buffer.length / 1024)} Ko)`);
  }

  // Substituts locaux pour les photos supprimées d'Unsplash (seconde
  // passe : toutes les images sources sont déjà sur disque).
  const { copyFile } = await import("node:fs/promises");
  for (const photoId of missing) {
    const fallback = PHOTO_FALLBACKS[photoId];
    if (!fallback) {
      console.warn(`  ⚠ aucun substitut défini pour ${photoId}`);
      continue;
    }
    await copyFile(
      path.join(IMAGES_DIR, fallback),
      path.join(IMAGES_DIR, `${photoId}.jpg`),
    );
    downloaded++;
    console.log(`  ~ ${photoId}.jpg ← substitut ${fallback}`);
  }

  // ── 3. Image Open Graph dédiée (1200×630) depuis la photo du hero ──
  const ogPhotoId = "photo-1500595046743-cd271d694d30";
  if (photos.has(ogPhotoId)) {
    const ogUrl = `https://images.unsplash.com/${ogPhotoId}?auto=format&fit=crop&w=1200&h=630&q=80`;
    const res = await fetch(ogUrl, { headers: { Accept: "image/jpeg" } });
    if (res.ok) {
      await writeFile(
        path.join(IMAGES_DIR, "og-cover.jpg"),
        Buffer.from(await res.arrayBuffer()),
      );
      console.log("  ✓ og-cover.jpg (1200×630)");
    }
  }

  // ── 4. Réécriture des fichiers sources ──────────────────────────────
  for (const [rel, content] of fileContents) {
    const rewritten = content.replace(UNSPLASH_RE, (_m, photoId) => {
      return `/images/${photoId}.jpg`;
    });
    if (rewritten !== content) {
      await writeFile(path.join(ROOT, rel), rewritten, "utf8");
      console.log(`→ ${rel} réécrit.`);
    }
  }

  // ── 5. Mise à jour de la base de données ────────────────────────────
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      const products = await prisma.product.findMany({
        include: { images: true },
      });
      let updated = 0;
      for (const product of products) {
        const urls = [product.imageSrc, ...product.images.map((i) => i.url)];
        if (!urls.some((u) => u.includes("images.unsplash.com"))) continue;

        const toLocal = (u) => {
          const m = u.match(UNSPLASH_ID_RE);
          return m ? `/images/${m[1]}.jpg` : u;
        };
        await prisma.product.update({
          where: { id: product.id },
          data: { imageSrc: toLocal(product.imageSrc) },
        });
        for (const img of product.images) {
          const local = toLocal(img.url);
          if (local !== img.url) {
            await prisma.productImage.update({
              where: { id: img.id },
              data: { url: local },
            });
          }
        }
        updated++;
      }
      console.log(`→ ${updated} produit(s) mis à jour en base.`);
    } finally {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.warn(
      "⚠️  Base de données inaccessible — les lignes existantes conservent",
      "leurs URLs Unsplash. Relancer le script quand la BDD est joignable.",
      err.message,
    );
  }

  console.log(
    `\nTerminé : ${downloaded}/${photos.size} image(s) téléchargée(s).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
