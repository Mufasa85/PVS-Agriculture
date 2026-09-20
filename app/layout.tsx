import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";

import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import SiteChrome from "@/components/layout/SiteChrome";
import JsonLd from "@/components/seo/JsonLd";
import { siteMeta } from "@/lib/content";
import {
  icons as ogIcons,
  ogCover,
  openGraphBase,
  robots,
  social,
  twitterBase,
} from "@/lib/og";
import { organizationJsonLd, siteName, siteUrl } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

/**
 * Viewport : couleurs de la barre du navigateur mobile.
 * - `themeColor` : medium (Chrome Android, Edge).
 * - `themeColor: media` : variante sombre (Safari iOS, dark mode).
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b52c4" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2456" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMeta.title,
    template: `%s | ${siteName}`,
  },
  description: siteMeta.description,
  applicationName: "PVS",
  keywords: [
    "PVS",
    "ONGD",
    "ASBL",
    "Kinshasa",
    "RDC",
    "République Démocratique du Congo",
    "agriculture",
    "élevage",
    "pisciculture",
    "porcherie",
    "produits pour animaux",
    "ONG congolaise",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "agriculture",
  robots,
  alternates: {
    canonical: "/",
    // Décommentez et complétez si vous déployez plusieurs langues :
    // languages: {
    //   "fr-CD": "/",
    //   "en-US": "/en",
    // },
  },
  // Lien vers le manifest PWA pour les progressive web apps.
  manifest: "/pvs-pwa/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PVS",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: ogIcons,
  // ─── Open Graph (Facebook, LinkedIn, WhatsApp, Discord, Slack…) ───
  openGraph: {
    ...openGraphBase,
    title: siteMeta.title,
    description: siteMeta.description,
    url: "/",
    // `logo` n'est PAS un champ OG officiel mais certains crawlers
    // (Facebook notamment) le lisent comme aperçu alternatif.
    // On le met quand même via `metadata.other` plus bas.
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
  // ─── Twitter Cards ────────────────────────────────────────────────
  twitter: {
    ...twitterBase,
    title: siteMeta.title,
    description: siteMeta.description,
    // Si vous avez un compte Twitter/X officiel, renseignez :
    // site: "@pvs_ongd",
    // creator: "@pvs_ongd",
    // Pour l'instant on les omet (réduisent les warnings Twitter si
    // le compte n'existe pas).
    ...(social.twitter
      ? { site: social.twitter, creator: social.twitter }
      : {}),
  },
  // ─── Champs additionnels (générés tels quels dans le <head>) ─────
  other: {
    // Facebook Open Graph — `og:logo` pour l'aperçu profil/partage.
    "og:logo": `${siteUrl}/pvs-pwa/logo-fixed.png`,
    // Bing / Microsoft.
    "msapplication-TileColor": "#3b52c4",
    "msapplication-TileImage": "/pvs-pwa/icons/icon-144x144.png",
    // Sécurité : empêche la transformation automatique des numéros de
    // téléphone en liens cliquables sur iOS Safari (déjà couvert par
    // formatDetection ci-dessus).
    "theme-color": "#3b52c4",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <SiteChrome />
        <main>{children}</main>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ServiceWorkerRegister />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
