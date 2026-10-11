#!/usr/bin/env node
/**
 * scripts/clean-archive-originals.mjs
 *
 * Supprime les fichiers .webp "originaux" de public/images/archive/
 * qui ont une variante -1200.webp ou -640.webp générée.
 *   X.webp         -> supprimé si X-1200.webp existe
 *   porc-adulte.webp -> NON supprimé (pas de variante, déjà léger)
 *
 * Avant suppression : vérifie qu'aucune référence dans content.ts ne pointe
 * encore vers l'original (sinon on annule).
 */
import { readdir, unlink, stat, readFile } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const DIR = join(ROOT, "public", "images", "archive");
const CONTENT = join(ROOT, "lib", "content.ts");

// 1. Vérifier qu'aucune référence dans content.ts ne pointe vers un .webp original
const content = await readFile(CONTENT, "utf8");
const referenced = new Set(
  Array.from(
    content.matchAll(/\/images\/archive\/([a-z0-9-]+)\.webp/g),
    (m) => m[1]
  )
);
console.log(`📄 ${referenced.size} noms référencés dans content.ts`);

const all = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith(".webp"));

let deleted = 0;
let deletedBytes = 0;
let kept = 0;
let keptBytes = 0;

for (const name of all) {
  const stem = basename(name, extname(name));
  // Les fichiers avec suffixe -1200 ou -640 sont des variantes, on n'y touche pas
  if (stem.endsWith("-1200") || stem.endsWith("-640")) {
    continue;
  }

  const has1200 = all.includes(`${stem}-1200.webp`);
  const has640 = all.includes(`${stem}-640.webp`);
  const isReferenced = referenced.has(stem);

  if (isReferenced && !has1200 && !has640) {
    console.log(`⚠️  ${name} : référencé mais pas de variante, conservé`);
    const s = await stat(join(DIR, name));
    keptBytes += s.size;
    kept++;
    continue;
  }

  if (isReferenced && (has1200 || has640)) {
    // DANGER : content.ts pointe encore vers l'original
    console.log(`❌ ${name} : encore référencé dans content.ts, conservé par sécurité`);
    const s = await stat(join(DIR, name));
    keptBytes += s.size;
    kept++;
    continue;
  }

  // Sinon, on supprime l'original
  const fp = join(DIR, name);
  const s = await stat(fp);
  await unlink(fp);
  console.log(`🗑️  ${name} (${(s.size / 1024).toFixed(0)} Ko)`);
  deleted++;
  deletedBytes += s.size;
}

console.log(`\n── Résumé ──`);
console.log(`Originaux supprimés : ${deleted} (${(deletedBytes / (1024 * 1024)).toFixed(2)} Mo libérés)`);
console.log(`Originaux conservés : ${kept} (${(keptBytes / 1024).toFixed(0)} Ko)`);
