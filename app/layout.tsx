import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";

import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import SiteChrome from "@/components/layout/SiteChrome";
import JsonLd from "@/components/seo/JsonLd";
import { siteMeta } from "@/lib/content";
import { ogImage, organizationJsonLd, siteName, siteUrl } from "@/lib/seo";

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

export const viewport: Viewport = {
  themeColor: "#3b52c4",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteMeta.title,
  description: siteMeta.description,
  alternates: { canonical: "/" },
  applicationName: "PVS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PVS",
  },
  icons: {
    icon: [
      {
        url: "/pvs-pwa/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/pvs-pwa/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [{ url: "/pvs-pwa/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: "/",
    siteName,
    locale: "fr_FR",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: [ogImage.url],
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
