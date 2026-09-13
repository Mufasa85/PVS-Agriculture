import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

/** Pages publiques indexables — l'admin et l'API sont exclus via robots.ts. */
const PUBLIC_ROUTES: {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/agriculture", changeFrequency: "weekly", priority: 0.9 },
  { path: "/elevage", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pisciculture", changeFrequency: "weekly", priority: 0.9 },
  { path: "/porcherie", changeFrequency: "weekly", priority: 0.9 },
  { path: "/produits-animaux", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tarifs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
