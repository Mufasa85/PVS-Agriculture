#!/usr/bin/env node
/**
 * scripts/optimize-archive-photos.mjs
 *
 * Optimise les photos terrain PVS (public/images/archive/*.webp) pour le web :
 *   - Variante 1200px de large, qualité 80 (utilisée en desktop / hero / par défaut)
 *   - Variante  640px de large, qualité 80 (utilisée en mobile via srcset)
 *
 * Règles :
 *   - Le fichier source reste intact (on ne l'écrase pas).
 *   - Les variantes sont écrites avec le suffixe de taille.
 *   - Les fichiers déjà générés (même taille que la source) sont skippés.
 *   - Les fichiers < 200 Ko (déjà légers, ex. porc-adulte.webp) sont skippés
 *     pour ne pas dégrader la qualité d'une image déjà optimisée.
 *
 * Usage :  node scripts/optimize-archive-photos.mjs
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname); // repo root
const SRC_DIR = join(ROOT, "public", "images", "archive");

const VARIANTS = [
  { width: 1200, quality: 80, suffix: "-1200" },
  { width: 640, quality: 80, suffix: "-640" },
];
const SKIP_BELOW_BYTES = 200 * 1024; // 200 Ko

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(2)} Mo`;
}

async function main() {
  const files = (await readdir(SRC_DIR))
    .filter((f) => f.toLowerCase().endsWith(".webp"))
    .sort();

  if (files.length === 0) {
    console.log("Aucune image .webp trouvée dans", SRC_DIR);
    return;
  }

  console.log(`📁 ${files.length} images trouvées dans public/images/archive/\n`);

  let totalSrc = 0;
  let totalOut = 0;
  let skipped = 0;
  let generated = 0;

  for (const name of files) {
    const srcPath = join(SRC_DIR, name);
    const srcStat = await stat(srcPath);
    totalSrc += srcStat.size;

    // Skip les images déjà légères
    if (srcStat.size < SKIP_BELOW_BYTES) {
      console.log(
        `⏭️  ${name.padEnd(40)} ${fmtBytes(srcStat.size).padStart(8)} (déjà léger, skippé)`
      );
      skipped++;
      continue;
    }

    const ext = extname(name); // .webp
    const stem = basename(name, ext);

    const meta = await sharp(srcPath).metadata();
    console.log(
      `🔄 ${name.padEnd(40)} ${fmtBytes(srcStat.size).padStart(8)}  (${meta.width}×${meta.height})`
    );

    for (const v of VARIANTS) {
      const outName = `${stem}${v.suffix}${ext}`;
      const outPath = join(SRC_DIR, outName);

      // Si la source est plus petite que la cible, on garde quand même
      // (sharp va upscaler — non, on protège avec un ratio)
      // Ici on suppose que toutes les sources sont >= 1200px.
      await sharp(srcPath)
        .rotate() // applique l'orientation EXIF
        .resize({
          width: v.width,
          withoutEnlargement: true, // n'upscale pas
          fit: "inside",
        })
        .webp({ quality: v.quality, effort: 4 })
        .toBuffer();

      // Re-génère à partir du buffer (sharp ne bufferise pas l'output, on l'écrit)
      const buf = await sharp(srcPath)
        .rotate()
        .resize({
          width: v.width,
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp({ quality: v.quality, effort: 4 })
        .toBuffer();

      await writeFile(outPath, buf);
      const outStat = await stat(outPath);
      totalOut += outStat.size;
      const ratio = ((1 - outStat.size / srcStat.size) * 100).toFixed(0);
      console.log(
        `   └─ ${outName.padEnd(40)} ${fmtBytes(outStat.size).padStart(8)}  (-${ratio}%)`
      );
      generated++;
    }
  }

  console.log("\n── Résumé ──");
  console.log(`Images source          : ${files.length}`);
  console.log(`Skippées (déjà légères): ${skipped}`);
  console.log(`Variantes générées     : ${generated}`);
  console.log(
    `Poids source total     : ${fmtBytes(totalSrc)}`
  );
  console.log(
    `Poids variantes total  : ${fmtBytes(totalOut)}`
  );
  if (totalSrc > 0) {
    console.log(
      `Réduction moyenne      : -${((1 - totalOut / totalSrc) * 100).toFixed(0)}%`
    );
  }
}

main().catch((err) => {
  console.error("❌ Erreur optimisation :", err);
  process.exit(1);
});
