import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";

import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { siteMeta } from "@/lib/content";

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

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
