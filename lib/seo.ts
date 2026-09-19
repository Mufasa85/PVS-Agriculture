import type { Metadata } from "next";
import type { Product } from "@prisma/client";

import { contact, siteMeta } from "@/lib/content";

/**
 * URL publique canonique du site (sans slash final).
 * Définir NEXT_PUBLIC_SITE_URL en production (ex. https://www.pvs-ongd.cd).
 *
 * On retombe sur le localhost si la variable est absente OU définie à une
 * chaîne vide (le `??` ne couvre que `null`/`undefined`, pas `""`).
 * On valide aussi que l'URL est bien parsable pour éviter
 * `TypeError: Invalid URL` dans `new URL(siteUrl)` lors du build Next.js.
 */
const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = raw && raw.length > 0 ? raw : FALLBACK_SITE_URL;
  const trimmed = candidate.replace(/\/+$/, "");
  try {
    // Validation : lève si l'URL est invalide.
    new URL(trimmed);
    return trimmed;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const siteUrl = resolveSiteUrl();

export const siteName = "PVS ONGD ASBL";

export const ogImage = {
  url: "/images/og-cover.jpg",
  width: 1200,
  height: 630,
  alt: "PVS ONGD ASBL — agriculture, élevage et pisciculture à Kinshasa",
} as const;

/**
 * Métadonnées complètes d'une page publique : title/description + URL
 * canonique + Open Graph + Twitter card. Le `metadataBase` du layout
 * racine résout les URLs relatives (image OG).
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      locale: "fr_FR",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

/** Données structurées schema.org — organisation (layout racine). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteName,
    alternateName: "PVS",
    url: siteUrl,
    description: siteMeta.description,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 Avenue Dokolo, Q/ Kimwenza gare, C/ Mont Ngafula",
      addressLocality: "Kinshasa",
      addressCountry: "CD",
    },
  };
}

type JsonLdProduct = Pick<
  Product,
  | "name"
  | "description"
  | "imageSrc"
  | "imageAlt"
  | "priceAmount"
  | "currency"
  | "unit"
  | "comingSoon"
>;

function absoluteImageUrl(src: string): string {
  return src.startsWith("http") ? src : `${siteUrl}${src}`;
}

/**
 * Données structurées schema.org — liste de produits d'une page catalogue.
 * La devise interne "FC" est convertie en code ISO 4217 "CDF".
 */
export function productListJsonLd(products: JsonLdProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: absoluteImageUrl(product.imageSrc),
        brand: { "@type": "Brand", name: siteName },
        offers:
          product.priceAmount !== null && !product.comingSoon
            ? {
                "@type": "Offer",
                price: Number(product.priceAmount),
                priceCurrency: product.currency === "FC" ? "CDF" : "USD",
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: siteName },
              }
            : undefined,
      },
    })),
  };
}
