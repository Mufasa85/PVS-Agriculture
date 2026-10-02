/**
 * scripts/update-geoip-db.ts
 *
 * Télécharge la base GeoLite2-Country depuis MaxMind et l'installe dans
 * `data/`. `geoip-lite` lit automatiquement ce dossier quand
 * `process.env.GEODATADIR` pointe dessus — c'est ce que fait `lib/geoip.ts`.
 *
 * Usage :
 *   npm run geoip:update
 *
 * Lit automatiquement `MAXMIND_LICENSE_KEY` depuis `.env` (via `dotenv`).
 * Tu peux toujours l'override en préfixant : `MAXMIND_LICENSE_KEY=... npm run geoip:update`.
 *
 * La clé se récupère gratuitement sur https://www.maxmind.com/en/geolite2/signup
 * (compte "GeoLite2" — pas besoin de produit payant).
 *
 * La base doit être rafraîchie toutes les 1-2 semaines pour rester utile
 * (MaxMind publie des mises à jour régulièrement).
 *
 * Aucune clé n'est loggée ni commit. La base est gitignored.
 */

import { spawnSync } from "node:child_process";
import { config as loadDotenv } from "dotenv";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..");
const DATA_DIR = resolve(ROOT, "data");
const TMP_DIR = resolve(ROOT, ".next", "cache", "geoip-tmp");

// Charge `.env` (sans override les variables déjà présentes dans le shell,
// donc `MAXMIND_LICENSE_KEY=... npm run geoip:update` reste prioritaire).
loadDotenv({ path: resolve(ROOT, ".env"), override: false });

function die(msg: string): never {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

const licenseKey = process.env.MAXMIND_LICENSE_KEY?.trim();
if (!licenseKey) {
  die(
    "Variable d'environnement MAXMIND_LICENSE_KEY manquante. " +
      "Récupère ta clé sur https://www.maxmind.com/en/geolite2/signup " +
      "puis relance avec `MAXMIND_LICENSE_KEY=... npm run geoip:update`.",
  );
}

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

console.log("🌍 Téléchargement de GeoLite2-Country depuis MaxMind…");

const updatedb = resolve(ROOT, "node_modules", "geoip-lite", "scripts", "updatedb.js");
if (!existsSync(updatedb)) {
  die("geoip-lite introuvable dans node_modules. Lance `npm install` d'abord.");
}

const result = spawnSync(
  process.execPath,
  [
    updatedb,
    `license_key=${licenseKey}`,
    `geodatadir=${DATA_DIR}`,
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      GEOTMPDIR: TMP_DIR,
    },
  },
);

if (result.status !== 0) {
  die(`Échec de la mise à jour (code ${result.status}).`);
}

// Clean tmp
rmSync(TMP_DIR, { recursive: true, force: true });

console.log("✅ Base GeoLite2-Country installée dans data/.");
console.log(
  "   Le helper `lib/geoip.ts` la prendra en compte au prochain redémarrage du serveur.",
);