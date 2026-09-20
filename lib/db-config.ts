/**
 * Configuration de la base de données par variables séparées.
 *
 * Au lieu d'exposer une seule `DATABASE_URL` complète (qui contient le
 * mot de passe en clair), on lit chaque composante :
 *
 *   DB_HOST       → hôte MySQL     (ex. "localhost" sur Hostinger)
 *   DB_PORT       → port           (par défaut "3306")
 *   DB_USER       → nom d'utilisateur MySQL
 *   DB_PASSWORD   → mot de passe MySQL
 *   DB_NAME       → nom de la base
 *
 * Avantages :
 *   - Plus simple à configurer côté hébergeur (champs distincts dans
 *     l'UI, pas de gestion d'URL à encoder).
 *   - Permet d'encoder proprement le mot de passe s'il contient des
 *     caractères spéciaux (`@`, `#`, `:`, etc.).
 *   - Rétro-compatible : si `DATABASE_URL` est déjà définie (ex. dev
 *     local avec docker-compose), elle est utilisée telle quelle.
 *
 * L'URL finale est injectée dans `process.env.DATABASE_URL` au plus
 * tôt (avant l'instanciation de `PrismaClient`) pour que Prisma et la
 * CLI `prisma` la voient.
 */

const DEFAULT_PORT = "3306";

/**
 * Encode un mot de passe pour qu'il soit sûr dans une URL MySQL.
 * Les caractères `@`, `:`, `/`, `?`, `#`, `[`, `]`, `%` doivent être
 * percent-encodés.
 */
function encodeMysqlPassword(raw: string): string {
  return encodeURIComponent(raw);
}

type DbComponents = {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
};

/**
 * Lit les variables DB_* depuis process.env. Lève une erreur explicite
 * si des variables sont absentes (et que DATABASE_URL ne fournit pas
 * de fallback).
 */
function readDbComponents(): DbComponents | null {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  // Si aucune des nouvelles variables n'est définie, on retombe sur
  // DATABASE_URL (mode "compatibilité" pour les devs qui ont déjà
  // une URL complète dans leur .env local).
  if (!host && !user && !password && !database) {
    return null;
  }

  const missing: string[] = [];
  if (!host) missing.push("DB_HOST");
  if (!user) missing.push("DB_USER");
  if (password === undefined || password === "")
    missing.push("DB_PASSWORD");
  if (!database) missing.push("DB_NAME");

  if (missing.length > 0) {
    throw new Error(
      `[db-config] Variables d'environnement manquantes : ${missing.join(", ")}. ` +
        `Soit vous définissez les 5 (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME), ` +
        `soit vous gardez l'ancien format avec DATABASE_URL complet.`,
    );
  }

  return {
    host: host!,
    port: process.env.DB_PORT || DEFAULT_PORT,
    user: user!,
    password: password!,
    database: database!,
  };
}

/**
 * Construit l'URL MySQL à partir des variables DB_*.
 * Format : mysql://USER:PASSWORD@HOST:PORT/DATABASE
 */
export function buildDatabaseUrl(): string {
  const components = readDbComponents();
  if (!components) {
    // Pas de variables DB_* → on garde DATABASE_URL existante (ou undefined).
    return process.env.DATABASE_URL ?? "";
  }
  const { host, port, user, password, database } = components;
  return `mysql://${user}:${encodeMysqlPassword(password)}@${host}:${port}/${database}`;
}

/**
 * Injecte l'URL construite dans process.env.DATABASE_URL si elle n'est
 * pas déjà présente. À appeler le plus tôt possible (avant tout import
 * qui déclenche Prisma).
 *
 * Retourne l'URL finale utilisée.
 */
export function ensureDatabaseUrl(): string {
  const existing = process.env.DATABASE_URL;
  if (existing && existing.length > 0) {
    return existing;
  }
  const built = buildDatabaseUrl();
  if (built) {
    process.env.DATABASE_URL = built;
  }
  return built;
}
