import type { MetadataRoute } from "next";

// Manifeste PWA — servi sur /manifest.webmanifest et injecté
// automatiquement en <link rel="manifest"> par Next.js.
// Les icônes vivent dans public/pvs-pwa/icons/ (chemins absolus,
// scope "/" pour couvrir tout le site, pas seulement /pvs-pwa/).
export default function manifest(): MetadataRoute.Manifest {
  const icon = (size: number, purpose?: "any" | "maskable") => ({
    src: `/pvs-pwa/icons/icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png" as const,
    ...(purpose ? { purpose } : {}),
  });

  return {
    id: "/",
    name: "PVS ONGD ASBL",
    short_name: "PVS",
    description:
      "Agriculture, élevage, pisciculture, porcherie et produits pour animaux à Kinshasa.",
    lang: "fr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#3b52c4",
    icons: [
      icon(72, "any"),
      icon(96, "any"),
      icon(128, "any"),
      icon(144, "any"),
      icon(152, "any"),
      icon(192, "any"),
      icon(384, "any"),
      icon(512, "any"),
      {
        src: "/pvs-pwa/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
