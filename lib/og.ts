/**
 * lib/og.ts
 *
 * Configuration centralisée d'Open Graph / Twitter Cards / Logo pour
 * PVS ONGD ASBL. Toutes les plateformes de partage (Facebook,
 * LinkedIn, WhatsApp, Twitter/X, Discord, Telegram, Slack…) lisent
 * ces métadonnées depuis `app/layout.tsx` et `lib/seo.ts`.
 *
 * Image OG de couverture : /public/images/og-cover.jpg (1200×630)
 * Logo d'organisation    : /public/pvs-pwa/logo-fixed.png (87×71)
 *
 * Note : ce module est volontairement "feuille" (pas d'import depuis
 * `@/lib/seo`) pour éviter une circular dependency avec `lib/seo.ts`.
 * `siteUrl` et `siteName` sont définis ici et réexportés depuis
 * `lib/seo.ts` pour la rétro-compatibilité des imports existants.
 */

import type { Metadata } from "next";

/**
 * URL publique canonique du site (sans slash final).
 * Définir NEXT_PUBLIC_SITE_URL en production (ex. https://www.pvs-ongd.cd).
 *
 * On retombe sur le localhost si la variable est absente OU définie à une
 * chaîne vide. On valide aussi que l'URL est bien parsable pour éviter
 * `TypeError: Invalid URL` dans `new URL(siteUrl)` lors du build Next.js.
 */
const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = raw && raw.length > 0 ? raw : FALLBACK_SITE_URL;
  const trimmed = candidate.replace(/\/+$/, "");
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const siteUrl = resolveSiteUrl();
export const siteName = "PVS ONGD ASBL";

/** Image de couverture principale, partagée par OG et Twitter. */
export const ogCover = {
  url: "/images/og-cover.jpg",
  // Le fichier source fait 1200×630 (ratio 1.91:1, standard OG).
  width: 1200,
  height: 630,
  alt: `${siteName} — Agriculture, Élevage, Pisciculture à Kinshasa`,
  type: "image/jpeg" as const,
} as const;

/** Logo carré pour `og:logo`, JSON-LD Organization.logo, etc. */
export const ogLogo = {
  url: "/pvs-pwa/logo-fixed.png",
  width: 87,
  height: 71,
  alt: `Logo ${siteName}`,
  type: "image/png" as const,
} as const;

/** Favicons (résolutions classiques + ICO fallback). */
export const favicons = {
  favicon32: "/pvs-pwa/icons/favicon-32x32.png",
  favicon16: "/pvs-pwa/icons/favicon-16x16.png",
  appleTouch: "/pvs-pwa/icons/apple-touch-icon.png",
  // Certains navigateurs (Safari legacy, clients mail) cherchent
  // toujours /favicon.ico à la racine — on le sert via `icons.icon`.
  // Le fichier PNG 32×32 est utilisé comme fallback acceptable.
  faviconIco: "/pvs-pwa/icons/favicon-32x32.png",
} as const;

/** Identifiants de réseaux sociaux pour `metadata.other` et JSON-LD. */
export const social = {
  /** Compte Twitter/X officiel. Renseignez `@pvs_ongd` une fois créé. */
  twitter: undefined as string | undefined,
  /** Page Facebook. Renseignez une fois la page créée. */
  facebook: undefined as string | undefined,
  /** Page LinkedIn. */
  linkedin: undefined as string | undefined,
  /** Chaîne YouTube. */
  youtube: undefined as string | undefined,
} as const;

/** URL absolue d'une image à partir d'un chemin relatif. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

/** URL absolue du logo, utile pour JSON-LD. */
export const logoAbsoluteUrl = absoluteUrl(ogLogo.url);

/** URL absolue de l'image OG de couverture. */
export const ogCoverAbsoluteUrl = absoluteUrl(ogCover.url);

/**
 * Bloc `openGraph` complet, prêt à être spread dans `metadata.openGraph`.
 * Variantes locales : on garde `fr_FR` comme primary. Ajoutez ici
 * d'autres langues si vous traduisez le site.
 */
export const openGraphBase: Metadata["openGraph"] = {
  type: "website",
  siteName,
  title: siteName,
  description:
    "PVS ONGD ASBL — Organisation congolaise spécialisée en agriculture, élevage, pisciculture, porcherie et vente de produits pour animaux.",
  url: siteUrl,
  locale: "fr_FR",
  // Variantes linguistiques (vide pour l'instant, à compléter si i18n).
  // alternateLocale: ["en_US"],
  images: [
    {
      url: ogCover.url,
      width: ogCover.width,
      height: ogCover.height,
      alt: ogCover.alt,
      type: ogCover.type,
    },
  ],
};

/**
 * Bloc `twitter` complet.
 *
 * `summary_large_image` est requis pour que l'image OG (1200×630)
 * s'affiche en grand format dans le tweet preview.
 */
export const twitterBase: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  title: siteName,
  description:
    "PVS ONGD ASBL — Agriculture, Élevage, Pisciculture à Kinshasa.",
  images: [
    {
      url: ogCover.url,
      alt: ogCover.alt,
    },
  ],
};

/**
 * Robots fins pour le SEO : on autorise l'indexation pleine avec
 * preview large d'image et snippets étendus (utile pour Google
 * Discover et les SERP enrichies).
 */
export const robots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

/**
 * Bloc `icons` complet : favicons classiques + apple-touch + raccourci.
 *
 * Next.js 14+ déduit automatiquement les attributs `type`/`sizes` du
 * nom de fichier (ex. `favicon-32x32.png` → sizes=32x32, type=image/png).
 */
export const icons: Metadata["icons"] = {
  icon: [
    { url: favicons.favicon32, sizes: "32x32", type: "image/png" },
    { url: favicons.favicon16, sizes: "16x16", type: "image/png" },
    // .ico pour navigateurs / clients mail legacy.
    { url: favicons.faviconIco, sizes: "any", type: "image/x-icon" },
  ],
  apple: [{ url: favicons.appleTouch, sizes: "180x180", type: "image/png" }],
  shortcut: favicons.faviconIco,
};
