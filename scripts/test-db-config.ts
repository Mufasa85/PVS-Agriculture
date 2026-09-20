/**
 * Petit script de test pour valider la construction d'URL DB.
 * Usage : npx tsx scripts/test-db-config.ts
 */

import {
  buildDatabaseUrl,
  ensureDatabaseUrl,
} from "../lib/db-config";

function run(label: string, mutateEnv: () => void) {
  console.log(`\n─── ${label} ───`);
  // Réinitialiser toutes les variables DB / DATABASE_URL
  delete process.env.DATABASE_URL;
  delete process.env.DB_HOST;
  delete process.env.DB_PORT;
  delete process.env.DB_USER;
  delete process.env.DB_PASSWORD;
  delete process.env.DB_NAME;

  mutateEnv();

  try {
    const url = ensureDatabaseUrl();
    console.log("URL finale :", url || "(vide)");
  } catch (e) {
    console.error("ERREUR :", (e as Error).message);
  }
}

// Cas 1 : DATABASE_URL seule (ancien format, dev local)
run("Mode rétro-compatible (DATABASE_URL seule)", () => {
  process.env.DATABASE_URL = "mysql://root:root@localhost:3306/pvs_ongd";
});

// Cas 2 : DB_* séparées (nouveau format, Hostinger)
run("Mode nouvelles variables (DB_*)", () => {
  process.env.DB_HOST = "localhost";
  process.env.DB_PORT = "3306";
  process.env.DB_USER = "u143417747_pvs";
  process.env.DB_PASSWORD = "Arcanecore_2026";
  process.env.DB_NAME = "u143417747_ongd_pvs";
});

// Cas 3 : DB_* + DATABASE_URL → DATABASE_URL prioritaire
run("Conflit (DATABASE_URL prioritaire)", () => {
  process.env.DATABASE_URL = "mysql://prio:prise@db.local:3306/prio_db";
  process.env.DB_HOST = "autre";
  process.env.DB_USER = "autre";
  process.env.DB_PASSWORD = "autre";
  process.env.DB_NAME = "autre";
});

// Cas 4 : DB_* partielles → erreur explicite
run("Variables partielles (DB_PASSWORD manquante)", () => {
  process.env.DB_HOST = "localhost";
  process.env.DB_USER = "u143417747_pvs";
  process.env.DB_NAME = "u143417747_ongd_pvs";
});

// Cas 5 : mot de passe avec caractères spéciaux
run("Mot de passe avec caractères spéciaux", () => {
  process.env.DB_HOST = "localhost";
  process.env.DB_USER = "user";
  process.env.DB_PASSWORD = "p@ss:wo#rd/with%specials";
  process.env.DB_NAME = "db";
});

// Cas 6 : buildDatabaseUrl() n'écrit pas dans process.env
console.log("\n─── buildDatabaseUrl() pur (sans effet de bord) ───");
delete process.env.DATABASE_URL;
process.env.DB_HOST = "h";
process.env.DB_USER = "u";
process.env.DB_PASSWORD = "p";
process.env.DB_NAME = "d";
const url = buildDatabaseUrl();
console.log("URL :", url);
console.log(
  "process.env.DATABASE_URL après buildDatabaseUrl() :",
  process.env.DATABASE_URL ?? "(undefined)",
);
