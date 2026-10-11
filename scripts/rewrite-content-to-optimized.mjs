#!/usr/bin/env node
/**
 * scripts/rewrite-content-to-optimized.mjs
 *
 * Remplace dans lib/content.ts :
 *   /images/archive/X.webp  ->  /images/archive/X-1200.webp
 *
 * On ne touche qu'aux chemins /images/archive/ (les photos terrain).
 * Les autres chemins /images/ (Unsplash legacy) restent intacts.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const FILE = join(ROOT, "lib", "content.ts");

const PATTERN = /\/images\/archive\/([a-z0-9-]+)\.webp/g;
const REPLACE = "/images/archive/$1-1200.webp";

const before = await readFile(FILE, "utf8");
const after = before.replace(PATTERN, REPLACE);

if (before === after) {
  console.log("Aucun changement (rien à remplacer).");
} else {
  await writeFile(FILE, after);
}

const total = (after.match(/\/images\/archive\/[a-z0-9-]+-1200\.webp/g) || []).length;
const legacy = (after.match(/\/images\/archive\/[a-z0-9-]+\.webp/g) || []).filter(
  (u) => !u.endsWith("-1200.webp") && !u.endsWith("-640.webp")
).length;
console.log(`✅ ${total} références pointeur vers -1200.webp`);
console.log(`⚠️  ${legacy} référence(s) sans suffixe taille (à inspecter)`);
for (const m of after.match(/\/images\/archive\/[a-z0-9-]+\.webp/g) || []) {
  if (!m.endsWith("-1200.webp") && !m.endsWith("-640.webp")) {
    console.log("   ", m);
  }
}
