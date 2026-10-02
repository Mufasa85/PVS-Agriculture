/**
 * lib/geoip.ts
 *
 * Géolocalisation IP avec cache mémoire et fallback réseau.
 *
 * Étages (du plus rapide au plus lent) :
 * 1. Cache mémoire en process (TTL 24 h, clé par /24 IPv4 ou /48 IPv6)
 * 2. `geoip-lite` (offline, base MaxMind embarquée par défaut OU base MaxMind
 *    rafraîchie via `npm run geoip:update` si `data/geoip-country.dat` existe)
 * 3. `ipwhois.app` (HTTPS, gratuit, pas de clé, 10k req/mois)
 *
 * Le timeout réseau est court (3 s) pour ne pas ralentir le track.
 * En cas d'échec (timeout, 5xx, JSON malformé) on renvoie `null`
 * et l'event est enregistré sans `country` — le backfill rattrapera
 * plus tard via `scripts/backfill-countries.ts`.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

/**
 * Si une base GeoLite2-Country fraîche a été installée via
 * `npm run geoip:update`, on la préfère à celle embarquée par `geoip-lite`.
 * `geoip-lite` lit `process.env.GEODATADIR` au moment du require.
 *
 * On utilise createRequire + un wrapper CJS pour pouvoir recharger
 * geoip-lite APRÈS avoir posé GEODATADIR : un import ESM serait hoisté
 * par le bundler au-dessus de ce bloc.
 */
const LOCAL_DATA_DIR = resolve(process.cwd(), "data");
const HAS_LOCAL_DB =
  existsSync(resolve(LOCAL_DATA_DIR, "geoip-country.dat")) &&
  existsSync(resolve(LOCAL_DATA_DIR, "geoip-country6.dat"));

if (HAS_LOCAL_DB && process.env.GEODATADIR !== LOCAL_DATA_DIR) {
  process.env.GEODATADIR = LOCAL_DATA_DIR;
}

const _require = createRequire(import.meta.url);
const geoip = _require("geoip-lite") as typeof import("geoip-lite");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const NETWORK_TIMEOUT_MS = 3000;
const CACHE_MAX_ENTRIES = 5_000;

type CacheEntry = { value: string | null; expiresAt: number };
const cache = new Map<string, CacheEntry>();

function cacheSet(key: string, value: string | null) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    // Drop the oldest insertion (Map iteration order = insertion order).
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

function cacheGet(key: string): string | null | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

/**
 * Cache à clé "ip/24" pour mutualiser les lookups sur un même subnet
 * (la plupart des visiteurs d'un même FAI partagent les 3 premiers octets).
 */
function cacheKey(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) return `v4:${parts[0]}.${parts[1]}.${parts[2]}.0`;
    return `v4:${ip}`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 3) return `v6:${parts.slice(0, 3).join(":")}::`;
    return `v6:${ip}`;
  }
  return ip;
}

async function lookupRemote(ip: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
  try {
    const res = await fetch(`https://ipwhois.app/json/${ip}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      success?: boolean;
      country_code?: string;
    };
    if (data?.success === false) return null;
    if (typeof data?.country_code === "string" && data.country_code.length === 2) {
      return data.country_code.toUpperCase();
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Renvoie le code pays ISO-2 (`"CD"`, `"FR"`, ...) ou `null` si inconnu.
 * Synchrone quand la réponse est en cache ou couverte par geoip-lite,
 * asynchrone seulement en cas de fallback réseau.
 */
export async function lookupCountry(ip: string): Promise<string | null> {
  if (!ip || ip === "127.0.0.1" || ip === "::1") return null;

  const key = cacheKey(ip);
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;

  // 1) Offline lookup — couvre ~99 % des cas usuels avec la base MaxMind à jour.
  const local = geoip.lookup(ip);
  if (local?.country) {
    cacheSet(key, local.country);
    return local.country;
  }

  // 2) Réseau, seulement si le cache a manqué ET que geoip-lite ne sait pas.
  const remote = await lookupRemote(ip);
  cacheSet(key, remote);
  return remote;
}

/** Variante synchrone pour les chemins qui ne peuvent pas await. */
export function lookupCountrySync(ip: string): string | null {
  if (!ip || ip === "127.0.0.1" || ip === "::1") return null;
  const key = cacheKey(ip);
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  const local = geoip.lookup(ip);
  const value = local?.country ?? null;
  cacheSet(key, value);
  return value;
}

/** Expose la source utilisée pour les logs et le debugging. */
export const geoipSource = HAS_LOCAL_DB ? "maxmind-local" : "geoip-lite-bundled";