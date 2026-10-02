/**
 * Test des métadonnées OG / Twitter / JSON-LD générées.
 * Affiche un aperçu de ce que Next.js va mettre dans le <head>.
 *
 * Usage : npx tsx scripts/test-og.ts
 */

import { ogCover, ogLogo, openGraphBase, twitterBase } from "../lib/og";
import { organizationJsonLd, pageMetadata, siteUrl } from "../lib/seo";

console.log("═══════════════════════════════════════════════════════════");
console.log("  APERÇU DES MÉTADONNÉES OPEN GRAPH / TWITTER / JSON-LD");
console.log("═══════════════════════════════════════════════════════════");

console.log("\n─── Site ───");
console.log("siteUrl :", siteUrl);

console.log("\n─── Image OG (couverture) ───");
console.log(ogCover);
console.log("URL absolue :", `${siteUrl}${ogCover.url}`);

console.log("\n─── Logo ───");
console.log(ogLogo);
console.log("URL absolue :", `${siteUrl}${ogLogo.url}`);

console.log("\n─── Bloc openGraph (racine) ───");
console.log(JSON.stringify(openGraphBase, null, 2));

console.log("\n─── Bloc twitter (racine) ───");
console.log(JSON.stringify(twitterBase, null, 2));

console.log("\n─── pageMetadata('/agriculture') ───");
const meta = pageMetadata({
  title: "Agriculture — PVS ONGD ASBL",
  description: "Cultures vivrières et pratiques agricoles durables à Kinshasa.",
  path: "/agriculture",
});
console.log("title       :", JSON.stringify(meta.title));
console.log("description :", JSON.stringify(meta.description));
console.log("canonical   :", JSON.stringify(meta.alternates));
console.log("openGraph   :", JSON.stringify(meta.openGraph, null, 2));
console.log("twitter     :", JSON.stringify(meta.twitter, null, 2));

console.log("\n─── organizationJsonLd() ───");
console.log(JSON.stringify(organizationJsonLd(), null, 2));

console.log("\n─── Balises <meta> qui seront générées dans le <head> ───");
const metas: string[] = [];

metas.push(`<title>${meta.title}</title>`);
metas.push(`<meta name="description" content="${meta.description}" />`);
if (meta.alternates?.canonical) {
  metas.push(
    `<link rel="canonical" href="${siteUrl}${meta.alternates.canonical}" />`,
  );
}
const og = meta.openGraph as Record<string, unknown>;
if (og) {
  for (const [key, value] of Object.entries(og)) {
    if (key === "images" && Array.isArray(value)) {
      for (const img of value as Array<Record<string, unknown>>) {
        if (img.url)
          metas.push(`<meta property="og:image" content="${img.url}" />`);
        if (img.width)
          metas.push(
            `<meta property="og:image:width" content="${img.width}" />`,
          );
        if (img.height)
          metas.push(
            `<meta property="og:image:height" content="${img.height}" />`,
          );
        if (img.alt)
          metas.push(`<meta property="og:image:alt" content="${img.alt}" />`);
        if (img.type)
          metas.push(`<meta property="og:image:type" content="${img.type}" />`);
      }
    } else if (typeof value === "string") {
      metas.push(`<meta property="og:${key}" content="${value}" />`);
    }
  }
}
const tw = meta.twitter as Record<string, unknown>;
if (tw) {
  for (const [key, value] of Object.entries(tw)) {
    if (key === "images" && Array.isArray(value)) {
      for (const img of value as Array<Record<string, unknown>>) {
        if (img.url)
          metas.push(`<meta name="twitter:image" content="${img.url}" />`);
        if (img.alt)
          metas.push(`<meta name="twitter:image:alt" content="${img.alt}" />`);
      }
    } else if (typeof value === "string" || typeof value === "number") {
      metas.push(`<meta name="twitter:${key}" content="${value}" />`);
    }
  }
}

metas.push(`<meta property="og:logo" content="${siteUrl}${ogLogo.url}" />`);

for (const m of metas) console.log(m);
