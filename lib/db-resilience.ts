/**
 * Helpers de résilience pour les appels Prisma pendant le build / le rendu.
 *
 * Sur les hébergeurs comme Hostinger, la base de données peut être
 * inaccessible ou les credentials peuvent ne pas être disponibles au
 * moment du build (prérendu statique / ISR). Sans protection, une
 * simple erreur d'auth MySQL fait échouer tout le déploiement avec
 * `Export encountered an error on /xxx/page`.
 *
 * `safeDbCall` enveloppe une requête Prisma pour :
 *   - retourner `fallback` (par défaut `[]`) en cas d'erreur Prisma
 *     (auth, timeout, connexion refusée, etc.) ;
 *   - logger un avertissement sans interrompre le build.
 *
 * À n'utiliser QUE pour les requêtes de page qui ne sont pas critiques
 * (listes publiques, sections facultatives). Les actions admin
 * (mutations, recherche, export) doivent garder leur gestion d'erreur
 * explicite.
 */

type PrismaLikeError = Error & { code?: string; name?: string };

const TRANSIENT_PRISMA_CODES = new Set([
  "P1000", // Authentication failed
  "P1001", // Can't reach database server
  "P1002", // Database server timed out
  "P1003", // Database does not exist
  "P1008", // Operations timed out
  "P1009", // Database already exists
  "P1010", // User denied access
  "P1011", // Error opening a TLS connection
  "P1012", // Tls error
  "P1017", // Server has closed the connection
  "P2002", // Unique constraint failed (peut arriver si seed concurrent)
]);

function isTransientPrismaError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as PrismaLikeError;
  if (e.code && TRANSIENT_PRISMA_CODES.has(e.code)) return true;
  // Messages typiques côté hébergeurs (ex. Hostinger) sans code Prisma.
  const msg = (e.message ?? "").toLowerCase();
  return (
    msg.includes("authentication failed") ||
    msg.includes("access denied") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    msg.includes("etimedout") ||
    msg.includes("getaddrinfo") ||
    msg.includes("database server")
  );
}

export async function safeDbCall<T>(
  query: () => Promise<T>,
  fallback: T,
  context: string,
): Promise<T> {
  try {
    return await query();
  } catch (err) {
    if (isTransientPrismaError(err)) {
      // Avertissement uniquement — on n'interrompt ni le build ni le rendu.
      // eslint-disable-next-line no-console
      console.warn(
        `[safeDbCall] ${context} ignorée : base de données indisponible pendant le build. ` +
          `Fallback utilisé. (${err instanceof Error ? err.message : String(err)})`,
      );
      return fallback;
    }
    // Erreur inattendue (bug applicatif, schéma invalide, etc.) : on la propage.
    throw err;
  }
}
