#!/usr/bin/env node
/**
 * scripts/regen-porc-adulte.mjs
 *
 * Régénère la variante 1200 de porc-adulte.webp depuis Archive/web/.
 * L'original avait été skippé par le script d'optimisation (< 200 Ko),
 * mais le script de nettoyage l'a ensuite supprimé alors que content.ts
 * pointe vers /images/archive/porc-adulte-1200.webp.
 */
import { readdir, stat, writeFile, copyFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const SRC = join(ROOT, "Archive", "web", "IMG_2033.webp");
const OUT = join(ROOT, "public", "images", "archive", "porc-adulte-1200.webp");

const buf = await sharp(SRC)
  .rotate()
  .resize({ width: 1200, withoutEnlargement: true, fit: "inside" })
  .webp({ quality: 80, effort: 4 })
  .toBuffer();

await writeFile(OUT, buf);
const s = await stat(OUT);
console.log(`✅ Régénéré : ${OUT} (${(s.size / 1024).toFixed(1)} Ko)`);
