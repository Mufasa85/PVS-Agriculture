import type { Metadata } from "next";
import type { Product } from "@prisma/client";

import { contact, siteMeta } from "@/lib/content";
import { logoAbsoluteUrl, ogCover, siteName, siteUrl } from "@/lib/og";

// `siteUrl` et `siteName` sont définis dans `@/lib/og` (module "feuille"
// sans dépendance vers ce fichier, pour éviter les cycles d'import).
// On les réexporte ici pour la rétro-compatibilité avec les imports
// existants qui font `import { siteUrl } from "@/lib/seo"`.
export { siteUrl, siteName };

/**
 * Image Open Graph de couverture — réexport depuis lib/og.ts pour la
 * rétro-compatibilité avec les imports existants (`ogImage`).
 *
 * @deprecated Préférer l'import depuis `@/lib/og` : `import { ogCover } from "@/lib/og"`.
 */
export const ogImage = ogCover;

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
      images: [
        {
          url: ogCover.url,
          width: ogCover.width,
          height: ogCover.height,
          alt: ogCover.alt,
          type: ogCover.type,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogCover.url,
          alt: ogCover.alt,
        },
      ],
    },
  };
}

/** Données structurées schema.org — organisation (layout racine). */
export function organizationJsonLd() {
  // Liste des réseaux sociaux : alimente `sameAs` (Google Knowledge Graph)
  // et permet à Google d'associer l'entité à vos profils officiels.
  const sameAs: string[] = [];
  if (process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK)
    sameAs.push(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK);
  if (process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN)
    sameAs.push(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN);
  if (process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE)
    sameAs.push(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE);

  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    alternateName: ["PVS", "PVS ONGD", "PVS ASBL"],
    legalName: "PVS ONGD ASBL",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoAbsoluteUrl,
      width: 87,
      height: 71,
    },
    image: logoAbsoluteUrl,
    description: siteMeta.description,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 Avenue Dokolo, Q/ Kimwenza gare, C/ Mont Ngafula",
      addressLocality: "Kinshasa",
      addressRegion: "Kinshasa",
      postalCode: "—",
      addressCountry: "CD",
    },
    // Point de contact public pour le formulaire de contact.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: contact.phone,
        email: contact.email,
        availableLanguage: ["French", "Lingala"],
        areaServed: "CD",
      },
    ],
    // Profils sociaux pour Google Knowledge Graph (Knowledge Panel).
    ...(sameAs.length > 0 ? { sameAs } : {}),
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
